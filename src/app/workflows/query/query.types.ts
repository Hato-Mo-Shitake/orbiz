import { searchNoteByDate } from "./search-note-by-date";
import { searchNoteByKind } from "./search-note-by-kind";
import { searchNoteByLinkNote } from "./search-note-by-link-note";
import { searchNoteByRootNote } from "./search-note-by-root-note";
import { searchNoteByTag } from "./search-note-by-tag";

export class QueryMap {
    static searchNoteByDate = searchNoteByDate;
    static searchNoteByKind = searchNoteByKind;
    static searchNoteByTag = searchNoteByTag;

    static searchNoteByLinkNote = searchNoteByLinkNote;
    static searchNoteByRootNote = searchNoteByRootNote;
}
