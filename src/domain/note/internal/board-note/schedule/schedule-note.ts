import { DateTime } from "../../../../../_shared/date-time.vo";
import { Note } from "../../../../note";
import { BoardNote } from "../board-note";
import { ScheduleNoteEntry } from "./schedule-note.types";

export class ScheduleNote extends BoardNote {
    readonly kind = "schedule" as const;

    readonly startedAt: DateTime;
    readonly dueAt: DateTime | null;

    protected constructor(entry: ScheduleNoteEntry) {
        super(entry);
        this.startedAt = entry.startedAt;
        this.dueAt = entry.dueAt;
        Note._validateKind(entry, this.kind);
    }

    static construct(entry: ScheduleNoteEntry): ScheduleNote {
        return new ScheduleNote(entry);
    }

    protected _withBoardNoteEntry(entry: ScheduleNoteEntry): this {
        return ScheduleNote.construct({
            ...entry,
            kind: this.kind
        }) as this;
    }

    isOverStartedAt(now: DateTime): boolean {
        const startedAt = this.startedAt;
        if (!startedAt) return false;

        return now.isAfter(startedAt);
    }

    hasDueAt(): boolean {
        return this.dueAt !== null;
    }

    isOverDueAt(now: DateTime): boolean {
        const dueAt = this.dueAt;
        if (!dueAt) return false;

        return now.isAfter(dueAt);
    }

    isInProgress(now: DateTime): boolean {
        return !this.isResolved()
            && this.hasDueAt()
            && this.isOverStartedAt(now);
    }

    getEntry(): ScheduleNoteEntry {
        return {
            ...super.getEntry(),
            kind: "schedule",
            startedAt: this.startedAt,
            dueAt: this.dueAt,
        }
    }
}