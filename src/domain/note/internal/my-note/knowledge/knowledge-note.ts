import { Note } from "../../note";
import { MyNote } from "../my-note";
import { MyNoteEntry } from "../my-note.types";
import { KnowledgeNoteEntry } from "./knowledge-note.types";

export class KnowledgeNote extends MyNote {
    readonly kind = "knowledge" as const;
    protected constructor(entry: KnowledgeNoteEntry) {
        super(entry);
        Note._validateKind(entry, this.kind);
    }

    static construct(entry: KnowledgeNoteEntry): KnowledgeNote {
        return new KnowledgeNote(entry);
    }

    protected _withMyNoteEntry(entry: MyNoteEntry): this {
        return KnowledgeNote.construct({
            ...entry,
            kind: this.kind,
        }) as this;
    }

    getEntry(): KnowledgeNoteEntry {
        return {
            ...super.getEntry(),
            kind: "knowledge"
        }
    }
}