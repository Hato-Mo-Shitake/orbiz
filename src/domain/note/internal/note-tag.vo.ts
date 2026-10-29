import { IssueError } from "../../../_shared/error";
import { ValueObject } from "../../../_shared/value-object.vo";

const _validate = (value: string): boolean => {
    // 先頭は半角数字にせず、英数字・日本語などの文字と - _ だけを許可
    return /^(?![0-9])[\p{L}\p{N}_-]+$/u.test(value);
}

// frontmatterにあるものだけを、tagの中でもNoteTagと定義。
export class NoteTag extends ValueObject<string> {
    readonly brand = "NoteTag" as const;

    private constructor(value: string) {
        super(value);
    }

    static isValid(value: string): boolean {
        return _validate(value);
    }

    static from(value: string): NoteTag {
        if (!NoteTag.isValid(value)) {
            throw new IssueError({
                title: "DomainError: Note",
                layer: "domain",
                location: "NoteTag.from()",
                message: `Invalid note tag: ${value}`,
            });
        }
        return new NoteTag(value);
    }

    static tryFrom(value: string): NoteTag | null {
        try {
            return NoteTag.from(value);
        } catch {
            return null
        }
    }

    static $_fromWithoutValidation(value: string): NoteTag {
        return new NoteTag(value);
    }

    get value() {
        return this.toString();
    }

    toString(): string {
        return this._value;
    }
}