
import { DateTime } from "./date-time.vo";
import { IssueError } from "./error";
import { DateFormat, PlainYMD, WeekDay } from "./types";
import { UtilsFacades } from "./utils-facades";
import { Clock } from "./utils-facades.types";
import { ValueObject } from "./value-object.vo";

const validationErrorParams = {
    title: "Invalid PlainDate value",
    layer: "shared" as const,
    location: "_validate()",
}
function _validate(ymd: PlainYMD): void {
    const [year, month, day] = [ymd.y, ymd.m, ymd.d];

    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
        throw new IssueError({
            ...validationErrorParams,
            message: "y or m or d is not integer.",
        });
    }
    if (month < 1 || month > 12) {
        throw new IssueError({
            ...validationErrorParams,
            message: "month must be between 1 and 12.",
        });
    }
    if (day < 1 || day > 31) {
        throw new IssueError({
            ...validationErrorParams,
            message: "day must be between 1 and 31.",
        });
    }

    // Dateのmonthは0から数える（0 = 1月）ので、これは翌月の0日 -> つまり当月の末日
    const maxDay = new Date(year, month, 0).getDate();
    if (day > maxDay) {
        throw new IssueError({
            ...validationErrorParams,
            message: `invalid day for the given month, month: ${month},  day: ${day}`,
        });
    }
}

/**
 * m: 1~12
 */

export class PlainDate extends ValueObject<PlainYMD> {
    brand = "PlainDate" as const;

    private constructor(ymd: PlainYMD) {
        _validate(ymd);
        super(ymd);
    }

    static today(): PlainDate {
        const today = UtilsFacades.clock.nowDate();
        return PlainDate.from(today);
    }


    static from(d: PlainYMD | Date | string): PlainDate {
        if (typeof d === "string") {
            return this._fromString(d);
        }
        if (d instanceof Date) {
            return PlainDate._fromDate(d);
        }
        return new PlainDate(d);
    }
    private static _fromDate(date: Date): PlainDate {
        return new PlainDate({
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
        });
    }

    private static _fromString(value: string): PlainDate {
        const match = value.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/);
        if (!match) {
            throw new IssueError({
                title: "PlainDate Error",
                layer: "shared",
                location: "PlainDate.fromString()",
                message: `Invalid date format: ${value}`
            });
        }

        const [, y, m, d] = match;

        return new PlainDate({
            y: Number(y),
            m: Number(m),
            d: Number(d),
        });
    }

    static tryFrom(d: PlainYMD | Date | string): PlainDate | undefined {
        try {
            return PlainDate.from(d);
        } catch {
            return undefined;
        }
    }

    get y(): number {
        return this._value.y;
    }

    get m(): number {
        return this._value.m;
    }

    get d(): number {
        return this._value.d;
    }

    equals(other: PlainDate): boolean {
        return `${other.y}-${other.m}-${other.d}` === `${this.y}-${this.m}-${this.d}`;
    }
    equalsYMD(ymd: { y: number, m: number, d: number }): boolean {
        return this.equals(
            PlainDate.from(ymd)
        );
    }
    equalsDate(date: Date): boolean {
        return (
            this.y === date.getFullYear() &&
            this.m === date.getMonth() + 1 && // JSは0始まり
            this.d === date.getDate()
        );
    }

    isBefore(other: PlainDate): boolean {
        return (
            this.y < other.y ||
            (this.y === other.y && this.m < other.m) ||
            (this.y === other.y && this.m === other.m && this.d < other.d)
        );
    }
    isAfter(other: PlainDate): boolean {
        return other.isBefore(this);
    }
    isToday(): boolean {
        const today = PlainDate.today();
        return today.equals(today);
    }
    isBeforeToday(): boolean {
        return this.isBefore(PlainDate.today());
    }
    isAfterToday(): boolean {
        return this.isAfter(PlainDate.today());
    }

    addDay(): PlainDate {
        return this.addDays(1);
    }

    addDays(days: number): PlainDate {
        if (!Number.isInteger(days)) {
            throw new IssueError({
                title: "PlainDate Error",
                layer: "shared",
                location: "PlainDate.addDays()",
                message: `Arg's days must be an integer, invalid: ${days}`
            });
        }

        const date = this.toDate();
        date.setDate(date.getDate() + days);

        return PlainDate.from(date);
    }
    addWeek(): PlainDate {
        return this.addWeeks(1);
    }
    addWeeks(weeks: number): PlainDate {
        if (!Number.isInteger(weeks)) {
            throw new IssueError({
                title: "PlainDate Error",
                layer: "shared",
                location: "PlainDate.addWeeks()",
                message: `Arg's weeks must be an integer, invalid: ${weeks}`
            });
        }

        return this.addDays(weeks * 7);
    }
    addMonth(): PlainDate {
        return this.addMonthsSafe(1);
    }
    addMonths(months: number): PlainDate {
        if (!Number.isInteger(months)) {
            throw new IssueError({
                title: "PlainDate Error",
                layer: "shared",
                location: "PlainDate.addMonths()",
                message: `Arg's months must be an integer, invalid: ${months}`
            });
        }

        const date = this.toDate();
        date.setMonth(date.getMonth() + months);

        return PlainDate.from(date);
    }
    addMonthsSafe(months: number): PlainDate {
        const date = this.toDate();

        const targetMonth = date.getMonth() + months;
        const y = date.getFullYear();
        const d = date.getDate();

        const temp = new Date(y, targetMonth + 1, 0); // 月末
        const maxDay = temp.getDate();

        return PlainDate.from({
            y: temp.getFullYear(),
            m: temp.getMonth() + 1,
            d: Math.min(d, maxDay),
        });
    }
    addYear(): PlainDate {
        return this.addYearsSafe(1);
    }
    addYears(years: number): PlainDate {
        if (!Number.isInteger(years)) {
            throw new IssueError({
                title: "PlainDate Error",
                layer: "shared",
                location: "PlainDate.addYears()",
                message: `Arg's years must be an integer, invalid: ${years}`
            });
        }

        const date = this.toDate();
        date.setFullYear(date.getFullYear() + years);

        return PlainDate.from(date);
    }
    addYearsSafe(years: number): PlainDate {
        if (!Number.isInteger(years)) {
            throw new IssueError({
                title: "PlainDate Error",
                layer: "shared",
                location: "PlainDate.addYearsSafe()",
                message: `Arg's years must be an integer, invalid: ${years}`
            });
        }

        const targetYear = this.y + years;

        // 対象月の末日を取得
        const maxDay = new Date(targetYear, this.m, 0).getDate();

        return PlainDate.from({
            y: targetYear,
            m: this.m,
            d: Math.min(this.d, maxDay),
        });
    }

    toString(format: DateFormat = "yyyy-MM-dd"): string {
        return this._clock.toString(this.toDate(), format);
    }

    toEEE(): WeekDay {
        return this._clock.toEEE(this.toDate());
    }

    toYMD(): PlainYMD {
        return this._value;
    }

    toDate(): Date {
        return new Date(this.y, this.m - 1, this.d);
    }

    toDateTime(): DateTime {
        return DateTime.from(
            this.toDate()
        );
    }

    private get _clock(): Clock {
        return UtilsFacades.clock;
    }
}