import { noteDateKeys, noteSemanticOutlinksKeys } from "../note.const";
import { MyNoteSemanticOutlinksKey, NoteWeightValue } from "./my-note.types";

export const myNoteUniqueSemanticOutlinksKeys = [
] as const;
export const myNoteSemanticOutlinksKeys = [
    ...noteSemanticOutlinksKeys,
    ...myNoteUniqueSemanticOutlinksKeys
] as const;
export function isMyNoteSemanticOutlinksKey(key: unknown): key is MyNoteSemanticOutlinksKey {
    return myNoteSemanticOutlinksKeys.includes(key as MyNoteSemanticOutlinksKey);
}

export const myNoteUniqueDateKeys = [
];
export const myNoteDateKeys = [
    ...noteDateKeys,
    ...myNoteUniqueDateKeys
] as const;

export const noteWeightList = [
    "standard",
    "valuable",
    "essential"
] as const;
export function isNoteWeightValue(weight: unknown): weight is NoteWeightValue {
    return noteWeightList.includes(weight as NoteWeightValue);
}