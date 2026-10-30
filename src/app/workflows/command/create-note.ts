import { IssueError } from "../../../_shared/error";
import { AsyncCommit, Commit } from "../../../_shared/types";
import { UtilsFacades } from "../../../_shared/utils-facades";
import { AnyNote, AnyNoteDS, AnyNoteEntry } from "../../../domain/note";
import { DRecordIo } from "../../io/d-record-io.types";
import { NoteIo } from "../../io/note-io.types";
import { EntryModifiedDRecordHistoryStore } from "../../stores/entry-modified-d-record-history-store";
import { IssueStore } from "../../stores/issue-store";
import { LogStore } from "../../stores/log-store";
import { NoteIndexStore } from "../../stores/note-index-store";
import { OrbizSettingStoreReader } from "../../stores/orbiz-setting-store.types";
import { handleCommand } from "../sub/command/handle-command";

import { upsertNote } from "../sub/command/upsert-note";
import { CreateAnyNoteRequest } from "./create-note.types";

type Deps = {
    // openedNoteStore: OpenedNoteStore,
    // openedDRecordStore: OpenedDRecordStore,
    entryModifiedDRecordHistoryStore: EntryModifiedDRecordHistoryStore,
    noteIo: NoteIo,
    dRecordIo: DRecordIo,
    noteIndexStore: NoteIndexStore,
    issueStore: IssueStore,
    logStore: LogStore,
    orbizSettingStore: OrbizSettingStoreReader,
}

export async function createNote(
    request: CreateAnyNoteRequest,
    deps: Deps,
): Promise<AnyNote> {
    const { noteIndexStore, issueStore, logStore, orbizSettingStore } = deps;

    const callback = async () => {
        const commitStack: (Commit | AsyncCommit)[] = [];

        // 登録時の循環参照を検知するのは一旦置きで。SearchNoteの際に検知はする。

        // note作成
        const newNoteEntry = createNewAnyNoteEntry(
            request,
            orbizSettingStore
        );
        const note = AnyNoteDS.constructNote(newNoteEntry);


        // NOTE: ここ、本当は実体を直接読み取りたいけど、一旦パフォーマンス重視でこう。
        const existingNoteIdAsSameName = noteIndexStore.findIdByName(note.name);
        if (existingNoteIdAsSameName !== undefined) {
            throw new IssueError({
                title: "Command Error: createNote",
                layer: "app",
                location: "createNote()",
                message: `already exists note name, name: ${note.name.value}, id: ${existingNoteIdAsSameName}`,
            });
        }

        const { oldNote, commit } = await upsertNote(note, deps);
        if (oldNote) {
            throw new IssueError({
                title: "CommandError: createNote",
                layer: "app",
                location: "createNote()",
                message: `already exists note, id: ${oldNote.id.value}`,
            });
        }
        commitStack.push(commit);
        return {
            value: note,
            commitStack,
        }
    }

    return handleCommand({
        callback,
        issueStore,
        logStore,
        startLogMsg: `create ${request.kind} note, name: ${request.name.value}`,
        successLogMsg: `${request.kind} note created, name: ${request.name.value}`,
        errorLogMsg: `failed to create ${request.kind} note, name: ${request.name.value}`,
    });
}


// NoteDSへ
function createNewAnyNoteEntry(
    request: CreateAnyNoteRequest,
    orbizSettingStore: OrbizSettingStoreReader,
): AnyNoteEntry {


    const now = UtilsFacades.clock.nowDateTime();
    return AnyNoteDS.createNewAnyNoteEntry(request, now, orbizSettingStore.get().spaceName);


    // const path = NotePath.createByNameAndKind({
    //     noteName: request.name,
    //     kind: request.kind,
    //     spaceName: orbizSettingStore.get().spaceName,
    // });
    // const noteCoreEntry = {
    //     entryVersion: 1,
    //     createdAt: now,
    //     entryModifiedAt: now,
    //     id: NoteId.generate(),
    //     path,
    // }

    // return {
    //     ...noteCoreEntry,
    //     ...request,
    // }
}