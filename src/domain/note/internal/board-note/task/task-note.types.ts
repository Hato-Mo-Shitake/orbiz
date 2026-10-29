import { DateTime } from "../../../../../_shared/date-time.vo";
import { BoardNoteEntry } from "../board-note.types";
import { taskNoteDateKeys, taskNoteSemanticOutlinksKeys } from "./task-note.const";

export type TaskNoteEntry = BoardNoteEntry & Readonly<{
    startedAt: DateTime,
    dueAt: DateTime,
    kind: "task"
}>
export type TaskNoteDateKey = typeof taskNoteDateKeys[number];
export type TaskNoteSemanticOutlinksKey = typeof taskNoteSemanticOutlinksKeys[number];