import { DateTime } from "../_shared/date-time.vo";
import { Path } from "../_shared/path.vo";
import { PlainDate } from "../_shared/plain-date.vo";
import { PlainYMD } from "../_shared/types";
import { AnyNote, NoteId, NoteName, NotePath } from "../domain/note";
import { DRecord, DRecordId, DRecordPath } from "../domain/note-sub/d-record";

export type NoteSrc = NoteId | NotePath | NoteName;
export type DRecordSrc = DRecordId | DRecordPath | PlainDate | DateTime | PlainYMD | Date;
export interface OrbizResolver {
    existsFile(path: string | Path): boolean;

    findNote(src: NoteSrc): AnyNote | undefined;
    findNoteModifiedAt(src: NoteId | NotePath | NoteName): DateTime | undefined;
    getNote(src: NoteSrc): AnyNote;
    getNoteModifiedAt(src: NoteId | NotePath | NoteName): DateTime;

    findDRecord(src: DRecordSrc): DRecord | undefined;
    getDRecord(src: DRecordSrc): DRecord;
    getDRecordsByYM(src: string | { y: number, m: number }): DRecord[];
}