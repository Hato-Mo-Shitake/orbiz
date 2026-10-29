import { MyNoteEntry } from "../my-note.types";
import { creatoriumNoteDateKeys, creatoriumNoteSemanticOutlinksKeys } from "./creatorium-note.const";

export type CreatoriumNoteEntry = MyNoteEntry & Readonly<{
    kind: "creatorium"
}>

export type CreatoriumNoteDateKey = typeof creatoriumNoteDateKeys[number];
export type CreatoriumNoteSemanticOutlinksKey = typeof creatoriumNoteSemanticOutlinksKeys[number];