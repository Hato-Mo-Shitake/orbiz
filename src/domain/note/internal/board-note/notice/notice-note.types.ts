import { BoardNoteEntry } from "../board-note.types";
import { noticeNoteDateKeys, noticeNoteSemanticOutlinksKeys } from "./notice-note.const";

export type NoticeNoteEntry = BoardNoteEntry & Readonly<{
    kind: "notice"
}>
export type NoticeNoteDateKey = typeof noticeNoteDateKeys[number];
export type NoticeNoteSemanticOutlinksKey = typeof noticeNoteSemanticOutlinksKeys[number];