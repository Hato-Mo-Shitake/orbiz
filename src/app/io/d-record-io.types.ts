import { AsyncCommit } from "../../_shared/types";
import { DRecord, DRecordPath } from "../../domain/note-sub/d-record";

export type DRecordIo = DRecordWriter & DRecordReader;

export interface DRecordWriter {
    save(record: DRecord): Promise<{
        oldDRecord?: DRecord,
        commit: AsyncCommit
    }>;
}

export interface DRecordReader {
    get(path: DRecordPath): Promise<DRecord | undefined>;
}