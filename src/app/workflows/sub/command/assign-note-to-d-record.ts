import { IssueError } from "../../../../_shared/error";
import { AsyncCommit } from "../../../../_shared/types";
import { UtilsFacades } from "../../../../_shared/utils-facades";
import { AnyNote, anyNoteDateKeys, AnyNoteDS } from "../../../../domain/note";
import { DRecord, DRecordId } from "../../../../domain/note-sub/d-record";

import { DRecordIo } from "../../../io/d-record-io.types";
import { OrbizSettingStoreReader } from "../../../stores/orbiz-setting-store.types";

export async function assignNoteToDRecord(
    params: {
        note: AnyNote,
        oldNote?: AnyNote,
    },
    deps: {
        dRecordIo: DRecordIo,
        orbizSettingStore: OrbizSettingStoreReader,
    }
): Promise<{
    dRecords: {
        newDRecord: DRecord,
        oldDRecord?: DRecord,
    }[],
    commit: AsyncCommit
}> {
    const { note, oldNote } = params;
    const { dRecordIo, orbizSettingStore } = deps;
    const spaceName = orbizSettingStore.get().spaceName;

    const dRecordMap: Map<string, DRecord> = new Map();

    const now = UtilsFacades.clock.nowDateTime();
    for (const dateKey of anyNoteDateKeys) {
        const newDate = AnyNoteDS.extractNoteDate(note, dateKey);
        const oldDate = oldNote
            ? AnyNoteDS.extractNoteDate(oldNote, dateKey)
            : undefined;

        const newYmdKey = newDate?.toString("yyyy-MM-dd");
        const oldYmdKey = oldDate?.toString("yyyy-MM-dd");

        // DRecordの日単位で同じなら変更なし
        if (newYmdKey === oldYmdKey) continue;

        if (newDate && newYmdKey) {
            const newDRecordPath = DRecordId.from(newDate).toPath(spaceName)
            let addDRecord = dRecordMap.get(newYmdKey)
                ?? (await dRecordIo.get(newDRecordPath))?.entryVersionUp(now); // この処理怖いな。

            if (!addDRecord) {
                addDRecord = DRecord.create(
                    { date: newDate },
                    spaceName,
                );
            }

            dRecordMap.set(
                newYmdKey,
                addDRecord.addNoteId(dateKey, note.id),
            );
        }

        if (oldDate && oldYmdKey && oldNote
            && (dateKey !== "createdAt" && dateKey !== "entryModifiedAt")
        ) {
            const oldDRecordPath = DRecordId.from(oldDate).toPath(spaceName);
            const removeDRecord = dRecordMap.get(oldYmdKey)
                ?? await dRecordIo.get(oldDRecordPath);

            if (!removeDRecord) {
                throw new IssueError({
                    title: "CommandError: assignNoteToDRecord",
                    layer: "app",
                    location: "assignNoteToDRecord()",
                    message:
                        `No DRecord assigned to this Note exists. ` +
                        `note id: ${oldNote.id.value}, date key: ${dateKey}, date: ${oldYmdKey}`,
                });
            }

            dRecordMap.set(
                oldYmdKey,
                removeDRecord.removeNoteId(dateKey, oldNote.id),
            );
        }
    }

    const commitStack: AsyncCommit[] = [];
    const dRecords: {
        newDRecord: DRecord,
        oldDRecord?: DRecord,
    }[] = [];
    for (const saveRecord of dRecordMap.values()) {
        const { commit, oldDRecord } = await dRecordIo.save(saveRecord);
        commitStack.push(commit);
        dRecords.push({
            newDRecord: saveRecord,
            oldDRecord: oldDRecord
        });
    }

    const commit = async () => {
        for (const commit of commitStack) {
            await commit();
        }
    }

    return { dRecords, commit }
}