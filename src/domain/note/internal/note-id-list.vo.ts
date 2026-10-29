import { IssueError } from "../../../_shared/error";
import { UniqueStringList } from "../../../_shared/unique-string-list.vo";
import { ValueObject } from "../../../_shared/value-object.vo";
import { NoteId } from "./note-id.vo";

function _validate(value: UniqueStringList): void {
    for (const id of value.toArray()) {
        if (!NoteId.isValid(id)) {
            throw new IssueError({
                title: "DomainError: Note",
                layer: "domain",
                location: "_validate()",
                message: "Invalid NoteIdList value: must not empty.",
            });
        }
    }
}

export class NoteIdList extends ValueObject<UniqueStringList> implements Iterable<NoteId> {
    readonly brand = "NoteIdList" as const;

    private constructor(value: UniqueStringList) {
        super(value);
        _validate(value);
    }

    static empty(): NoteIdList {
        return new NoteIdList(UniqueStringList.empty());
    }

    static from(
        value:
            | UniqueStringList
            | Set<string>
            | ReadonlySet<string>
            | readonly string[]
            | readonly NoteId[],
    ): NoteIdList {
        if (value instanceof UniqueStringList) {
            return new NoteIdList(value);
        }

        if (Array.isArray(value)) {
            const items = value as readonly string[] | readonly NoteId[];
            const first = items[0];

            if (first === undefined || typeof first === "string") {
                return NoteIdList.fromStringArray(items as readonly string[]);
            }

            return NoteIdList.fromNoteIdArray(items as readonly NoteId[]);
        }

        // Set<string> / ReadonlySet<string>
        return new NoteIdList(
            UniqueStringList.from(value as ReadonlySet<string>)
        );
    }

    // static from(
    //     value: UniqueStringList | Set<string> | ReadonlySet<string>
    //         | readonly string[] | readonly NoteId[]
    // ): NoteIdList {
    //     if (value instanceof UniqueStringList) {
    //         return new NoteIdList(value);
    //     }
    // }

    static fromStringSet(value: Set<string> | ReadonlySet<string>): NoteIdList {
        const strings = [...value];
        return NoteIdList.fromStringArray(strings);
    }
    static fromStringArray(value: readonly string[]): NoteIdList {
        const uniqueList = UniqueStringList.from(value);
        return new NoteIdList(uniqueList);
    }
    static fromNoteIdArray(value: readonly NoteId[]): NoteIdList {
        const uniqueList = UniqueStringList.from(
            value.map(id => id.toString())
        );
        return NoteIdList.$_fromWithoutValidation(uniqueList);
    }

    toList(): UniqueStringList {
        return this._value;
    }
    toStringSet(): Set<string> {
        return this._value.toSet();
    }

    get value(): readonly string[] {
        return this._value.value;
    }

    toStringArray(): string[] {
        return this._value.toArray();
    }
    toArray(): NoteId[] {
        return this._value.toArray().map(id => NoteId.$_fromWithoutValidation(id));
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

    equals(other: NoteIdList): boolean {
        return this.contains(other) && other.contains(this);
    }

    has(id: NoteId): boolean {
        return this._value.has(id.toString())
    }

    hasAny(other: NoteIdList): boolean {
        return this._value.hasAny(other.toList())
    }

    intersect(other: NoteIdList): NoteIdList {
        const uniqueList = other._value.intersect(this._value);
        return NoteIdList.$_fromWithoutValidation(uniqueList);
    }

    contains(other: NoteIdList): boolean {
        return this._value.contains(other._value);

        // やばい。
        // return other._value.contains(this._value);
    }

    addTop(id: NoteId): NoteIdList {
        return NoteIdList.$_fromWithoutValidation(
            this._value.addTop(id.toString())
        );
    }

    add(ids: NoteId | NoteIdList): NoteIdList {
        if (ids instanceof NoteIdList) {
            return this._addList(ids);
        }

        if (this.has(ids)) {
            return this;
        }
        return NoteIdList.$_fromWithoutValidation(
            this._value.add(ids.toString())
        );
    }

    remove(ids: NoteId | NoteIdList): NoteIdList {
        if (ids instanceof NoteIdList) {
            return this._removeList(ids);
        }

        if (!this.has(ids)) {
            return this;
        }

        return NoteIdList.$_fromWithoutValidation(
            this._value.remove(ids.toString())
        );
    }

    slice(start?: number, end?: number): NoteIdList {
        return NoteIdList.$_fromWithoutValidation(
            this._value.slice(start, end)
        );
    }

    *[Symbol.iterator](): IterableIterator<NoteId> {
        for (const id of this._value) {
            yield NoteId.$_fromWithoutValidation(id);
        }
    }

    private _addList(other: NoteIdList): NoteIdList {
        if (other.isEmpty()) {
            return this;
        }
        return NoteIdList.$_fromWithoutValidation(
            this._value.addList(other._value)
        );
    }

    private _removeList(other: NoteIdList): NoteIdList {
        if (other.isEmpty() || this.isEmpty()) {
            return this;
        }

        return NoteIdList.$_fromWithoutValidation(
            this._value.removeList(other._value)
        );
    }

    private static $_fromWithoutValidation(value: UniqueStringList): NoteIdList {
        return new NoteIdList(value);
    }
}