import { IssueError } from "../../../_shared/error";
import { PlainDate } from "../../../_shared/plain-date.vo";
import { AsyncCommit, Commit } from "../../../_shared/types";
import { UtilsFacades } from "../../../_shared/utils-facades";
import { NoteIdList } from "../../../domain/note";
import { DRecord, DRecordId } from "../../../domain/note-sub/d-record";
import { DRecordIo } from "../../io/d-record-io.types";
import { EntryModifiedDRecordHistoryStore } from "../../stores/entry-modified-d-record-history-store";
import { IssueStore } from "../../stores/issue-store";
import { LogStore } from "../../stores/log-store";
import { OrbizSettingStoreReader } from "../../stores/orbiz-setting-store.types";
import { handleCommand } from "../sub/command/handle-command";

export async function assignModifiedNotesToDRecord(
    date: PlainDate,
    noteIds: NoteIdList,
    deps: {
        dRecordIo: DRecordIo,
        entryModifiedDRecordHistoryStore: EntryModifiedDRecordHistoryStore,
        orbizSettingStore: OrbizSettingStoreReader,
        issueStore: IssueStore,
        logStore: LogStore,
    }
): Promise<DRecord> {
    const { dRecordIo, entryModifiedDRecordHistoryStore, orbizSettingStore, issueStore, logStore } = deps;

    const callback = async () => {
        const commitStack: (Commit | AsyncCommit)[] = [];

        const spaceName = orbizSettingStore.get().spaceName;

        const dRecordPath = DRecordId.from(date).toPath(spaceName);
        const dRecord = await dRecordIo.get(dRecordPath);

        const now = UtilsFacades.clock.nowDateTime();

        if (dRecord) {
            if (dRecord.getNoteIds("modifiedAt")?.contains(noteIds)) {
                return {
                    commitStack,
                    value: dRecord
                };
            }

            const newDRecord = dRecord.addNoteId("modifiedAt", noteIds).entryVersionUp(now);
            const updated = await dRecordIo.save(newDRecord);
            commitStack.push(updated.commit);
            commitStack.push(() => {
                entryModifiedDRecordHistoryStore.set(newDRecord, updated.oldDRecord)
            });
            return {
                commitStack,
                value: newDRecord
            }
        }

        // const now = UtilsFacades.clock.nowDateTime();
        const newDRecord = DRecord.construct({
            entryVersion: 1,
            createdAt: now,
            entryModifiedAt: now,
            path: dRecordPath,
            noteIdsMap: {
                modifiedAt: noteIds
            }
        });
        const inserted = await dRecordIo.save(newDRecord);
        if (inserted.oldDRecord) {
            throw new IssueError({
                severity: "fatal",
                layer: "app",
                location: "assignModifiedNotesToDRecord",
                title: "Already DRecord exists",
                message: `already d-record exists, path: ${newDRecord.path.value}`
            });
        }
        commitStack.push(
            inserted.commit
        );
        commitStack.push(() => {
            entryModifiedDRecordHistoryStore.set(newDRecord)
        });
        return {
            value: newDRecord,
            commitStack,
        }
    }

    const pdString = date.toString();
    return handleCommand({
        callback,
        issueStore,
        logStore,
        startLogMsg: `assign modified notes to d-record: ${pdString}`,
        successLogMsg: `modified notes assigned to d-record: ${pdString}`,
        errorLogMsg: `failed to assign modified notes to d-record: ${pdString}`,
    });
}