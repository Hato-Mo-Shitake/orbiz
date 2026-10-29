import { DRecordNoteIdsKey } from "../../../../domain/note-sub/d-record";

export function createDRecordNoteIdsKey(key: DRecordNoteIdsKey): string {
    return `noteIds-${key}`;
}