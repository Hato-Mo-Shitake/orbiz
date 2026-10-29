import { MyNoteEntry } from "../my-note.types";
import { knowledgeNoteDateKeys, knowledgeNoteSemanticOutlinksKeys } from "./knowledge-note.const";

export type KnowledgeNoteEntry = MyNoteEntry & Readonly<{
    kind: "knowledge"
}>

export type KnowledgeNoteDateKey = typeof knowledgeNoteDateKeys[number];
export type KnowledgeNoteSemanticOutlinksKey = typeof knowledgeNoteSemanticOutlinksKeys[number];