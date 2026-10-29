import { DateTime } from "../../../../../_shared/date-time.vo";
import { BoardNoteEntry } from "../board-note.types";
import { scheduleNoteDateKeys, scheduleNoteSemanticOutlinksKeys } from "./schedule-note.const";

export type ScheduleNoteEntry = BoardNoteEntry & Readonly<{
    startedAt: DateTime,
    dueAt: DateTime | null,
    kind: "schedule"
}>
export type ScheduleNoteDateKey = typeof scheduleNoteDateKeys[number];
export type ScheduleNoteSemanticOutlinksKey = typeof scheduleNoteSemanticOutlinksKeys[number];