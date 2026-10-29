
import { IssueError } from "../../../_shared/error";
import { UniqueStringList } from "../../../_shared/unique-string-list.vo";
import { ValueObject } from "../../../_shared/value-object.vo";
import { NoteName } from "./note-name.vo";

function _validate(value: UniqueStringList): void {
    for (const name of value.toArray()) {
        if (!NoteName.isValid(name)) {
            throw new IssueError({
                title: "DomainError: Note",
                layer: "domain",
                location: "_validate() in note-name-list.vo",
                message: `One name in NoteNameList is invalid: ${name}`,
            });
        }
    }
}

export class NoteNameList extends ValueObject<UniqueStringList> implements Iterable<NoteName> {
    readonly brand = "NoteNameList" as const;

    private constructor(value: UniqueStringList) {
        super(value);
        _validate(value);
    }

    static from(value: UniqueStringList | readonly string[] | readonly NoteName[] | ReadonlySet<string>): NoteNameList {
        if (value instanceof UniqueStringList) {
            return new NoteNameList(value);
        } else if (Array.isArray(value)) {
            if (typeof value[0] === "string" || value[0] === undefined) {
                return this._fromStringArray(value as string[]);
            } else {
                return this._fromNoteNameArray(value as NoteName[])
            }
        } else {
            return new NoteNameList(
                UniqueStringList.from(value as ReadonlySet<string>)
            );
        }
    }

    static empty() {
        return NoteNameList.from([]);
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
    toStringArray(): readonly string[] {
        return this._value.toArray();
        // return [...this._value.toArray()];
    }

    toArray(): NoteName[] {
        return this._value.toArray().map(id => NoteName.$_fromStringWithoutValidation(id));
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

    equals(other: NoteNameList): boolean {
        return this.contains(other) && other.contains(this);
    }

    has(name: NoteName): boolean {
        return this._value.has(name.toString())
    }

    intersect(other: NoteNameList): NoteNameList {
        const uniqueList = other._value.intersect(this._value);
        return NoteNameList.$_fromWithoutValidation(uniqueList);
    }

    contains(other: NoteNameList): boolean {
        return this._value.contains(other._value);

        // return other._value.contains(this._value);
    }

    add(names: NoteName | NoteNameList) {
        if (names instanceof NoteNameList) {
            return this.addList(names);
        } else {
            return this._add(names);
        }
    }

    private _add(name: NoteName): NoteNameList {
        if (this.has(name)) {
            return this;
        }
        return NoteNameList.$_fromWithoutValidation(
            this._value.add(name.toString())
        );
    }

    addList(other: NoteNameList): NoteNameList {
        if (other.isEmpty()) {
            return this;
        }
        return NoteNameList.$_fromWithoutValidation(
            this._value.addList(other._value)
        );
    }

    remove(name: NoteName): NoteNameList {
        if (!this.has(name)) {
            return this;
        }

        return NoteNameList.$_fromWithoutValidation(
            this._value.remove(name.toString())
        );
    }

    removeList(other: NoteNameList): NoteNameList {
        if (other.isEmpty() || this.isEmpty()) {
            return this;
        }

        return NoteNameList.$_fromWithoutValidation(
            this._value.removeList(other._value)
        );
    }

    *[Symbol.iterator](): IterableIterator<NoteName> {
        for (const name of this._value) {
            yield NoteName.$_fromStringWithoutValidation(name);
        }
    }

    private static _fromStringArray(value: readonly string[]): NoteNameList {
        const uniqueList = UniqueStringList.from(value);
        return new NoteNameList(uniqueList);
    }
    private static _fromNoteNameArray(value: readonly NoteName[]): NoteNameList {
        const uniqueList = UniqueStringList.from(
            value.map(name => name.toString())
        );
        return NoteNameList.$_fromWithoutValidation(uniqueList);
    }

    static $_fromWithoutValidation(value: UniqueStringList): NoteNameList {
        return new NoteNameList(value);
    }
}