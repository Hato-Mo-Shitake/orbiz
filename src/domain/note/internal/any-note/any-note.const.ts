import { memoNoteDateKeys, memoNoteSemanticOutlinksKeys } from "../board-note/memo/memo-note.const";
import { noticeNoteDateKeys, noticeNoteSemanticOutlinksKeys } from "../board-note/notice/notice-note.const";
import { scheduleNoteDateKeys, scheduleNoteSemanticOutlinksKeys } from "../board-note/schedule/schedule-note.const";
import { taskNoteDateKeys, taskNoteSemanticOutlinksKeys } from "../board-note/task/task-note.const";
import { creatoriumNoteDateKeys, creatoriumNoteSemanticOutlinksKeys } from "../my-note/creatorium/creatorium-note.const";
import { faqNoteDateKeys, faqNoteSemanticOutlinksKeys } from "../my-note/faq/faq-note.const";
import { galleryNoteDateKeys, galleryNoteSemanticOutlinksKeys } from "../my-note/gallery/gallery-note.const";
import { knowledgeNoteDateKeys, knowledgeNoteSemanticOutlinksKeys } from "../my-note/knowledge/knowledge-note.const";
import { noteDateKeys, noteSemanticOutlinksKeys } from "../note.const";
import { NoteKind } from "../note.types";
import { AnyNoteDateKey, AnyNoteSemanticOutlinksKey } from "./any-note.types";

export const anyNoteSemanticOutlinksKeys = [
    ...noteSemanticOutlinksKeys,
    "creators"

    // ...myNoteUniqueSemanticOutlinksKeys,
    // ...boardNoteUniqueSemanticOutlinksKeys,

    // ...galleryNoteUniqueSemanticOutlinksKeys,
    // ...knowledgeNoteUniqueSemanticOutlinksKeys,
    // ...creatoriumNoteSemanticOutlinksKeys,
    // ...faqNoteSemanticOutlinksKeys,

    // ...taskNoteUniqueSemanticOutlinksKeys,
    // ...scheduleNoteSemanticOutlinksKeys,
    // ...noticeNoteSemanticOutlinksKeys,
    // ...memoNoteSemanticOutlinksKeys,

] as const;
export function isAnyNoteSemanticOutlinksKey(key: unknown): key is AnyNoteSemanticOutlinksKey {
    return anyNoteSemanticOutlinksKeys.includes(key as AnyNoteSemanticOutlinksKey);
}

export const noteSemanticOutlinkKeysMap: Record<NoteKind, AnyNoteSemanticOutlinksKey[]> = {
    "knowledge": [...knowledgeNoteSemanticOutlinksKeys],
    "gallery": [...galleryNoteSemanticOutlinksKeys],
    "creatorium": [...creatoriumNoteSemanticOutlinksKeys],
    "faq": [...faqNoteSemanticOutlinksKeys],

    "task": [...taskNoteSemanticOutlinksKeys],
    "schedule": [...scheduleNoteSemanticOutlinksKeys],
    "notice": [...noticeNoteSemanticOutlinksKeys],
    "memo": [...memoNoteSemanticOutlinksKeys],
}

export const noteDatesKeysMap: Record<NoteKind, AnyNoteDateKey[]> = {
    "knowledge": [...knowledgeNoteDateKeys],
    "gallery": [...galleryNoteDateKeys],
    "creatorium": [...creatoriumNoteDateKeys],
    "faq": [...faqNoteDateKeys],

    "task": [...taskNoteDateKeys],
    "schedule": [...scheduleNoteDateKeys],
    "notice": [...noticeNoteDateKeys],
    "memo": [...memoNoteDateKeys],
}


export const anyNoteDateKeys = [
    ...noteDateKeys,
    "startedAt",
    "dueAt",
    "resolvedAt",

    // 被りが出る。
    // ...myNoteUniqueDateKeys,
    // ...boardNoteUniqueDateKeys,

    // ...galleryNoteUniqueDateKeys,
    // ...knowledgeNoteUniqueDateKeys,
    // ...creatoriumNoteDateKeys,
    // ...faqNoteDateKeys,

    // ...taskNoteUniqueDateKeys,
    // ...scheduleNoteDateKeys,
    // ...noticeNoteDateKeys,
    // ...memoNoteDateKeys,
] as const;

export const anyNoteSemanticDateKeys = [
    "startedAt",
    "dueAt",
    "resolvedAt",
    // ...noteSemanticDateKeys,

    // ...myNoteUniqueDateKeys,
    // ...boardNoteUniqueDateKeys,

    // ...galleryNoteUniqueDateKeys,
    // ...knowledgeNoteUniqueDateKeys,

    // ...galleryNoteUniqueDateKeys,
    // ...knowledgeNoteUniqueDateKeys,
    // ...creatoriumNoteDateKeys,
    // ...faqNoteDateKeys,

    // ...taskNoteUniqueDateKeys,
    // ...scheduleNoteDateKeys,
    // ...noticeNoteDateKeys,
    // ...memoNoteDateKeys,
] as const;
