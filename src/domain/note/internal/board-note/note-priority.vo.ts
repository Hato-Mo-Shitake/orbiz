import { IssueError } from "../../../../_shared/error";
import { ValueObject } from "../../../../_shared/value-object.vo";
import { isNotePriorityValue } from "./board-note.const";
import { NotePriorityValue } from "./board-note.types";

export class NotePriority extends ValueObject<NotePriorityValue> {
    readonly brand = "NotePriority" as const;

    private constructor(priority: NotePriorityValue) {
        super(priority);
    }

    static from(priority: NotePriorityValue): NotePriority {
        return new NotePriority(priority);
    }
    static fromString(priority: string): NotePriority {
        if (!isNotePriorityValue(priority)) {
            throw new IssueError({
                title: "DomainError: Note",
                layer: "domain",
                location: "NotePriority.fromString()",
                message: `Invalid note priority value: ${priority}`,
            });
        }
        return NotePriority.from(priority);
    }

    is(value: NotePriorityValue): boolean {
        return this._value === value;
    }

    get value(): NotePriorityValue {
        return this._value;
    }

    toString(): NotePriorityValue {
        return this._value;
    }
}