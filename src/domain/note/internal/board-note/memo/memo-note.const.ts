import { boardNoteDateKeys, boardNoteSemanticOutlinksKeys } from "../board-note.const";
import { MemoNoteDateKey, MemoNoteSemanticOutlinksKey } from "./memo-note.types";

export const memoNoteUniqueDateKeys = [
] as const;
export const memoNoteDateKeys = [
    ...boardNoteDateKeys,
    ...memoNoteUniqueDateKeys
] as const;
export function isMemoNoteDateKey(key: unknown): key is MemoNoteDateKey {
    return boardNoteDateKeys.includes(key as MemoNoteDateKey);
}

export const memoNoteUniqueSemanticOutlinksKeys = [
] as const;
export const memoNoteSemanticOutlinksKeys = [
    ...boardNoteSemanticOutlinksKeys,
    ...memoNoteUniqueSemanticOutlinksKeys,
] as const;

export function isMemoNoteSemanticOutlinksKey(key: unknown): key is MemoNoteSemanticOutlinksKey {
    return memoNoteSemanticOutlinksKeys.includes(key as MemoNoteSemanticOutlinksKey);
}