import { boardNoteDateKeys, boardNoteSemanticOutlinksKeys } from "../board-note.const";
import { ScheduleNoteDateKey, ScheduleNoteSemanticOutlinksKey } from "./schedule-note.types";

export const scheduleNoteUniqueDateKeys = [
    "startedAt",
    "dueAt",
] as const;
export const scheduleNoteDateKeys = [
    ...boardNoteDateKeys,
    ...scheduleNoteUniqueDateKeys
] as const;
export function isScheduleNoteDateKey(key: unknown): key is ScheduleNoteDateKey {
    return scheduleNoteDateKeys.includes(key as ScheduleNoteDateKey);
}

export const scheduleNoteUniqueSemanticOutlinksKeys = [
] as const;
export const scheduleNoteSemanticOutlinksKeys = [
    ...boardNoteSemanticOutlinksKeys,
    ...scheduleNoteUniqueSemanticOutlinksKeys,
] as const;

export function isScheduleNoteSemanticOutlinksKey(key: unknown): key is ScheduleNoteSemanticOutlinksKey {
    return scheduleNoteSemanticOutlinksKeys.includes(key as ScheduleNoteSemanticOutlinksKey);
}