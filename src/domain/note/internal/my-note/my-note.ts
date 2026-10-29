import { Note } from "../note";
import { MyNoteKind, NoteEntry } from "../note.types";
import { MyNoteEntry } from "./my-note.types";
import { NoteWeight } from "./note-weight.vo";

export abstract class MyNote extends Note {
    abstract readonly kind: MyNoteKind;

    readonly weight: NoteWeight;

    protected constructor(entry: MyNoteEntry) {
        super(entry);
        this.weight = entry.weight;
    }

    withWeight(weight: NoteWeight): this {
        if (weight.equals(this.weight)) return this;

        return this._withMyNoteEntry({
            ...this.getEntry(),
            weight,
        })
    }
    protected abstract _withMyNoteEntry(entry: MyNoteEntry): this;
    protected _withNoteEntry(entry: NoteEntry): this {
        return this._withMyNoteEntry({
            ...entry,
            kind: this.kind,
            weight: this.weight
        });
    }

    getEntry(): MyNoteEntry {
        return {
            ...super.getEntry(),
            kind: this.kind,
            weight: this.weight
        }
    }
}