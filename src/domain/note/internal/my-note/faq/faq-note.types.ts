import { DateTime } from "../../../../../_shared/date-time.vo";
import { MyNoteEntry } from "../my-note.types";
import { faqNoteDateKeys, faqNoteSemanticOutlinksKeys } from "./faq-note.const";

export type FaqNoteEntry = MyNoteEntry & Readonly<{
    kind: "faq",
    resolvedAt: DateTime | null
}>

export type FaqNoteDateKey = typeof faqNoteDateKeys[number];
export type FaqNoteSemanticOutlinksKey = typeof faqNoteSemanticOutlinksKeys[number];