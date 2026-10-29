import { boardNoteDateKeys, boardNoteSemanticOutlinksKeys } from "../board-note.const";
import { TaskNoteDateKey, TaskNoteSemanticOutlinksKey } from "./task-note.types";

export const taskNoteUniqueDateKeys = [
    "startedAt",
    "dueAt",
] as const;
export const taskNoteDateKeys = [
    ...boardNoteDateKeys,
    ...taskNoteUniqueDateKeys
] as const;
export function isTaskNoteDateKey(key: unknown): key is TaskNoteDateKey {
    return taskNoteDateKeys.includes(key as TaskNoteDateKey);
}

export const taskNoteUniqueSemanticOutlinksKeys = [
] as const;
export const taskNoteSemanticOutlinksKeys = [
    ...boardNoteSemanticOutlinksKeys,
    ...taskNoteUniqueSemanticOutlinksKeys,
] as const;

export function isTaskNoteSemanticOutlinksKey(key: unknown): key is TaskNoteSemanticOutlinksKey {
    return taskNoteSemanticOutlinksKeys.includes(key as TaskNoteSemanticOutlinksKey);
}