import { BoardNoteKind, MyNoteKind, NoteKind, NoteSemanticOutlinksKey } from "./note.types";

export const NOTE_DOMAIN_NAME = "Note" as const;

export const noteDateKeys = [
    "createdAt",
    "entryModifiedAt"
] as const;
export const noteSemanticDateKeys = [
] as const;

export const noteSemanticOutlinksKeys = [
    "belongsTo",
    "references"
] as const;
export function isNoteSemanticOutlinkKey(key: unknown): key is NoteSemanticOutlinksKey {
    return noteSemanticOutlinksKeys.includes(key as NoteSemanticOutlinksKey);
}

export const myNoteKindList = [
    "knowledge",
    "creatorium",
    "gallery",
    "faq",
] as const;
export function isNoteKind(value: unknown): value is NoteKind {
    return noteKindList.includes(value as NoteKind);
}

// TODO: この辺りの定義は、my-note/ board-note/ に移した方がいいかも？ 
// そもそもnoteドメインディレクトリの構成を見直した方がいいかも。
export const boardNoteKindList = [
    "task",
    "schedule",
    "notice",
    "memo",
] as const;
export function isMyNoteKind(value: unknown): value is MyNoteKind {
    return myNoteKindList.includes(value as MyNoteKind);
}
export const noteKindList = [
    ...myNoteKindList,
    ...boardNoteKindList,
] as const;
export function isBoardNoteKind(value: unknown): value is BoardNoteKind {
    return boardNoteKindList.includes(value as BoardNoteKind);
}