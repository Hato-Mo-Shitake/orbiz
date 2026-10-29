import { DateTime } from "./date-time.vo";
import { PlainDate } from "./plain-date.vo";
import { PlainYMD } from "./types";
import { ValueObject } from "./value-object.vo";

function _filter(value: readonly PlainDate[]): PlainDate[] {
    const map = new Map<string, PlainDate>();

    for (const v of value) {
        const key = `${v.y}-${v.m}-${v.d}`;
        map.set(key, v); // 同じキーは上書き
    }

    return [...map.values()];
}

type BetweenOperators = "<=_x_<=" | "<_x_<" | "<=_x_<" | "<_x_<=";

const _brand = "PlainDateList" as const;
export class PlainDateList extends ValueObject<readonly PlainDate[]> implements Iterable<PlainDate> {
    get brand(): typeof _brand {
        return _brand;
    }

    private constructor(value: readonly PlainDate[]) {
        // _validate(value);
        super(value);
    }

    static from(value: readonly PlainDate[]): PlainDateList {
        return new PlainDateList(_filter(value));
    }

    static fromDateTimes(dates: readonly DateTime[]): PlainDateList {
        return PlainDateList.from(
            dates.map(d => d.toPlainDate())
        );
    }

    static empty(): PlainDateList {
        return PlainDateList.from([]);
    }

    static fromBetween(prams: {
        from: PlainYMD | PlainDate,
        to: PlainYMD | PlainDate,
        operator: BetweenOperators,
    }): PlainDateList {
        const { from, to, operator } = prams;

        const start = from instanceof PlainDate ? from : PlainDate.from(from);
        const end = to instanceof PlainDate ? to : PlainDate.from(to);

        if (end.isBefore(start)) {
            return PlainDateList.empty();
        }

        const includeStart = operator === "<=_x_<=" || operator === "<=_x_<";
        const includeEnd = operator === "<=_x_<=" || operator === "<_x_<=";

        let current: PlainDate = includeStart ? start : start.addDays(1);

        const result: PlainDate[] = [];

        while (
            current.isBefore(end) ||
            (includeEnd && current.equals(end))
        ) {
            result.push(current);
            current = current.addDay();
        }

        return PlainDateList.$_fromWithoutFilter(result);
    }
    static fromMonth(monthInfo: {
        y: number,
        m: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    } | PlainDate
    ): PlainDateList {
        const y = monthInfo instanceof PlainDate ? monthInfo.y : monthInfo.y;
        const m = monthInfo instanceof PlainDate ? monthInfo.m : monthInfo.m;

        const start = PlainDate.from({ y, m, d: 1 });
        const end = start.addMonths(1); // 翌月1日

        // [start, end)
        return PlainDateList.fromBetween({ from: start, to: end, operator: "<=_x_<" });
    }
    static fromYear(yearInfo: { y: number } | PlainDate): PlainDateList {
        const y = yearInfo instanceof PlainDate ? yearInfo.y : yearInfo.y;

        const start = PlainDate.from({ y, m: 1, d: 1 });
        const end = PlainDate.from({ y: y + 1, m: 1, d: 1 }); // 翌年1/1

        // [start, end)
        return PlainDateList.fromBetween({ from: start, to: end, operator: "<=_x_<" });
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

    sort(order?: "asc" | "desc"): PlainDateList {
        throw Error("Not Implement.");
    }

    has(value: PlainDate): boolean {
        return this._value.some(pd => pd.equals(value));
    }

    hasAny(other: PlainDateList): boolean {
        return this._value.some(value => other.has(value));
    }

    intersect(other: PlainDateList): PlainDateList {
        const next = this._value.filter(val => other.has(val));
        return next.length === this._value.length
            ? this
            : new PlainDateList(next);
    }

    contains(other: PlainDateList): boolean {
        return other._value.every(id => this.has(id));
    }

    add(value: PlainDate): PlainDateList {
        if (this.has(value)) return this;

        return PlainDateList.$_fromWithoutFilter([...this._value, value]);
    }
    addTop(value: PlainDate): PlainDateList {
        if (this.has(value)) return this;

        return PlainDateList.$_fromWithoutFilter([value, ...this._value]);
    }
    addList(other: PlainDateList): PlainDateList {
        if (other.isEmpty()) {
            return this;
        }

        const next = [...this._value];

        let changed = false;
        for (const pd of other._value) {
            if (!next.some(v => v.equals(pd))) {
                next.push(pd);
                changed = true;
            }
        }

        return changed ? PlainDateList.$_fromWithoutFilter(next) : this;
    }

    remove(value: PlainDate): PlainDateList {
        if (!this.has(value)) return this;
        return PlainDateList.$_fromWithoutFilter(this._value.filter(v => v !== value));
    }
    removeList(other: PlainDateList): PlainDateList {
        if (other.isEmpty() || this.isEmpty()) {
            return this;
        }

        const next = this._value.filter(
            id => !other.has(id)
        );

        if (next.length === this._value.length) {
            return this;
        }

        return PlainDateList.$_fromWithoutFilter(next);
    }

    slice(start?: number, end?: number): PlainDateList {
        return PlainDateList.from(this._value.slice(start, end));
    }

    toArray(): PlainDate[] {
        return [...this._value];
    }

    [Symbol.iterator](): IterableIterator<PlainDate> {
        return this._value[Symbol.iterator]();
    }

    private static $_fromWithoutFilter(value: readonly PlainDate[]): PlainDateList {
        return new PlainDateList(value);
    }
}