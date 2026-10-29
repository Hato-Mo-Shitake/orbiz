import { ORBIZ } from "../../../_shared/const";
import { IssueError } from "../../../_shared/error";
import { Path } from "../../../_shared/path.vo";
import { AsyncCommit, Commit } from "../../../_shared/types";
import { UtilsFacades } from "../../../_shared/utils-facades";
import { AnyNote, anyNoteDateKeys, AnyNoteDS, anyNoteSemanticOutlinksKeys, NoteId, NotePath } from "../../../domain/note";
import { DRecord, DRecordId } from "../../../domain/note-sub/d-record";
import { DRecordIo } from "../../io/d-record-io.types";
import { NoteIo } from "../../io/note-io.types";
import { OrbizFileIo } from "../../io/orbiz-file-io.types";
import { OrbizResolver } from "../../orbiz-resolver.types";
import { EntryModifiedDRecordHistoryStore } from "../../stores/entry-modified-d-record-history-store";
import { IssueStore } from "../../stores/issue-store";
import { LogStore } from "../../stores/log-store";
import { NoteIndexStore } from "../../stores/note-index-store";

import { OrbizSettingStoreReader } from "../../stores/orbiz-setting-store.types";
import { RenamedFileValidationStore } from "../../stores/renamed-file-store";


import { searchNoteByLinkNote } from "../query/search-note-by-link-note";
import { handleCommand } from "../sub/command/handle-command";

type Deps = {
    orbizResolver: OrbizResolver,

    orbizFileIo: OrbizFileIo,
    noteIo: NoteIo,
    dRecordIo: DRecordIo,
    // openedNoteStore: OpenedNoteStore,
    noteIndexStore: NoteIndexStore,
    entryModifiedDRecordHistoryStore: EntryModifiedDRecordHistoryStore,
    renamedFileValidationStore: RenamedFileValidationStore,
    issueStore: IssueStore,
    logStore: LogStore,
    orbizSettingStore: OrbizSettingStoreReader,
}

export async function trashNote(
    request: NoteId,
    deps: Deps,
): Promise<Path> {
    const {
        noteIo,
        dRecordIo,
        orbizFileIo,

        // openedNoteStore,
        noteIndexStore,
        renamedFileValidationStore,
        entryModifiedDRecordHistoryStore,
        issueStore,
        logStore,
        orbizSettingStore
    } = deps;

    const callback = async () => {
        const spaceName = orbizSettingStore.get().spaceName;
        const commitStack: (Commit | AsyncCommit)[] = [];

        const trashNotePath = NotePath.from(
            noteIndexStore.getSource(request).path
        );

        const trashNote = await noteIo.get(trashNotePath);
        if (trashNote === undefined) {
            throw new IssueError({
                severity: "fatal",
                title: "Not found note",
                location: "trash-note.ts",
                layer: "app",
                message: `not found note, path: ${trashNotePath.value}`
            });
        }

        // WARNING: 永続化処理の一部だが、キャッシュ頼りにならざるを得ない箇所。検討の余地あり
        const inlinkNotes = searchNoteByLinkNote({
            noteIds: trashNote.id,
            inKeys: anyNoteSemanticOutlinksKeys,
            direction: "inlink",
            dataType: "note",
        }, deps);

        const now = UtilsFacades.clock.nowDateTime();
        if (inlinkNotes.isNotEmpty()) {
            const outlinkNotes: AnyNote[] = [];
            // NOTE: noteしか捕捉していないので、ArchiveNote等を追加する際は注意
            for (const note of inlinkNotes) {
                outlinkNotes.push(note);
            }

            for (const note of outlinkNotes) {
                const saveNote = AnyNoteDS.removeSemanticOutlinks(trashNote.id, note).entryVersionUp(now);
                const save = await noteIo.save(saveNote);
                commitStack.push(save.commit);
                commitStack.push(
                    noteIndexStore.createCommitUpsertNote(saveNote, save.oldNote)
                );
            }
        }

        // const now = UtilsFacades.clock.nowDateTime();
        const newTrashPath = Path.fromStringArray([
            ORBIZ,
            spaceName,
            "trashed-notes",
            now.toString("yyyy"),
            trashNotePath.name.value + ".md"
        ]);

        // 実際にPathが起こる前に追加する必要がある。
        commitStack.push(
            () => renamedFileValidationStore.addValidRenamed({
                oldPath: trashNote.path.value,
                newPath: newTrashPath.value
            })
        );



        const dRecordMap: Map<string, DRecord> = new Map();
        for (const dateKey of anyNoteDateKeys) {
            const date = AnyNoteDS.extractNoteDate(trashNote, dateKey);
            if (!date) continue;
            const dateString = date.toString("yyyy-MM-dd");
            const dRecordPath = DRecordId.from(date).toPath(spaceName)
            const trashDRecord = dRecordMap.get(dateString)
                ?? (await dRecordIo.get(dRecordPath))?.entryVersionUp(now);

            if (!trashDRecord) {
                // これなんかおかしくない？？？？
                // エラーを投げるべきな気がする。
                // trashDRecord = DRecord.create(
                //     { date: date },
                //     spaceName,
                // );
                throw new IssueError({
                    title: "CommandError: trashNote",
                    layer: "app",
                    location: "trashNote()",
                    message:
                        `No DRecord trashed to note-id. ` +
                        `trash-note id: ${trashNote.id.value}, date key: ${dateKey}, date: ${dateString}`,
                });
            }

            dRecordMap.set(
                dateString,
                trashDRecord.removeNoteId(dateKey, trashNote.id),
            );
        }
        for (const saveRecord of dRecordMap.values()) {
            const { commit, oldDRecord } = await dRecordIo.save(saveRecord);
            commitStack.push(commit);
            commitStack.push(() => {
                entryModifiedDRecordHistoryStore.set(saveRecord, oldDRecord)
            })
        }

        commitStack.push(async () => {
            const rename = await orbizFileIo.rename(trashNotePath, newTrashPath);
            await rename();
            // TODO: 現状、不可逆のTrashになっている。可逆にする場合は、元のinlinkNotesの情報をここで追加する。

            // 更新する対象はRename後のファイルなので、同じコールバックに入れる。
            const add = await orbizFileIo.addMetadata(newTrashPath, {
                trashedAt: now.toString()
            })
            await add();
        });

        // インデックスを消すのは最後
        commitStack.push(
            noteIndexStore.createCommitDeleteNote(trashNote)
        );

        return {
            value: newTrashPath,
            commitStack
        }
    }

    return handleCommand({
        callback,
        issueStore,
        logStore,
        startLogMsg: `trash note, id: ${request.value}`,
        successLogMsg: `note trashed, id: ${request.value}`,
        errorLogMsg: `failed to trash note, id: ${request.value}`,
    });
}