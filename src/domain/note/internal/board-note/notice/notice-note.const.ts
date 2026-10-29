import { boardNoteDateKeys, boardNoteSemanticOutlinksKeys } from "../board-note.const";
import { NoticeNoteDateKey, NoticeNoteSemanticOutlinksKey } from "./notice-note.types";

export const noticeNoteUniqueDateKeys = [

] as const;
export const noticeNoteDateKeys = [
    ...boardNoteDateKeys,
    ...noticeNoteUniqueDateKeys
] as const;
export function isNoticeNoteDateKey(key: unknown): key is NoticeNoteDateKey {
    return boardNoteDateKeys.includes(key as NoticeNoteDateKey);
}

export const noticeNoteUniqueSemanticOutlinksKeys = [
] as const;
export const noticeNoteSemanticOutlinksKeys = [
    ...boardNoteSemanticOutlinksKeys,
    ...noticeNoteUniqueSemanticOutlinksKeys,
] as const;

export function isNoticeNoteSemanticOutlinksKey(key: unknown): key is NoticeNoteSemanticOutlinksKey {
    return noticeNoteSemanticOutlinksKeys.includes(key as NoticeNoteSemanticOutlinksKey);
}