import { DateTime } from "../../../../_shared/date-time.vo";
import { NoteIdList } from "../../../note";
import { DRecordPath } from "./d-record-path.vo";
import { dRecordNoteIdsKeys } from "./d-record.const";

export type DRecordNoteIdsKey = typeof dRecordNoteIdsKeys[number];
export type DRecordNoteIdsMap = Partial<Record<DRecordNoteIdsKey, NoteIdList>>;
export type DRecordEntry = Readonly<{
    entryVersion: number,
    createdAt: DateTime,
    entryModifiedAt: DateTime,
    path: DRecordPath,
    noteIdsMap: DRecordNoteIdsMap;
}>;
