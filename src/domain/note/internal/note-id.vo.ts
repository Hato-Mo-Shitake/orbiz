import { IssueError } from "../../../_shared/error";
import { trimFull } from "../../../_shared/utils";
import { UtilsFacades } from "../../../_shared/utils-facades";
import { ValueObject } from "../../../_shared/value-object.vo";

function _validate(value: string): void {
    if (trimFull(value) === "") {
        throw new IssueError({
            title: "DomainError: Note",
            layer: "domain",
            location: "_validate()",
            message: "invalid NoteId value: id must not empty.",
        });
    }
}

export class NoteId extends ValueObject<string> {
    readonly brand = "NoteId" as const;

    private constructor(value: string) {

        super(value);
    }

    static isValid(value: string): boolean {
        try {
            _validate(value);
        } catch {
            return false;
        }
        return true;
    }

    static from(value: string): NoteId {
        _validate(value);
        return new NoteId(value);
    }

    static tryFrom(id: string): NoteId | undefined {
        try {
            return NoteId.from(id);
        } catch {
            return undefined;
        }
    }

    static $_fromWithoutValidation(value: string): NoteId {
        return new NoteId(value);
    }

    static generate(): NoteId {
        return NoteId.from(
            UtilsFacades.idGenerator.generate()
        );
    }

    get value() {
        return this.toString();
    }

    toString(): string {
        return this._value;
    }
}