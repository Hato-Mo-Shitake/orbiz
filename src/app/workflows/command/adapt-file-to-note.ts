import { IssueError } from "../../../_shared/error";
import { Path } from "../../../_shared/path.vo";
import { AsyncCommit, Commit } from "../../../_shared/types";
import { UtilsFacades } from "../../../_shared/utils-facades";
import { AnyNoteDS } from "../../../domain/note";
import { DRecordIo } from "../../io/d-record-io.types";
import { NoteIo } from "../../io/note-io.types";
import { EntryModifiedDRecordHistoryStore } from "../../stores/entry-modified-d-record-history-store";
import { IssueStore } from "../../stores/issue-store";
import { LogStore } from "../../stores/log-store";
import { NoteIndexStore } from "../../stores/note-index-store";
import { OrbizSettingStoreReader } from "../../stores/orbiz-setting-store.types";
import { RenamedFileValidationStore } from "../../stores/renamed-file-store";
import { assignNoteToDRecord } from "../sub/command/assign-note-to-d-record";
import { handleCommand } from "../sub/command/handle-command";
import { CreateAnyNoteRequest } from "./create-note.types";


type Deps = {
    entryModifiedDRecordHistoryStore: EntryModifiedDRecordHistoryStore,
    noteIo: NoteIo,
    dRecordIo: DRecordIo,
    // orbizFileIo: OrbizFileIo,
    renamedFileValidationStore: RenamedFileValidationStore,
    noteIndexStore: NoteIndexStore,
    issueStore: IssueStore,
    logStore: LogStore,
    orbizSettingStore: OrbizSettingStoreReader,
}

export function adaptFileToNote(
    request: {
        filePath: Path,
        createNoteRequest: CreateAnyNoteRequest
    },
    deps: Deps,
) {
    const { noteIo, dRecordIo, noteIndexStore, renamedFileValidationStore, issueStore, logStore, orbizSettingStore } = deps;

    const { filePath, createNoteRequest } = request;
    const callback = async () => {
        const commitStack: (Commit | AsyncCommit)[] = [];

        const now = UtilsFacades.clock.nowDateTime();
        const spaceName = orbizSettingStore.get().spaceName;
        const newNoteEntry = AnyNoteDS.createNewAnyNoteEntry(createNoteRequest, now, spaceName);
        const note = AnyNoteDS.constructNote(newNoteEntry);

        const existingNoteIdAsSameName = noteIndexStore.findIdByName(note.name);
        if (existingNoteIdAsSameName !== undefined) {
            throw new IssueError({
                title: "Command Error: adaptFileToNote",
                layer: "app",
                location: "adaptFileToNote()",
                message: `already exists note name, name: ${note.name.value}, id: ${existingNoteIdAsSameName}`,
            });
        }

        commitStack.push(() => {
            renamedFileValidationStore.addValidRenamed({
                oldPath: filePath.value,
                newPath: note.path.value
            });
        })
        commitStack.push(
            await noteIo.adapt(filePath, note)
        );

        const assigned = await assignNoteToDRecord({ note }, {
            dRecordIo,
            orbizSettingStore
        });
        commitStack.push(assigned.commit);


        // noteIndexへの追加してねーじゃん
        const upsert = noteIndexStore.createCommitUpsertNote(
            note
        );
        commitStack.push(upsert);


        return {
            value: note,
            commitStack,
        }
    }

    return handleCommand({
        callback,
        issueStore,
        logStore,
        startLogMsg: `adapt file to note, name: ${createNoteRequest.name.value}`,
        successLogMsg: `file adapted to note, name: ${createNoteRequest.name.value}`,
        errorLogMsg: `failed to adapt file to note, path: ${request.filePath.value}`,
    });
}