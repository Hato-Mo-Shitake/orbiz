import { myNoteDateKeys, myNoteSemanticOutlinksKeys } from "../my-note.const";
import { KnowledgeNoteDateKey, KnowledgeNoteSemanticOutlinksKey } from "./knowledge-note.types";

export const knowledgeNoteUniqueDateKeys = [
] as const;
export const knowledgeNoteDateKeys = [
    ...myNoteDateKeys,
    ...knowledgeNoteUniqueDateKeys,
] as const;
export function isKnowledgeNoteDateKey(key: unknown): key is KnowledgeNoteDateKey {
    return knowledgeNoteDateKeys.includes(key as KnowledgeNoteDateKey);
}

export const knowledgeNoteUniqueSemanticOutlinksKeys = [
] as const;
export const knowledgeNoteSemanticOutlinksKeys = [
    ...myNoteSemanticOutlinksKeys,
    ...knowledgeNoteUniqueSemanticOutlinksKeys,
] as const;
export function isKnowledgeNoteSemanticOutlinksKey(key: unknown): key is KnowledgeNoteSemanticOutlinksKey {
    return knowledgeNoteSemanticOutlinksKeys.includes(key as KnowledgeNoteSemanticOutlinksKey);
}
