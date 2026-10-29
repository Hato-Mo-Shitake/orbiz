import { DateTime } from "../../../../../_shared/date-time.vo";
import { Note } from "../../note";
import { MyNote } from "../my-note";
import { MyNoteEntry } from "../my-note.types";
import { FaqNoteEntry } from "./faq-note.types";

export class FaqNote extends MyNote {
    readonly kind = "faq" as const;

    readonly resolvedAt: DateTime | null;

    protected constructor(entry: FaqNoteEntry) {
        super(entry);
        this.resolvedAt = entry.resolvedAt;
        Note._validateKind(entry, this.kind);
    }

    static construct(entry: FaqNoteEntry): FaqNote {
        return new FaqNote(entry);
    }

    isResolved(): boolean {
        return this.resolvedAt !== null;
    }
    isUnresolved(): boolean {
        return !this.isResolved();
    }

    protected _withMyNoteEntry(entry: MyNoteEntry): this {
        return FaqNote.construct({
            ...entry,
            kind: this.kind,
            resolvedAt: this.resolvedAt,
        }) as this;
    }

    getEntry(): FaqNoteEntry {
        return {
            ...super.getEntry(),
            kind: "faq",
            resolvedAt: this.resolvedAt,
        }
    }
}