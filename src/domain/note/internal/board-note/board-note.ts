import { DateTime } from "../../../../_shared/date-time.vo";
import { Note } from "../note";
import { BoardNoteKind, NoteEntry } from "../note.types";
import { BoardNoteEntry } from "./board-note.types";
import { NotePriority } from "./note-priority.vo";


export abstract class BoardNote extends Note {
    abstract kind: BoardNoteKind;

    readonly priority: NotePriority;
    readonly resolvedAt: DateTime | null;

    protected constructor(entry: BoardNoteEntry) {
        super(entry);
        this.priority = entry.priority;
        this.resolvedAt = entry.resolvedAt;
    }

    isResolved(): boolean {
        return this.resolvedAt !== null;
    }
    isUnresolved(): boolean {
        return !this.isResolved();
    }

    // withPriority(priority: NotePriority): this {
    // }

    protected abstract _withBoardNoteEntry(entry: BoardNoteEntry): this;
    protected _withNoteEntry(entry: NoteEntry): this {
        return this._withBoardNoteEntry({
            ...entry,
            kind: this.kind,
            priority: this.priority,
            resolvedAt: this.resolvedAt,
        });
    }

    getEntry(): BoardNoteEntry {
        return {
            ...super.getEntry(),
            kind: this.kind,
            priority: this.priority,
            resolvedAt: this.resolvedAt,
        }
    }
}