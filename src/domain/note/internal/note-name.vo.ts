import { IssueError } from "../../../_shared/error";
import { PathSegment } from "../../../_shared/path-segment.vo";
import { ValueObject } from "../../../_shared/value-object.vo";

function _validate(value: string): void {
    if (value.endsWith(".md")) {
        throw new IssueError({
            title: "Domain Error: Note",
            layer: "domain",
            location: "_validate()",
            message: "note name must not end with '.md'"
        });
    }
}

export class NoteName extends ValueObject<PathSegment> {
    readonly brand = "NoteName" as const;

    private constructor(value: PathSegment) {
        super(value);
    }

    static isValid(value: string): boolean {
        try {
            PathSegment.isValid(value);
            _validate(value);
            return true;
        } catch {
            return false;
        }
    }

    static from(value: PathSegment | string): NoteName {
        if (value instanceof PathSegment) {
            _validate(value.toString());
            return new NoteName(value);
        } else {
            _validate(value);
            return new NoteName(PathSegment.from(value));
        }

    }

    static $_fromStringWithoutValidation(value: string): NoteName {
        return new NoteName(
            PathSegment.$_fromWithoutValidation(value)
        );
    }

    static tryFrom(value: PathSegment | string): NoteName | undefined {
        try {
            return NoteName.from(value);
        } catch (e) {
            return undefined;
        }
    }

    get value() {
        return this.toString();
    }

    toString(): string {
        return this._value.toString()
    }

    // @区切りは複数許可する
    // @区切りの書く文字列を取得できるようにする。
}