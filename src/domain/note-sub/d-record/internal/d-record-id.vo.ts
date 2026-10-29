import { DateTime } from "../../../../_shared/date-time.vo";
import { PlainDate } from "../../../../_shared/plain-date.vo";
import { PlainYMD } from "../../../../_shared/types";
import { ValueObject } from "../../../../_shared/value-object.vo";
import { DRecordPath } from "./d-record-path.vo";

export class DRecordId extends ValueObject<PlainDate> {
    readonly brand = "DRecordId" as const;

    private constructor(date: PlainDate) {
        super(date);
    }

    static from(date: PlainDate | DateTime | Date | PlainYMD | string): DRecordId {
        let pd: PlainDate;
        if (date instanceof DateTime) {
            pd = date.toPlainDate();
        } else if (date instanceof PlainDate) {
            pd = date;
        } else {
            pd = PlainDate.from(date);
        }

        return new DRecordId(pd);

    }
    // static fromDate(date: Date): DRecordId {
    //     return new DRecordId(PlainDate.from(date));
    // }
    // static fromYMD(ymd: { y: number, m: number, d: number }): DRecordId {
    //     return DRecordId.from(
    //         PlainDate.from(ymd)
    //     );
    // }
    // static fromString(value: string): DRecordId {
    //     return DRecordId.from(

    //     );
    // }

    get y(): number {
        return this._value.y;
    }
    get m(): number {
        return this._value.m;
    }
    get d(): number {
        return this._value.d;
    }

    isToday(): boolean {
        return this._value.isToday();
    }

    isFuture(): boolean {
        return this._value.isAfterToday();
    }

    toPlainDate(): PlainDate {
        return this._value;
    }
    toYMD(): PlainYMD {
        return this._value.toYMD();
    }
    toDate(): Date {
        return this._value.toDate()
    }
    toDateTime(): DateTime {
        return DateTime.from(this._value);
    }
    get value() {
        return this.toString();
    }
    toString(): string {
        return this._value.toString("yyyy-MM-dd");
    }
    toPath(spaceName: string): DRecordPath {
        return DRecordPath.from(this.toPathString(spaceName));
    }
    toPathString(spaceName: string): string {
        return DRecordPath.toString(
            this._value,
            spaceName
        );
        // const date = this._value
        // // const s = PATH_SEPARATOR;
        // const yyyy = date.toString("yyyy");
        // const yyyyMM = date.toString("yyyy-MM");
        // const yyyyMMdd = date.toString("yyyy-MM");

        // return Path.toJoinString([
        //     spaceName,
        //     DRecordPath.getDRecordFolderName(),
        //     yyyy,
        //     yyyyMM,
        //     `${yyyyMMdd}.md`
        // ]);


        // return `${spaceName}${s}records${s}${yyyy}${s}${yyyyMM}${yyyyMMdd}.md`
    }
}