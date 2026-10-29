
import { ValueObject } from "./value-object.vo";

function _filter(value: readonly string[]): string[] {
    const unique = [...new Set<string>(value)];
    return unique;
}

export class UniqueStringList extends ValueObject<readonly string[]> implements Iterable<string> {
    readonly brand = "UniqueStringList" as const;

    static isValid(value: string[]): boolean {
        const hasDuplicate = value.some((v, i) =>
            value.slice(i + 1).includes(v)
        );
        return !hasDuplicate;
    }

    private constructor(values: readonly string[]) {
        super(values); // コピーして不変化
    }

    static from(values: readonly string[] | Set<string> | ReadonlySet<string>): UniqueStringList {
        if (Array.isArray(values)) {
            return new UniqueStringList(_filter(values));
        } else {
            // setはフィルター不要
            return new UniqueStringList([
                ...(values),
            ]);
        }
    }


    static empty(): UniqueStringList {
        return new UniqueStringList([]);
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

    equals(other: UniqueStringList): boolean {
        return (other.isEmpty() && this.isEmpty())
            || (this.contains(other) && other.contains(this));
    }

    has(value: string): boolean {
        return this._value.includes(value);
    }

    hasAny(other: UniqueStringList): boolean {
        return this._value.some(value => other.has(value));
    }

    contains(other: UniqueStringList): boolean {
        return other._value.every(id => this.has(id));
    }

    intersect(other: UniqueStringList): UniqueStringList {
        const next = this._value.filter(val => other.has(val));
        return next.length === this._value.length
            ? this
            : new UniqueStringList(next);
    }

    add(value: string): UniqueStringList {
        if (this.has(value)) return this;
        return new UniqueStringList([...this._value, value]);
    }
    addTop(value: string): UniqueStringList {
        const next = [
            value,
            ...this._value.filter(item => item !== value),
        ];

        // すでに先頭なら変更なし
        if (next.length === this._value.length && next.every((item, i) => item === this._value[i])) {
            return this;
        }

        return new UniqueStringList(next);
    }
    addList(other: UniqueStringList): UniqueStringList {
        if (other.isEmpty()) {
            return this;
        }

        const next = [...this._value];

        let changed = false;
        for (const str of other._value) {
            if (!next.some(v => v === str)) {
                next.push(str);
                changed = true;
            }
        }

        return changed ? new UniqueStringList(next) : this;
    }

    remove(value: string): UniqueStringList {
        if (!this._value.includes(value)) return this;
        return new UniqueStringList(this._value.filter(v => v !== value));
    }
    removeList(other: UniqueStringList): UniqueStringList {
        if (other.isEmpty() || this.isEmpty()) {
            return this;
        }

        const next = this._value.filter(
            id => !other.has(id)
        );

        if (next.length === this._value.length) {
            return this;
        }

        return new UniqueStringList(next);
    }

    slice(start?: number, end?: number): UniqueStringList {
        return UniqueStringList.from(this._value.slice(start, end));
    }

    [Symbol.iterator](): IterableIterator<string> {
        return this._value[Symbol.iterator]();
    }

    get value(): readonly string[] {
        return this._value;
    }

    toArray(): string[] {
        return [...this._value];
    }
    // toReadonlyArray(): readonly string[] {
    //     return this._value;
    // }
    toSet(): Set<string> {
        return new Set(this._value);
    }
}