import { DateTime } from "../../../../_shared/date-time.vo";
import { BoardNoteKind, NoteEntry } from "../note.types";
import { boardNoteDateKeys, boardNoteSemanticOutlinksKeys, notePriorityList } from "./board-note.const";
import { MemoNote } from "./memo/memo-note";
import { MemoNoteEntry } from "./memo/memo-note.types";
import { NotePriority } from "./note-priority.vo";
import { NoticeNote } from "./notice/notice-note";
import { NoticeNoteEntry } from "./notice/notice-note.types";
import { ScheduleNote } from "./schedule/schedule-note";
import { ScheduleNoteEntry } from "./schedule/schedule-note.types";
import { TaskNote } from "./task/task-note";
import { TaskNoteEntry } from "./task/task-note.types";

export type NotePriorityValue = typeof notePriorityList[number];

export type BoardNoteSemanticOutlinksKey = typeof boardNoteSemanticOutlinksKeys[number];
export type BoardNoteDateKey = typeof boardNoteDateKeys[number];

export type BoardNoteEntry = NoteEntry & Readonly<{
    priority: NotePriority,
    resolvedAt: DateTime | null,
    kind: BoardNoteKind
}>

export type AnyBoardNote =
    | TaskNote | ScheduleNote | NoticeNote | MemoNote;
export type AnyBoardNoteEntry =
    | TaskNoteEntry | ScheduleNoteEntry | NoticeNoteEntry | MemoNoteEntry;