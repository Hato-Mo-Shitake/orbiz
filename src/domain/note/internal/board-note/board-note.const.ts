import { noteDateKeys, noteSemanticOutlinksKeys } from "../note.const";
import { BoardNoteDateKey, BoardNoteSemanticOutlinksKey, NotePriorityValue } from "./board-note.types";

export const boardNoteUniqueSemanticOutlinksKeys = [
] as const;
export const boardNoteSemanticOutlinksKeys = [
    ...noteSemanticOutlinksKeys,
    ...boardNoteUniqueSemanticOutlinksKeys,
] as const;
export function isBoardNoteSemanticOutlinksKey(key: unknown): key is BoardNoteSemanticOutlinksKey {
    return boardNoteSemanticOutlinksKeys.includes(key as BoardNoteSemanticOutlinksKey);
}

export const boardNoteUniqueDateKeys = [
    "resolvedAt"
] as const;
export const boardNoteDateKeys = [
    ...noteDateKeys,
    ...boardNoteUniqueDateKeys,
] as const;
export function isBoardNoteDateKey(key: unknown): key is BoardNoteDateKey {
    return boardNoteDateKeys.includes(key as BoardNoteDateKey);
}

export const notePriorityList = [
    "low",
    "normal",
    "high"
] as const;
export function isNotePriorityValue(weight: unknown): weight is NotePriorityValue {
    return notePriorityList.includes(weight as NotePriorityValue);
}