import { IssueError } from "../../../../_shared/error";
import { AsyncCommit, Commit } from "../../../../_shared/types";
import { AnyNote } from "../../../../domain/note";
import { DRecordIo } from "../../../io/d-record-io.types";
import { NoteIo } from "../../../io/note-io.types";
import { EntryModifiedDRecordHistoryStore } from "../../../stores/entry-modified-d-record-history-store";
import { NoteIndexStore } from "../../../stores/note-index-store";
import { OrbizSettingStoreReader } from "../../../stores/orbiz-setting-store.types";
import { assignNoteToDRecord } from "./assign-note-to-d-record";

type Deps = {
    // openedNoteStore: OpenedNoteStore,
    // openedDRecordStore: OpenedDRecordStore,
    noteIo: NoteIo,
    dRecordIo: DRecordIo,
    entryModifiedDRecordHistoryStore: EntryModifiedDRecordHistoryStore
    noteIndexStore: NoteIndexStore,
    orbizSettingStore: OrbizSettingStoreReader,
}

export async function upsertNote(
    note: AnyNote,
    deps: Deps
): Promise<{
    oldNote?: AnyNote,
    commit: AsyncCommit
}> {
    const { noteIo, dRecordIo, entryModifiedDRecordHistoryStore, noteIndexStore, orbizSettingStore } = deps;

    const commitStack: (Commit | AsyncCommit)[] = [];
    // ここ、本当は実体を直接読み取りたいけど、一旦こうするしかない。
    const existingNoteIdAsSameName = noteIndexStore.findIdByName(note.name);
    if (existingNoteIdAsSameName !== undefined) {
        throw new IssueError({
            title: "SubCommand Error: upsertNote",
            layer: "app",
            location: "upsertNote()",
            message: `already exists note name, name: ${note.name.value}, id: ${existingNoteIdAsSameName}`,
        });
    }

    const { oldNote, commit } = await noteIo.save(note);
    commitStack.push(commit);

    // recordへの書き込み
    const assigned = await assignNoteToDRecord({ note, oldNote }, {
        dRecordIo,
        orbizSettingStore
    });
    commitStack.push(assigned.commit)
    commitStack.push(() => {
        assigned.dRecords.forEach((info) => {
            entryModifiedDRecordHistoryStore.set(info.newDRecord, info.oldDRecord)
        })
    });


    // 削除予定？
    // commitStack.push(() => {
    //     assigned.dRecords.forEach(d => {
    //         openedDRecordStore.updateDRecord(d.newDRecord.path.value, d.newDRecord)
    //     })
    // })



    // commitStack.push(
    //     () => openedNoteStore.updateNote(note.path.value, note)
    // );

    // 最後にindex更新（save時にoldNoteを使うから？）
    commitStack.push(
        noteIndexStore.createCommitUpsertNote(note)
    );

    return {
        oldNote,
        commit: async () => {
            for (const c of commitStack) {
                await c();
            }
        }
    }
}