import { Note } from "../../../../note";
import { BoardNote } from "../board-note";
import { NoticeNoteEntry } from "./notice-note.types";

export class NoticeNote extends BoardNote {
    readonly kind = "notice" as const;

    protected constructor(entry: NoticeNoteEntry) {
        super(entry);
        Note._validateKind(entry, this.kind);
    }

    static construct(entry: NoticeNoteEntry): NoticeNote {
        return new NoticeNote(entry);
    }

    protected _withBoardNoteEntry(entry: NoticeNoteEntry): this {
        return NoticeNote.construct({
            ...entry,
            kind: this.kind
        }) as this;
    }

    getEntry(): NoticeNoteEntry {
        return {
            ...super.getEntry(),
            kind: "notice",
        }
    }
}