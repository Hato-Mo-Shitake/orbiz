import { DateTime } from "../../../../../_shared/date-time.vo";
import { Note } from "../../../../note";
import { BoardNote } from "../board-note";
import { TaskNoteEntry } from "./task-note.types";

export class TaskNote extends BoardNote {
    readonly kind = "task" as const;

    readonly startedAt: DateTime;
    readonly dueAt: DateTime;

    protected constructor(entry: TaskNoteEntry) {
        super(entry);
        this.startedAt = entry.startedAt;
        this.dueAt = entry.dueAt;
        Note._validateKind(entry, this.kind);
    }

    static construct(entry: TaskNoteEntry): TaskNote {
        return new TaskNote(entry);
    }

    protected _withBoardNoteEntry(entry: TaskNoteEntry): this {
        return TaskNote.construct({
            ...entry,
            kind: this.kind
        }) as this;
    }

    isOverStartedAt(now: DateTime): boolean {
        const startedAt = this.startedAt;
        if (!startedAt) return false;

        return now.isAfter(startedAt);
    }


    isOverDueAt(now: DateTime): boolean {
        const dueAt = this.dueAt;
        if (!dueAt) return false;

        return now.isAfter(dueAt);
    }

    isInProgress(now: DateTime): boolean {
        return !this.isResolved()
            && this.isOverStartedAt(now);
    }

    getEntry(): TaskNoteEntry {
        return {
            ...super.getEntry(),
            kind: "task",
            startedAt: this.startedAt,
            dueAt: this.dueAt,
        }
    }
}