import { Note } from "../../note";
import { MyNote } from "../my-note";
import { MyNoteEntry } from "../my-note.types";
import { CreatoriumNoteEntry } from "./creatorium-note.types";

export class CreatoriumNote extends MyNote {
    readonly kind = "creatorium" as const;
    protected constructor(entry: CreatoriumNoteEntry) {
        super(entry);
        Note._validateKind(entry, this.kind);
    }

    static construct(entry: CreatoriumNoteEntry): CreatoriumNote {
        return new CreatoriumNote(entry);
    }

    protected _withMyNoteEntry(entry: MyNoteEntry): this {
        return CreatoriumNote.construct({
            ...entry,
            kind: this.kind,
        }) as this;
    }

    getEntry(): CreatoriumNoteEntry {
        return {
            ...super.getEntry(),
            kind: "creatorium"
        }
    }
}