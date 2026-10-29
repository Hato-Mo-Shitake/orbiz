import { PlainDateList } from "../../../../_shared/plain-date-list.vo";
import { PlainDate } from "../../../../_shared/plain-date.vo";
import { ValueObject } from "../../../../_shared/value-object.vo";
import { DRecordId } from "./d-record-id.vo";

export class DRecordIdList extends ValueObject<PlainDateList> implements Iterable<DRecordId> {
    readonly brand = "DRecordIdList" as const;

    private constructor(value: PlainDateList) {
        super(value);
    }

    static from(value: PlainDateList | readonly DRecordId[] | readonly PlainDate[]): DRecordIdList {
        if (value instanceof PlainDateList) {
            return new DRecordIdList(value);
        } else {
            const d = value[0];
            if (d instanceof PlainDate) {
                return new DRecordIdList(
                    PlainDateList.from(value as PlainDate[])
                );
            } else {
                return new DRecordIdList(
                    PlainDateList.from(
                        (value as DRecordId[]).map(v => v.toPlainDate())
                    )
                );
            }
        }

    }

    // static fromIds(value: DRecordId[]): DRecordIdList {
    //     return DRecordIdList.fromPlainDates(
    //         value.map(v => v.toPlainDate())
    //     );
    // }

    // static fromPlainDates(value: PlainDate[]): DRecordIdList {
    //     return DRecordIdList.from(
    //         PlainDateList.from(value)
    //     );
    // }

    static empty(): DRecordIdList {
        return DRecordIdList.from(
            PlainDateList.from([])
        );
    }

    get length(): number {
        return this._value.length;
    }

    isEmpty(): boolean {
        return this._value.isEmpty();
    }

    isNotEmpty(): boolean {
        return this._value.isNotEmpty();
    }

    has(value: DRecordId): boolean {
        return this._value.has(value.toPlainDate());
    }

    intersect(other: DRecordIdList): DRecordIdList {
        const next = this._value.intersect(other._value);
        return next === this._value ? this : new DRecordIdList(next);
    }

    contains(other: DRecordIdList): boolean {
        return this._value.contains(other._value);
    }

    addTop(value: DRecordId): DRecordIdList {
        const next = this._value.addTop(value.toPlainDate());
        return next === this._value ? this : new DRecordIdList(next);
    }

    add(value: DRecordId): DRecordIdList {
        const next = this._value.add(value.toPlainDate());
        return next === this._value ? this : new DRecordIdList(next);
    }

    addList(other: DRecordIdList): DRecordIdList {
        const next = this._value.addList(other._value);
        return next === this._value ? this : new DRecordIdList(next);
    }

    remove(value: DRecordId): DRecordIdList {
        const next = this._value.remove(value.toPlainDate());
        return next === this._value ? this : new DRecordIdList(next);
    }

    removeList(other: DRecordIdList): DRecordIdList {
        const next = this._value.removeList(other._value);
        return next === this._value ? this : new DRecordIdList(next);
    }

    sort(order?: "asc" | "desc"): DRecordIdList {
        const next = this._value.sort(order);
        return next === this._value ? this : new DRecordIdList(next);
    }

    slice(start?: number, end?: number): DRecordIdList {
        return DRecordIdList.from(this._value.slice(start, end));
    }

    toArray(): readonly DRecordId[] {
        return this._value
            .toArray()
            .map(pd => DRecordId.from(pd));
    }

    *[Symbol.iterator](): IterableIterator<DRecordId> {
        for (const d of this._value) {
            yield DRecordId.from(d);
        }
    }
}