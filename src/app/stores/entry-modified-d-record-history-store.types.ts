import { Unsubscribe } from "../../_shared/types";
import { DRecord, DRecordIdList } from "../../domain/note-sub/d-record";

export type HandleDRecordSaved = (newDRecord: DRecord, oldDRecord?: DRecord) => void;

export interface EntryModifiedDRecordHistoryStoreReader {
    get(): DRecordIdList;
    subscribe(listener: HandleDRecordSaved): Unsubscribe;
}