import { IssueError } from "./error";
import { validateAndNormalizePathSegment } from "./utils";
import { ValueObject } from "./value-object.vo";

const _brand = "PathSegment" as const;
export class PathSegment extends ValueObject<string> {
    get brand(): typeof _brand {
        return _brand;
    }

    protected constructor(value: string) {
        super(value);

    }

    static isValid(value: string): boolean {
        return validateAndNormalizePathSegment(value) !== undefined;
    }

    static from(value: string): PathSegment {
        const validPathSeg = validateAndNormalizePathSegment(value);
        if (validPathSeg === undefined) {
            throw new IssueError({
                title: "PathSegment Error",
                layer: "shared",
                location: "PathSegment.from()",
                message: `Invalid path segment, invalid: ${value}`
            });
        }
        return new PathSegment(validPathSeg);
    }

    static $_fromWithoutValidation(value: string): PathSegment {
        return new PathSegment(value);
    }

    get value() {
        return this.toString();
    }

    toString() {
        return this._value;
    }
}