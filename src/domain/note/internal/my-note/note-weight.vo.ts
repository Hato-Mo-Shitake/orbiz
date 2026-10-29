import { IssueError } from "../../../../_shared/error";
import { ValueObject } from "../../../../_shared/value-object.vo";
import { isNoteWeightValue } from "./my-note.const";
import { NoteWeightValue } from "./my-note.types";

export class NoteWeight extends ValueObject<NoteWeightValue> {
    readonly brand = "NoteWeight" as const;

    private constructor(weight: NoteWeightValue) {
        super(weight);
    }

    static from(weight: NoteWeightValue): NoteWeight {
        return new NoteWeight(weight);
    }
    static fromString(weight: string): NoteWeight {
        if (!isNoteWeightValue(weight)) {
            throw new IssueError({
                title: "DomainError: Note",
                layer: "domain",
                location: "NoteWeight.fromString()",
                message: `Invalid note weight value: ${weight}`,
            });
        }
        return NoteWeight.from(weight);
    }

    is(weight: NoteWeightValue): boolean {
        return this._value === weight;
    }

    // isImportant(): boolean {
    //     return this._value === "valuable" || this._value === "essential";
    // }

    get value(): NoteWeightValue {
        return this._value;
    }
    toString(): NoteWeightValue {
        return this._value;
    }
}