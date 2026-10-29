import { IssueError } from "./error";
import { PlainDate } from "./plain-date.vo";
import { DateFormat, DateTimeFormat, PlainYMD, WeekDay } from "./types";
import { UtilsFacades } from "./utils-facades";
import { Clock } from "./utils-facades.types";
import { ValueObject } from "./value-object.vo";

export class DateTime extends ValueObject<Date> {
    brand = "DateTime" as const;

    /**
     * ミリ秒単位（milliseconds）
     */
    private constructor(date: Date) {
        if (isNaN(date.getTime())) {
            throw new IssueError({
                title: "Invalid Date",
                message: "DateTime value is NaN",
                layer: "shared",
                location: "DateTime.constructor()",
            });
        }

        super(date);
    }

    private get _clock(): Clock {
        return UtilsFacades.clock;
    }

    static fromNullable(value: Date | number | PlainDate | string | null): DateTime | null {
        return value === null ? null : DateTime.from(value);
    }

    // number -> timestamp, stringのformatについては要検討
    static from(value: Date | number | PlainDate | string): DateTime {
        if (value instanceof Date) {
            return new DateTime(value);
        }
        else if (typeof value === "number") {
            return new DateTime(new Date(value));
        }
        else if (value instanceof PlainDate) {
            return new DateTime(
                value.toDate()
            );
        }
        else if (typeof value === "string") {
            const date = UtilsFacades.clock.parseDateString(value, "date-time");
            if (!date) {
                throw new IssueError({
                    title: "DateTime Error",
                    layer: "shared",
                    location: "DateTime.fromString()",
                    message: `invalid date string: ${value}. `
                });
            }
            return date;
        }
        throw new Error("Unexpected Error in date-time.vo.ts");
    }

    static now(): DateTime {
        return this.from(
            UtilsFacades.clock.nowDate()
        )
    }

    equals(other: DateTime): boolean {
        return this._value.getTime() === other._value.getTime();
    }

    isBefore(other: DateTime): boolean {
        return this._value.getTime() < other._value.getTime();
    }

    isAfter(other: DateTime): boolean {
        return this._value.getTime() > other._value.getTime();
    }

    addDay(): DateTime {
        return this.addDays(1);
    }

    addDays(days: number): DateTime {
        if (!Number.isInteger(days)) {
            throw new IssueError({
                title: "DateTime Error",
                layer: "shared",
                location: "DateTime.addDays()",
                message: `Arg's days must be an integer, invalid: ${days}. `
            });
        }

        const date = this.toDate();
        date.setDate(date.getDate() + days);

        return DateTime.from(date);
    }
    addWeek(): DateTime {
        return this.addWeeks(1);
    }
    addWeeks(weeks: number): DateTime {
        if (!Number.isInteger(weeks)) {
            throw new IssueError({
                title: "DateTime Error",
                layer: "shared",
                location: "DateTime.addWeeks()",
                message: `Arg's weeks must be an integer, invalid: ${weeks}. `
            });
        }

        return this.addDays(weeks * 7);
    }
    addMonth(): DateTime {
        return this.addMonthsSafe(1);
    }
    addMonths(months: number): DateTime {
        if (!Number.isInteger(months)) {
            throw new IssueError({
                title: "DateTime Error",
                layer: "shared",
                location: "DateTime.addMonths()",
                message: `Arg's months must be an integer. invalid: ${months}. `
            });
        }

        const date = this.toDate();
        date.setMonth(date.getMonth() + months);

        return DateTime.from(date);
    }
    addMonthsSafe(months: number): DateTime {
        throw new Error("Not Implement.");
    }
    addYear(): DateTime {
        return this.addYearsSafe(1);
    }
    addYears(years: number): DateTime {
        if (!Number.isInteger(years)) {
            throw new IssueError({
                title: "DateTime Error",
                layer: "shared",
                location: "DateTime.addYears()",
                message: `Arg's years must be an integer, invalid: ${years}. `
            });
        }

        const date = this.toDate();
        date.setFullYear(date.getFullYear() + years);

        return DateTime.from(date);
    }
    addYearsSafe(years: number): DateTime {
        throw new Error("Not Implement.");
    }

    toDate(): Date {
        return new Date(this._value.getTime());
    }

    toEEE(): WeekDay {
        return this._clock.toEEE(this._value);
    }

    toTimestamp(): number {
        return this._clock.toTimestamp(this._value);
    }

    toString(format: DateFormat | DateTimeFormat = "yyyy-MM-dd'T'HH:mm:ss"): string {
        return this._clock.toString(this._value, format);
    }

    toYMD(): PlainYMD {
        return this._clock.toYMD(this._value);
    }

    toPlainDate(): PlainDate {
        return PlainDate.from(this.toYMD());
    }
}