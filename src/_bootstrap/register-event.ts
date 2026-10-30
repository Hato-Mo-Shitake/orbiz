/* eslint-disable no-restricted-imports -- bootstrap内では許可 */

import { FileView, MarkdownView, Plugin, TAbstractFile, TFile, Workspace } from "obsidian";
import { ORBIZ } from "../_shared/const";
import { IssueError } from "../_shared/error";
import { Path } from "../_shared/path.vo";
import { AsyncCommit, Commit } from "../_shared/types";
import { UtilsFacades } from "../_shared/utils-facades";
import { IoMap } from "../app/io/io.types";
import { NoteIo } from "../app/io/note-io.types";
import { OrbizResolver } from "../app/orbiz-resolver.types";
import { OrbizSpace } from "../app/orbiz-space.types";
import { IssueStore } from "../app/stores/issue-store";
import { NoteIndexStore } from "../app/stores/note-index-store";
import { OpenedFileStore } from "../app/stores/opened-file-store";
import { RenamedFileValidationStore } from "../app/stores/renamed-file-store";
import { StoreMap } from "../app/stores/store.types";
import { CommandMap } from "../app/workflows/command/command";
import { NoteId, NoteIdList, NoteName, NotePath } from "../domain/note";
import { DRecordPath } from "../domain/note-sub/d-record";
import { ObsidianOrbizFileCache } from "../infra/internal/obsidian/orbiz-file-cache";
import { tryConstructNoteByFm } from "../infra/internal/obsidian/utils/construct-note-by-fm";
import { validateInteger } from "../infra/internal/obsidian/utils/validate-fm-value";
import { renderAlertModal } from "../ui/modal/alert-modal";
import { renderNoteAdaptorModal } from "../ui/modal/note-adaptor-modal";
import { renderNoteIdWithLinkKeyInputModal } from "../ui/modal/note-id-with-link-key-input-modal";
import { renderNoteNameInputModal } from "../ui/modal/note-name-input-modal";

const modifiedNoteIdsForAssignDRecord = new Set<string>();
export function registerEvent(
    storeMap: StoreMap,
    ioMap: IoMap,
    plugin: Plugin,
    orbizResolver: OrbizResolver,
    orbizSpace: OrbizSpace,
    orbizFileCache: ObsidianOrbizFileCache,
) {
    const ws = plugin.app.workspace;
    const mc = plugin.app.metadataCache;
    const vault = plugin.app.vault;

    const issueStore = storeMap.issueStore;

    plugin.registerEvent(
        mc.on("resolve", file => {
            const fm = mc.getFileCache(file)?.frontmatter;
            if (!fm) return;
            const notePath = NotePath.tryFrom(file.path);
            if (!notePath) return;
            const note = tryConstructNoteByFm(notePath, fm);
            if (!note) return;
            const resolvedLinks = mc.resolvedLinks[file.path];
            if (!resolvedLinks) return;
            const outlinkPaths = Object.keys(resolvedLinks);
            storeMap.noteUnsemanticOutlinksStore.update(note, outlinkPaths);
        })
    );

    plugin.registerEvent(
        mc.on("changed", (file, _, cache) => {
            if (file.path.startsWith(ORBIZ)) {
                // やっぱりパス変更とメタデータ変更は分けて管理したいな。。
                // Obsidianキャッシュの方が先に更新された時、キャッシュの溜まる原因になる。-> keyをpathにするか？
                // const noteId = storeMap.noteIndexStore.findIdByPath(file.path);
                const notePath = NotePath.tryFrom(file.path);
                if (notePath) {
                    const note = orbizFileCache.findNote(notePath);
                    const fm = cache.frontmatter;
                    if (note && fm) {
                        const entryVersionByFm = validateInteger(fm, "entryVersion");
                        if (entryVersionByFm >= note.entryVersion) {
                            orbizFileCache.deleteNote(notePath);
                        }
                    }
                    return;
                }

                const dRecordPath = DRecordPath.tryFrom(file.path);
                if (dRecordPath) {
                    const dRecord = orbizFileCache.findDRecord(dRecordPath);
                    const fm = cache.frontmatter;
                    if (dRecord && fm) {
                        const entryVersionByFm = validateInteger(fm, "entryVersion");
                        if (entryVersionByFm >= dRecord.entryVersion) {
                            orbizFileCache.deleteDRecord(dRecordPath);
                        }
                    }
                    return;
                }

            }
        })
    );

    const orbizInboxFolderPath = Path.toJoinString([
        ORBIZ,
        "inbox"
    ]);
    ws.onLayoutReady(() => {
        plugin.registerEvent(
            vault.on("create", async (file) => {
                await handleNewFileCreatedInbox({
                    file,
                    orbizInboxFolderPath,
                    orbizResolver,
                    orbizSpace,
                    ioMap,
                    storeMap
                });
            })
        )
    });

    plugin.registerEvent(
        vault.on("rename", async (file, oldPath) => {
            try {
                await adjustRenamedFile(
                    file,
                    oldPath,
                    ioMap.noteIo,
                    storeMap.noteIndexStore,
                    storeMap.renamedFileValidationStore,
                    storeMap.issueStore,
                    orbizSpace
                );
            } catch (e) {
                issueStore.addAnyError(e);
            }
        })
    );
    plugin.registerEvent(
        vault.on("modify", (file) => {
            try {
                const path = file.path;
                const id = storeMap.noteIndexStore.findIdByPath(path);
                if (id) {
                    const noteId = NoteId.from(id);
                    storeMap.modifiedNoteHistoryStore.set(noteId);
                    modifiedNoteIdsForAssignDRecord.add(noteId.value);
                }
            } catch (e) {
                issueStore.addAnyError(e);
            }
        })
    );

    plugin.registerEvent(
        ws.on("layout-change", () => {
            syncOpenedPaths(storeMap.openedFileStore, ws);
        })
    );

    plugin.registerEvent(
        ws.on("active-leaf-change", (leaf) => {
            try {
                syncOpenedPaths(storeMap.openedFileStore, ws);

                if (leaf?.view instanceof FileView) {
                    const path = leaf.view.file?.path;
                    if (path?.startsWith(ORBIZ)) {

                        leaf.view.containerEl.addClass("orbiz-view");

                        storeMap.latestActiveOrbizFileStore.setActivePath(path);


                    }
                }
            } catch (e) {
                issueStore.addAnyError(e);
            }
        })
    );

    const handleInterval = async () => {
        try {
            const today = UtilsFacades.clock.nowPlainDate();

            // 日付変更判定
            storeMap.todayStore.update(today);

            // modified note d-recordに追加
            const modifiedNoteIds = NoteIdList.fromStringSet(modifiedNoteIdsForAssignDRecord);
            await CommandMap.assignModifiedNotesToDRecord(
                today,
                modifiedNoteIds,
                { ...storeMap, ...ioMap }
            );
            modifiedNoteIdsForAssignDRecord.clear();
        } catch (e) {
            issueStore.addAnyError(e);
        }
    }
    // 3分ごと
    plugin.registerInterval(window.setInterval(() => {
        void handleInterval();
    }, 3 * 60 * 1000));


    storeMap.openedFileStore.subscribe(() => {
        storeMap.openedFileStore.getPaths()
        // storeMap.openedNoteStore.syncOpenedPaths(paths);
        // storeMap.openedDRecordStore.syncOpenedPaths(paths)
    });
}

/**
 * Observer
 */
function syncOpenedPaths(
    openedFileStore: OpenedFileStore,
    ws: Workspace,
) {
    const openedPaths: string[] = [];

    ws.iterateAllLeaves(leaf => {
        // 一旦MarkdownView限定
        if (leaf.view instanceof MarkdownView && leaf.view.file) {
            openedPaths.push(leaf.view.file.path);
            return;
        }
    });

    openedFileStore.setPaths(openedPaths);
}
async function handleNewFileCreatedInbox({
    file, orbizInboxFolderPath, storeMap, ioMap, orbizSpace, orbizResolver
}: {
    file: TAbstractFile,
    orbizInboxFolderPath: string,
    storeMap: StoreMap,
    ioMap: IoMap,
    orbizSpace: OrbizSpace,
    orbizResolver: OrbizResolver,
}) {
    if (file instanceof TFile && file.path.startsWith(orbizInboxFolderPath) && file.extension === "md") {

        const latestActiveNotePath = storeMap.latestActiveOrbizFileStore.getPath("note");
        const latestActiveNoteId = latestActiveNotePath?.value
            ? storeMap.noteIndexStore.findIdByPath(latestActiveNotePath.value)
            : undefined;

        const rootNoteIdWithLinkKey = await orbizSpace.modal.openAndGetResult(renderNoteIdWithLinkKeyInputModal, {
            title: `Select note, which outlink to file adapted to new note: ${file.path}`,
            defaultNoteId: latestActiveNoteId ? NoteId.tryFrom(latestActiveNoteId) : undefined,
            storeMap,
            orbizResolver
        });

        const newNote = await orbizSpace.modal.openAndGetResult(renderNoteAdaptorModal, {
            defaultParams: {
                name: NoteName.tryFrom(file.basename) || undefined,
            },
            filePath: Path.from(file.path),
            orbizSpace,
            orbizResolver,
            storeMap,
            ioMap,
        });

        if (rootNoteIdWithLinkKey && newNote) {
            await CommandMap.addNoteOutlink({
                noteId: rootNoteIdWithLinkKey.id,
                key: rootNoteIdWithLinkKey.linkKey,
                addId: newNote.id
            }, { ...ioMap, ...storeMap });
        }
    }
}

// 直接fileの名前が変更された時、orbizのシステムに影響が出ないようにする。
async function adjustRenamedFile(
    file: TAbstractFile,
    oldPath: string,
    noteIo: NoteIo,
    noteIndexStore: NoteIndexStore,
    renamedFileValidationStore: RenamedFileValidationStore,
    issueStore: IssueStore,
    orbizSpace: OrbizSpace,
) {
    // 禁止のケース:
    // orbiz/以下のファイル・フォルダのpathを勝手に変更する行為。
    // ただし、notes/ 以下のnote-fileのnameだけ変更するのはOK
    try {
        if (!file.path.startsWith(ORBIZ) && !oldPath.startsWith(ORBIZ)) return;

        const renamedInfo = {
            oldPath: oldPath,
            newPath: file.path,
        }

        if (renamedFileValidationStore.hasValidRenamed(renamedInfo)) {
            renamedFileValidationStore.deleteValidRenamed(renamedInfo)
            return;
        }

        const now = UtilsFacades.clock.nowDateTime();
        const newNotePath = NotePath.tryFrom(file.path);
        const oldNotePath = NotePath.tryFrom(oldPath);
        if (newNotePath && oldNotePath && newNotePath.equalsFolder(oldNotePath)) {
            const commitStack: (Commit | AsyncCommit)[] = [];

            const note = await noteIo.get(newNotePath);
            if (!note) {
                throw new IssueError({
                    severity: "fatal",
                    title: "Not found note",
                    location: "adjustRenamedFile",
                    layer: "bootstrap",
                    message: `Not found note, path: ${newNotePath.value}`
                });
            }

            const newNoteName = note.name;
            const duplicatedNameNoteId = noteIndexStore.findIdByName(newNoteName);

            if (duplicatedNameNoteId) {
                const unDupName = await orbizSpace.modal.openAndGetResult(renderNoteNameInputModal, {
                    title: "ノート名の重複が発生しました。新しいノート名を入力してください。",
                    prohibitedName: newNoteName.value,
                })
                if (!unDupName) {
                    const newNote = note
                        .entryVersionUp(now)
                        .withName(NoteName.from(
                            newNoteName.value + "_" + UtilsFacades.clock.nowTimestamp().toString()
                        ))
                    const saved = await noteIo.save(
                        newNote
                    );

                    const upsertIndex = noteIndexStore.createCommitUpsertNote(newNote, saved.oldNote);

                    commitStack.push(saved.commit);
                    commitStack.push(upsertIndex);

                    commitStack.push(() => {
                        renamedFileValidationStore.addValidRenamed({
                            oldPath: note.path.value,
                            newPath: newNote.path.value
                        })
                    });
                }
            } else {
                // オーバーヘッドがやばそうならリファクタ考慮
                const newNote = note.entryVersionUp(now);
                const saved = await noteIo.save(newNote);
                const upsertIndex = noteIndexStore.createCommitUpsertNote(newNote, saved.oldNote);

                commitStack.push(saved.commit);
                commitStack.push(upsertIndex);
            }

            commitStack.push(() => {
                renamedFileValidationStore.deleteValidRenamed(renamedInfo)
            })

            for (const c of commitStack) {
                await c();
            }

            return;
        }

        // 逆
        const invalidRenamedResolvedInfo = {
            oldPath: file.path,
            newPath: oldPath
        }
        const invalidRenamedResolved = renamedFileValidationStore.getInvalidRenamed(invalidRenamedResolvedInfo)
        if (invalidRenamedResolved) {
            renamedFileValidationStore.deleteInvalidRenamed(invalidRenamedResolvedInfo);
            orbizSpace.modal.open(renderAlertModal, {
                message: `不正なパス変更が修正されました。invalid path resolved: ${oldPath} -> ${file.path}`
            });
        } else {
            renamedFileValidationStore.addInvalidRenamed(renamedInfo);
            orbizSpace.modal.open(renderAlertModal, {
                // TODO: 表示メッセージ改行用のヘルパーが欲しい。
                message: `不正なパス変更が行われました。Orbiz Pluginの一部機能が制限される可能性があります。
                ファイルの位置を元に戻してください。invalid path changed: ${oldPath} -> ${file.path}`
            });
        }

    } catch (e) {
        issueStore.addAnyError(e);
        orbizSpace.modal.open(renderAlertModal, {
            message: `file-pathの直接変更に伴う調整処理に失敗しました。`
        })
    }
}

/* eslint-enable no-restricted-imports -- 終了*/