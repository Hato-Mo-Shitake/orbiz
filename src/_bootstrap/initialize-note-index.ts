/* eslint-disable no-restricted-imports -- bootstrapでは許可*/

import { App, TFile, TFolder } from "obsidian";
import { ORBIZ } from "../_shared/const";
import { IssueError } from "../_shared/error";
import { Path } from "../_shared/path.vo";
import { extractBaseNameFromPath } from "../_shared/utils";
import { IssueStore } from "../app/stores/issue-store";
import { IndexNoteListType, NoteIndex, NoteNameIndex, NoteRegistry } from "../app/stores/note-index-store.types";
import { AnyNote, AnyNoteDS, anyNoteSemanticOutlinksKeys, NoteId, NoteIdList, NoteKind, noteKindList, NoteNameList, NotePath, NoteTagList } from "../domain/note";
import { constructNoteByFm } from "../infra/internal/obsidian/utils/construct-note-by-fm";

export type InitializeNoteIndex = (
    app: App,
    spaceName: string
) => NoteIndex;

export async function initializeNoteIndex(
    app: App,
    spaceName: string,
    issueStore: IssueStore,
): Promise<NoteIndex> {
    const noteFolderPath = Path.toJoinString([
        ORBIZ,
        spaceName,
        NotePath.getFolderName()
    ]);
    let noteFolder = app.vault.getFolderByPath(noteFolderPath);
    if (!noteFolder) {
        noteFolder = await app.vault.createFolder(noteFolderPath);
    }

    const { draftRegistry, cachedNotes } = prepare(app, noteFolder, issueStore);

    const registry = draftRegistry;
    const nameIndex: NoteNameIndex = new Map();
    const tagIndex = new Map<string, NoteIdList>();
    const draftTagList = new Set<string>();
    const draftNoteListMap = {
        topNote: new Set<string>(),
        unresolved: new Set<string>(),
    }
    const draftNoteNameListByKindMap = {
        knowledge: new Set<string>(),
        gallery: new Set<string>(),
        creatorium: new Set<string>(),
        faq: new Set<string>(),
        task: new Set<string>(),
        schedule: new Set<string>(),
        notice: new Set<string>(),
        memo: new Set<string>(),
    }

    const invalidIds: string[] = [];

    for (const note of cachedNotes) {
        /**
         * inlinks index
         */
        const outlinksMap = AnyNoteDS.extractNoteSemanticOutlinksMap(note);
        for (const key of anyNoteSemanticOutlinksKeys) {
            const outlinks = outlinksMap[key];
            if (!outlinks || outlinks.isEmpty()) continue;

            for (const outlinkId of outlinks) {
                const outlinkSource = registry.get(outlinkId.value);
                if (!outlinkSource) {
                    // NOTE: 効率を重視するなら、ArchivedNote導入時、ここにArchivedNote用のキャッシュ作成処理を書くのもあり。
                    // ただしその場合、検知できるのはNoteが参照してるものだけ。
                    // Noteに参照されず、ArchiveNoteのみがNoteを参照しているケースは別枠。
                    // ただ真っ当に運用する場合、上位Noteがアーカイブ化している（「notes/」に存在しない）にもかかわらず、
                    // 下位Noteがアーカイブ化されず、Noteのまま残っているというケースは想定しにくい。
                    // 要するに、処理がここに入ってくるのはあまり望ましくない。
                    // references絡みであれば、ありえないとも言い切れないが、、、。
                    // 厳密な管理を行うなら、ここで warnのIssueを発行してもいい。
                    // あるいは、ArchiveNoteを導入する時に、
                    // 「上位Noteをアーカイブ化する際はその下位Note全てもArchive化される」という仕様をつけてもいいかもしれない。
                    // そうなると、「MyNoteは必ずBoardNoteより上位の位置に置く（MyNoteのsemantic-outlinksにBoardNoteを置くことはできない ）」
                    // みたいな制限も欲しくなる。

                    // 現状、ArchiveNoteのようなものはないので、該当Noteがない場合はissue
                    issueStore.add({
                        title: "Not found note",
                        message: `Note found note in registry, id: ${outlinkId.value}`,
                        layer: "bootstrap",
                        location: "initialize-note-index.ts",
                    });
                    continue;
                }
                const nextIds = outlinkSource.inlinkNoteIds[key];
                outlinkSource.inlinkNoteIds[key] = nextIds.add(note.id);
            }
        }

        /**
         * note name index
         */
        const idByDuplicatedName
            = nameIndex.get(note.name.value);
        if (idByDuplicatedName) {
            throw new IssueError({
                title: "InitializeNote Error",
                location: "initialize-note-index.ts",
                layer: "bootstrap",
                message: `duplicated note name, 
                path1: ${note.path.value},
                path2: ${registry.get(idByDuplicatedName)?.path || "unknown"}
                `
            });
            invalidIds.push(note.id.value);
        }
        nameIndex.set(note.name.value, note.id.value);
        draftNoteNameListByKindMap[note.kind].add(note.name.value);

        /**
         * note tag index
         */
        for (const tag of note.tags) {
            const ids = tagIndex.get(tag.value);
            if (ids) {
                const next = ids.add(note.id);
                tagIndex.set(tag.value, next);
            } else {
                tagIndex.set(tag.value, NoteIdList.from([note.id]));
                draftTagList.add(tag.value);
            }
        }

        if (note.isTop()) {
            draftNoteListMap["topNote"].add(note.id.value);
        }

        if ("resolvedAt" in note && note.isUnresolved()) {
            draftNoteListMap["unresolved"].add(note.id.value);
        }
    }

    for (const id of invalidIds) {
        const source = registry.get(id);

        for (const [tag, ids] of tagIndex) {
            const next = ids.remove(NoteId.from(id));
            if (next.isEmpty()) {
                tagIndex.delete(tag);
                draftTagList.delete(tag);
            } else {
                tagIndex.set(tag, next);
            }
        }

        if (source) {
            const baseName = extractBaseNameFromPath(source.path);
            nameIndex.delete(baseName);
            for (const kind of noteKindList) {
                draftNoteNameListByKindMap[kind].delete(baseName);
            }

            registry.delete(id);
        }
    }

    const getIdList = (key: IndexNoteListType) => {
        return NoteIdList.fromStringSet(draftNoteListMap[key]);
    }
    const getNameList = (kind: NoteKind) => {
        return NoteNameList.from(draftNoteNameListByKindMap[kind]);
    }

    return {
        registry,
        tagIndex,
        tagList: NoteTagList.fromStringSet(draftTagList),
        nameIndex,
        nameListByKindMap: {
            gallery: getNameList("gallery"),
            knowledge: getNameList("knowledge"),
            creatorium: getNameList("creatorium"),
            faq: getNameList("faq"),
            task: getNameList("task"),
            schedule: getNameList("schedule"),
            notice: getNameList("notice"),
            memo: getNameList("memo"),

        },
        noteListMap: {
            topNote: getIdList("topNote"),
            unresolved: getIdList("unresolved"),
        },
    }
}

function prepare(
    app: App,
    noteFolder: TFolder,
    issueStore: IssueStore,
): {
    draftRegistry: NoteRegistry,
    cachedNotes: AnyNote[]
} {
    const draftRegistry: NoteRegistry = new Map();
    const cachedNotes: AnyNote[] = [];
    const cacheNote = (file: TFile) => {
        try {
            if (file.extension !== "md") return;

            const path = file.path;
            const notePath = NotePath.from(path);

            const cache = app.metadataCache.getFileCache(file);
            const fm = cache?.frontmatter;
            if (!fm) {
                throw new IssueError({
                    layer: "bootstrap",
                    location: "initialize-note-index.ts",
                    title: "Not found frontmatter cache",
                    message: `Not found frontmatter cache, path: ${path}`
                });
            }

            const note = constructNoteByFm(notePath, fm);
            cachedNotes.push(note);

            const emptyNoteIds = NoteIdList.empty();
            draftRegistry.set(note.id.value, {
                id: note.id.value,
                path: note.path.value,
                entryVersion: note.entryVersion,
                inlinkNoteIds: {
                    belongsTo: emptyNoteIds,
                    references: emptyNoteIds,
                    creators: emptyNoteIds,
                }
            })
        } catch (e) {
            if (e instanceof IssueError) {
                e.title = "Error: Initialize note-index"
                e.severity = "fatal";
                issueStore.add(e);
            } else {
                const msg = e instanceof Error ? e.message : "unknown";
                const stackTrace = e instanceof Error ? e.stack : undefined;
                issueStore.add({
                    title: "Initialize NoteIndex Error",
                    location: "initialize-note-index.ts",
                    layer: "bootstrap",
                    message: `Failed to setNoteIndex(), path: ${file.path}. cause: ${msg}`,
                    severity: "fatal",
                    stackTrace: stackTrace,
                });
            }
        }
    }
    const setFolderIndex = (folder: TFolder) => {
        for (const t of folder.children) {
            if (t instanceof TFile) {
                cacheNote(t);
            }
            if (t instanceof TFolder) {
                setFolderIndex(t);
            }
        }
    }
    setFolderIndex(noteFolder);

    return {
        draftRegistry,
        cachedNotes,
    };
}

/* eslint-enable -- 終了*/