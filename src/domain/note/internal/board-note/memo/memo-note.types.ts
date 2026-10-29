import { BoardNoteEntry } from "../board-note.types";
import { memoNoteDateKeys, memoNoteSemanticOutlinksKeys } from "./memo-note.const";

export type MemoNoteEntry = BoardNoteEntry & Readonly<{
    kind: "memo"
}>
export type MemoNoteDateKey = typeof memoNoteDateKeys[number];
export type MemoNoteSemanticOutlinksKey = typeof memoNoteSemanticOutlinksKeys[number];