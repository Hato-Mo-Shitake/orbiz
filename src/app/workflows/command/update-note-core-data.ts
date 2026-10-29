
import { CommandError, IssueError } from "../../../_shared/error";
import { AsyncCommit, Commit } from "../../../_shared/types";
import { UtilsFacades } from "../../../_shared/utils-facades";
import { AnyNote, AnyNoteDS, AnyNoteEntry, NoteIdList, NotePath, NotePriority, NoteWeight } from "../../../domain/note";
import { NoteIo } from "../../io/note-io.types";
import { IssueStore } from "../../stores/issue-store";
import { LogStore } from "../../stores/log-store";
import { NoteIndexStore } from "../../stores/note-index-store";
import { OrbizSettingStoreReader } from "../../stores/orbiz-setting-store.types";
import { RenamedFileValidationStore } from "../../stores/renamed-file-store";
import { handleCommand } from "../sub/command/handle-command";
import { UpdateAnyNoteCoreDataRequest } from "./update-note.types";


type Deps = {
    noteIo: NoteIo,
    // dRecordIo: DRecordIo,
    // openedNoteStore: OpenedNoteStore,
    noteIndexStore: NoteIndexStore,
    renamedFileValidationStore: RenamedFileValidationStore,
    issueStore: IssueStore,
    logStore: LogStore,
    orbizSettingStore: OrbizSettingStoreReader,
}

export async function updateNoteCoreData(
    request: UpdateAnyNoteCoreDataRequest,
    deps: Deps,
): Promise<AnyNote> {
    if (!request.kind && !request.name) {
        throw new CommandError("Invalid Request: both name and kind is undefined.");
    }

    const { noteIndexStore, renamedFileValidationStore, noteIo, issueStore, logStore } = deps;

    const callback = async () => {
        const commitStack: (Commit | AsyncCommit)[] = [];

        const newNoteEntry = await createNewAnyNoteEntry(
            request,
            noteIndexStore,
            noteIo
        );

        const note = AnyNoteDS.constructNote(newNoteEntry);

        const saved = await noteIo.save(note);
        const oldNote = saved.oldNote;
        if (!oldNote) {
            throw new IssueError({
                severity: "fatal",
                title: "Not found note",
                message: `not found note, id: ${note.id.value}`,
                location: "updateNoteCoreData",
                layer: "app"
            });
        }

        commitStack.push(
            () => renamedFileValidationStore.addValidRenamed({
                oldPath: oldNote.path.value,
                newPath: note.path.value,
            })
        );


        commitStack.push(
            saved.commit
        );

        // commitStack.push(
        //     () => openedNoteStore.renameNote({
        //         oldPath: oldNote.path.value,
        //         newPath: note.path.value
        //     })
        // );

        // index更新は最後
        commitStack.push(
            noteIndexStore.createCommitUpsertNote(note, saved.oldNote)
        );

        return {
            value: note,
            commitStack,
        }
    }

    return handleCommand({
        callback,
        issueStore,
        logStore,
        startLogMsg: `update note-core-data, id: ${request.id.value}`,
        successLogMsg: `note-core-data updated, id: ${request.id.value}`,
        errorLogMsg: `failed to update note core-data, id: ${request.id.value}`,
    });
}

async function createNewAnyNoteEntry(
    request: UpdateAnyNoteCoreDataRequest,
    noteIndexStore: NoteIndexStore,
    noteIo: NoteIo
): Promise<AnyNoteEntry> {
    const path = noteIndexStore.getSource(request.id).path;
    const currentNote = await noteIo.get(NotePath.from(path));
    if (!currentNote) {
        throw new IssueError({
            severity: "fatal",
            title: "Not found note",
            location: "update-note-core-data.ts",
            layer: "app",
            message: `Not found not, path: ${path}`
        });
    }

    if (request.originalEntryVersion !== currentNote.entryVersion) {
        throw new IssueError({
            severity: "fatal",
            title: "Invalid note entry-version",
            location: "update-note-core-data.ts",
            layer: "app",
            message: `Not equals note entry-version, ${request.originalEntryVersion} !== ${currentNote.entryVersion}`
        });
    }

    let newPath = currentNote.path;

    const kind = request.kind
    if (kind) {
        newPath = newPath.withKind(kind)
    }

    const name = request.name;
    if (name) {
        newPath = newPath.withName(name);
    }

    const now = UtilsFacades.clock.nowDateTime();

    if (kind && kind !== currentNote.kind) {

        const baseEntry = {
            id: currentNote.id,
            createdAt: currentNote.createdAt,
            tags: currentNote.tags,
            belongsTo: currentNote.belongsTo,
            references: currentNote.references,
        }

        // ここら辺の処理、ドメインサービスにまとめた方がいいかも。
        const weight = ("weight" in currentNote) ? currentNote.weight : NoteWeight.from("standard");
        const priority = ("priority" in currentNote) ? currentNote.priority : NotePriority.from("normal");
        const creators = ("creators" in currentNote) ? currentNote.creators : NoteIdList.empty();

        const startedAt = ("startedAt" in currentNote) ? currentNote.startedAt : null;
        const resolvedAt = ("resolvedAt" in currentNote) ? currentNote.resolvedAt : null;
        const dueAt = ("dueAt" in currentNote) ? currentNote.dueAt : null;

        switch (kind) {
            case "knowledge": {
                return {
                    ...baseEntry,
                    weight,
                    kind: "knowledge",
                    entryModifiedAt: now,
                    entryVersion: currentNote.entryVersion + 1,
                    path: newPath,
                }
            }
            case "gallery": {
                return {
                    ...baseEntry,
                    weight,
                    creators,
                    kind: "gallery",
                    entryModifiedAt: now,
                    entryVersion: currentNote.entryVersion + 1,
                    path: newPath,
                }
            }
            case "creatorium": {
                return {
                    ...baseEntry,
                    weight,
                    kind: kind,
                    entryModifiedAt: now,
                    entryVersion: currentNote.entryVersion + 1,
                    path: newPath,
                }
            }
            case "faq": {
                return {
                    ...baseEntry,
                    weight,
                    resolvedAt,
                    kind: kind,
                    entryModifiedAt: now,
                    entryVersion: currentNote.entryVersion + 1,
                    path: newPath,
                }
            }

            case "task": {
                if (!startedAt) {
                    throw new IssueError({
                        title: "Invalid task note",
                        message: "Invalid task note: startedAt is empty",
                        location: "update-note-core-data.ts",
                        layer: "app"
                    });
                }
                if (!dueAt) {
                    throw new IssueError({
                        title: "Invalid task note",
                        message: "Invalid task note: dueAt is empty",
                        location: "update-note-core-data.ts",
                        layer: "app"
                    });
                }
                return {
                    ...baseEntry,
                    priority,
                    startedAt,
                    dueAt,
                    resolvedAt,
                    kind: "task",
                    entryModifiedAt: now,
                    entryVersion: currentNote.entryVersion + 1,
                    path: newPath,
                }
            }
            case "schedule": {
                if (!startedAt) {
                    throw new IssueError({
                        title: "Invalid task note",
                        message: "Invalid task note: startedAt is empty",
                        location: "update-note-core-data.ts",
                        layer: "app"
                    });
                }
                return {
                    ...baseEntry,
                    priority,
                    startedAt,
                    dueAt,
                    resolvedAt,
                    kind,
                    entryModifiedAt: now,
                    entryVersion: currentNote.entryVersion + 1,
                    path: newPath,
                }
            }
            case "notice": {
                return {
                    ...baseEntry,
                    priority,
                    resolvedAt,
                    kind,
                    entryModifiedAt: now,
                    entryVersion: currentNote.entryVersion + 1,
                    path: newPath,
                }
            }
            case "memo": {
                return {
                    ...baseEntry,
                    priority,
                    resolvedAt,
                    kind,
                    entryModifiedAt: now,
                    entryVersion: currentNote.entryVersion + 1,
                    path: newPath,
                }
            }
        }
    } else {
        return {
            ...currentNote.getEntry(),
            entryModifiedAt: now,
            entryVersion: currentNote.entryVersion + 1,
            path: newPath,
        }
    }
}