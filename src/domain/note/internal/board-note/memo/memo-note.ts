import { Note } from "../../../../note";
import { BoardNote } from "../board-note";
import { MemoNoteEntry } from "./memo-note.types";

export class MemoNote extends BoardNote {
    readonly kind = "memo" as const;

    protected constructor(entry: MemoNoteEntry) {
        super(entry);
        Note._validateKind(entry, this.kind);
    }

    static construct(entry: MemoNoteEntry): MemoNote {
        return new MemoNote(entry);
    }

    protected _withBoardNoteEntry(entry: MemoNoteEntry): this {
        return MemoNote.construct({
            ...entry,
            kind: this.kind
        }) as this;
    }

    getEntry(): MemoNoteEntry {
        return {
            ...super.getEntry(),
            kind: "memo",
        }
    }
}