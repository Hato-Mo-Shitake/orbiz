import { DateTime } from "../../../_shared/date-time.vo";
import { NoteIdList } from "./note-id-list.vo";
import { NoteId } from "./note-id.vo";
import { NotePath } from "./note-path.vo";
import { NoteTagList } from "./note-tag-list.vo";
import { boardNoteKindList, myNoteKindList, noteDateKeys, noteKindList, noteSemanticOutlinksKeys } from "./note.const";

export type NoteDateKey = typeof noteDateKeys[number];

export type NoteSemanticOutlinksKey = typeof noteSemanticOutlinksKeys[number];

export type NoteKind = typeof noteKindList[number];
export type MyNoteKind = typeof myNoteKindList[number];
export type BoardNoteKind = typeof boardNoteKindList[number];

export type NoteEntry = Readonly<{
    entryVersion: number
    createdAt: DateTime,
    entryModifiedAt: DateTime,
    kind: NoteKind
    id: NoteId,
    path: NotePath,
    tags: NoteTagList,
    belongsTo: NoteIdList,
    references: NoteIdList,
}>;