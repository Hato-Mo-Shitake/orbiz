import { IssueError } from "../../../_shared/error";
import { AsyncCommit, Commit } from "../../../_shared/types";
import { UtilsFacades } from "../../../_shared/utils-facades";
import { AnyNote, AnyNoteSemanticOutlinksKey, NoteId, NotePath } from "../../../domain/note";
import { NoteIo } from "../../io/note-io.types";
import { EntryModifiedDRecordHistoryStore } from "../../stores/entry-modified-d-record-history-store";
import { IssueStore } from "../../stores/issue-store";
import { LogStore } from "../../stores/log-store";
import { NoteIndexStore } from "../../stores/note-index-store";
import { OrbizSettingStoreReader } from "../../stores/orbiz-setting-store.types";
import { handleCommand } from "../sub/command/handle-command";


type Deps = {
    noteIo: NoteIo,
    entryModifiedDRecordHistoryStore: EntryModifiedDRecordHistoryStore,
    noteIndexStore: NoteIndexStore,
    issueStore: IssueStore,
    logStore: LogStore,
    orbizSettingStore: OrbizSettingStoreReader,
}


export async function addNoteOutlink(
    request: {
        noteId: NoteId,
        key: AnyNoteSemanticOutlinksKey,
        addId: NoteId,
    },
    deps: Deps,
): Promise<AnyNote> {
    const { noteIndexStore, noteIo, issueStore, logStore } = deps;

    const callback = async () => {
        const { noteId, key, addId } = request;

        const path = noteIndexStore.getPath(noteId);
        const currentNote = await noteIo.get(NotePath.from(path));
        if (!currentNote) {
            throw new IssueError({
                title: "Not found note",
                message: `Not found note, path: ${path}`,
                layer: "app",
                location: "addNoteOutlink()"
            });
        }

        const now = UtilsFacades.clock.nowDateTime();
        const newNote: AnyNote = (() => {
            switch (key) {
                case "belongsTo": {
                    return currentNote.withBelongsTo(
                        currentNote.belongsTo.add(addId)
                    ).entryVersionUp(now);
                }
                case "references": {
                    return currentNote.withReferences(
                        currentNote.references.add(addId)
                    ).entryVersionUp(now);
                }
                case "creators": {
                    if (!("creators" in currentNote)) {
                        throw new IssueError({
                            title: "Invalid note kind",
                            message: `this note has not creators attr, path: ${currentNote.path.value} kind: ${currentNote.kind}`,
                            layer: "app",
                            location: "addNoteOutlink()"
                        });
                    }
                    return currentNote.withCreators(
                        currentNote.creators.add(addId)
                    ).entryVersionUp(now);
                }
            }
        })();


        const commitStack: (Commit | AsyncCommit)[] = [];



        const { oldNote, commit } = await noteIo.save(
            newNote
        );
        commitStack.push(commit);

        commitStack.push(
            noteIndexStore.createCommitUpsertNote(newNote, oldNote)
        );



        return {
            value: newNote,
            commitStack,
        }
    }

    return handleCommand({
        callback,
        issueStore,
        logStore,
        startLogMsg: `add note outlink, id: ${request.noteId.value}`,
        successLogMsg: `add note outlink, id: ${request.noteId.value}`,
        errorLogMsg: `failed to add note outlink, id: ${request.noteId.value}`,
    });
}