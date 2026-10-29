import { MyNoteKind, NoteEntry } from "../note.types";
import { CreatoriumNote } from "./creatorium/creatorium-note";
import { CreatoriumNoteEntry } from "./creatorium/creatorium-note.types";
import { FaqNote } from "./faq/faq-note";
import { FaqNoteEntry } from "./faq/faq-note.types";
import { GalleryNote } from "./gallery/gallery-note";
import { GalleryNoteEntry } from "./gallery/gallery-note.types";
import { KnowledgeNote } from "./knowledge/knowledge-note";
import { KnowledgeNoteEntry } from "./knowledge/knowledge-note.types";
import { myNoteDateKeys, myNoteSemanticOutlinksKeys, noteWeightList } from "./my-note.const";
import { NoteWeight } from "./note-weight.vo";

export type NoteWeightValue = typeof noteWeightList[number];

export type MyNoteSemanticOutlinksKey = typeof myNoteSemanticOutlinksKeys[number];
// export type MyNoteSemanticDateKey = typeof myNoteSemanticDateKeys[number];
export type MyNoteDateKey = typeof myNoteDateKeys[number];

export type MyNoteEntry = NoteEntry & Readonly<{
    weight: NoteWeight,
    kind: MyNoteKind
}>

export type AnyMyNote =
    | KnowledgeNote | GalleryNote | CreatoriumNote | FaqNote;
export type AnyMyNoteEntry =
    | KnowledgeNoteEntry | GalleryNoteEntry | CreatoriumNoteEntry | FaqNoteEntry;