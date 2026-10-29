import { myNoteDateKeys, myNoteSemanticOutlinksKeys } from "../my-note.const";
import { FaqNoteDateKey, FaqNoteSemanticOutlinksKey } from "./faq-note.types";

export const faqNoteUniqueDateKeys = [
    "resolvedAt"
] as const;
export const faqNoteDateKeys = [
    ...myNoteDateKeys,
    ...faqNoteUniqueDateKeys,
] as const;
export function isFaqNoteDateKey(key: unknown): key is FaqNoteDateKey {
    return faqNoteDateKeys.includes(key as FaqNoteDateKey);
}

export const faqNoteUniqueSemanticOutlinksKeys = [
] as const;
export const faqNoteSemanticOutlinksKeys = [
    ...myNoteSemanticOutlinksKeys,
    ...faqNoteUniqueSemanticOutlinksKeys,
] as const;
export function isFaqNoteSemanticOutlinksKey(key: unknown): key is FaqNoteSemanticOutlinksKey {
    return faqNoteSemanticOutlinksKeys.includes(key as FaqNoteSemanticOutlinksKey);
}
