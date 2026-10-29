import { myNoteDateKeys, myNoteSemanticOutlinksKeys } from "../my-note.const";
import { CreatoriumNoteDateKey, CreatoriumNoteSemanticOutlinksKey } from "./creatorium-note.types";

export const creatoriumNoteUniqueDateKeys = [
] as const;
export const creatoriumNoteDateKeys = [
    ...myNoteDateKeys,
    ...creatoriumNoteUniqueDateKeys,
] as const;
export function isCreatoriumNoteDateKey(key: unknown): key is CreatoriumNoteDateKey {
    return creatoriumNoteDateKeys.includes(key as CreatoriumNoteDateKey);
}

export const creatoriumNoteUniqueSemanticOutlinksKeys = [
] as const;
export const creatoriumNoteSemanticOutlinksKeys = [
    ...myNoteSemanticOutlinksKeys,
    ...creatoriumNoteUniqueSemanticOutlinksKeys,
] as const;
export function isCreatoriumNoteSemanticOutlinksKey(key: unknown): key is CreatoriumNoteSemanticOutlinksKey {
    return creatoriumNoteSemanticOutlinksKeys.includes(key as CreatoriumNoteSemanticOutlinksKey);
}
