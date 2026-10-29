import { DateTime } from "../../../../_shared/date-time.vo";
import { AnyNoteDateKey, AnyNoteSemanticDateKey, AnyNoteSemanticOutlinksKey, NoteIdList, NoteNameList } from "../../../../domain/note";


export type AnyNoteSemanticOutlinkIdsRecord = Record<AnyNoteSemanticOutlinksKey, NoteIdList>;
export type AnyNoteSemanticOutlinkNamesRecord = Record<AnyNoteSemanticOutlinksKey, NoteNameList>;

export type AnyNoteSemanticDateRecord = Record<AnyNoteSemanticDateKey, DateTime | null>;
export type AnyNoteDateRecord = Record<AnyNoteDateKey, DateTime | null>;