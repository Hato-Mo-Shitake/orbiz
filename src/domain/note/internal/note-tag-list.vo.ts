import { IssueError } from "../../../_shared/error";
import { UniqueStringList } from "../../../_shared/unique-string-list.vo";
import { ValueObject } from "../../../_shared/value-object.vo";
import { NoteTag } from "./note-tag.vo";

function _validate(value: UniqueStringList): void {
    for (const name of value.toArray()) {
        if (!NoteTag.isValid(name)) {
            throw new IssueError({
                title: "DomainError: Note",
                layer: "domain",
                location: "_validate()",
                message: `One name in NoteTagList is invalid: ${name}`,
            });
        }
    }
}

export class NoteTagList extends ValueObject<UniqueStringList> implements Iterable<NoteTag> {
    readonly brand = "NoteTagList" as const;

    private constructor(value: UniqueStringList) {
        super(value);
        _validate(value);
    }

    static from(value: UniqueStringList | readonly string[] | readonly NoteTag[]): NoteTagList {
        if (value instanceof UniqueStringList) {
            return new NoteTagList(value);
        } else if (typeof value[0] === "string" || value[0] === undefined) {
            return this._fromStringArray(value as string[]);
        } else {
            return this._fromNoteTagArray(value as NoteTag[])
        }
    }

    static fromStringSet(tags: Set<string>): NoteTagList {
        return NoteTagList.from(
            UniqueStringList.from(tags)
        );
    }

    static empty(): NoteTagList {
        return NoteTagList.from(
            UniqueStringList.empty()
        );
    }

    toList(): UniqueStringList {
        return this._value;
    }
    toStringSet(): Set<string> {
        return this._value.toSet();
        // return new Set<string>(
        //     this._value.toArray()
        // );
    }
    get value(): readonly string[] {
        return this._value.value;
    }

    toStringArray(): string[] {
        return this._value.toArray();
        // return [...this._value.toArray()];
    }

    toArray(): NoteTag[] {
        return this._value.toArray().map(id => NoteTag.$_fromWithoutValidation(id));
    }

    toString(): string {
        return this.toStringArray().join(", ");
    }

    get length(): number {
        return this._value.length;
    }

    isEmpty(): boolean {
        return this.length === 0;
    }

    isNotEmpty(): boolean {
        return !this.isEmpty();
    }

    equals(other: NoteTagList): boolean {
        return this.contains(other) && other.contains(this);
    }

    has(name: NoteTag): boolean {
        return this._value.has(name.toString())
    }

    hasAny(other: NoteTagList): boolean {
        return this._value.hasAny(other.toList())
    }

    intersect(other: NoteTagList): NoteTagList {
        const uniqueList = other._value.intersect(this._value);
        return NoteTagList.$_fromWithoutValidation(uniqueList);
    }

    contains(other: NoteTagList): boolean {
        return this._value.contains(other._value);
        // return other._value.contains(this._value);
    }

    add(tags: NoteTag | NoteTagList): NoteTagList {
        if (tags instanceof NoteTagList) {
            return this._addList(tags)
        }

        if (this.has(tags)) {
            return this;
        }
        return NoteTagList.$_fromWithoutValidation(
            this._value.add(tags.toString())
        );
    }

    *[Symbol.iterator](): IterableIterator<NoteTag> {
        for (const id of this._value) {
            yield NoteTag.$_fromWithoutValidation(id);
        }
    }

    remove(tags: NoteTag | NoteTagList): NoteTagList {
        if (tags instanceof NoteTagList) {
            return this._removeList(tags);
        }

        if (!this.has(tags)) {
            return this;
        }

        return NoteTagList.$_fromWithoutValidation(
            this._value.remove(tags.toString())
        );
    }

    private _addList(other: NoteTagList): NoteTagList {
        if (other.isEmpty()) {
            return this;
        }
        return NoteTagList.$_fromWithoutValidation(
            this._value.addList(other._value)
        );
    }

    private _removeList(other: NoteTagList): NoteTagList {
        if (other.isEmpty() || this.isEmpty()) {
            return this;
        }

        return NoteTagList.$_fromWithoutValidation(
            this._value.removeList(other._value)
        );
    }

    private static _fromStringArray(value: readonly string[]): NoteTagList {
        const uniqueList = UniqueStringList.from(value);
        return new NoteTagList(uniqueList);
    }
    private static _fromNoteTagArray(value: readonly NoteTag[]): NoteTagList {
        const uniqueList = UniqueStringList.from(
            value.map(name => name.toString())
        );
        return NoteTagList.$_fromWithoutValidation(uniqueList);
    }

    private static $_fromWithoutValidation(value: UniqueStringList): NoteTagList {
        return new NoteTagList(value);
    }
}