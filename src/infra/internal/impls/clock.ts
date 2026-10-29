import { DateTime } from "../../../_shared/date-time.vo";
import { IssueError } from "../../../_shared/error";
import { PlainDate } from "../../../_shared/plain-date.vo";
import { DateFormat, DateTimeFormat, PlainYMD, TimeZone, WeekDay } from "../../../_shared/types";
import { Clock } from "../../../_shared/utils-facades.types";


export class ClockImpl implements Clock {
    constructor(private readonly _timeZone: TimeZone = "LOCAL") { }

    nowTimestamp(): number {
        return Date.now();
    }

    nowString(format: DateFormat | DateTimeFormat): string {
        return this.toString(this.nowDate(), format);
    }

    nowDate(): Date {
        return new Date();
    }

    nowPlainDate(): PlainDate {
        return PlainDate.from(this.nowDate());
    }

    nowDateTime(): DateTime {
        return DateTime.from(this.nowDate());
    }

    nowYMD(): PlainYMD {
        return this.toYMD(this.nowDate());
    }

    nowEEE(): WeekDay {
        return this.toEEE(this.nowDate());
    }

    toString(date: Date, format: DateFormat | DateTimeFormat): string {
        if (Number.isNaN(date.getTime())) {
            throw new IssueError({
                title: "Invalid Date",
                message: "invalid arg'date",
                location: "ClockImpl.toString()",
                layer: "infra"
            });
        }

        const year = this._getYear(date);
        const month = this._pad(this._getMonth(date));
        const day = this._pad(this._getDay(date));
        const hours = this._pad(this._getHours(date));
        const minutes = this._pad(this._getMinutes(date));
        const seconds = this._pad(this._getSeconds(date));

        switch (format) {
            case "yyyy-MM-dd":
                return `${year}-${month}-${day}`;
            case "yyyyMMdd":
                return `${year}${month}${day}`;
            case "yyyy/MM/dd":
                return `${year}/${month}/${day}`;
            case "yyyy-MM-dd_EEE":
                return `${year}-${month}-${day}_${this.toEEE(date)}`;
            case "yyyy-MM":
                return `${year}-${month}`;
            case "yyyy":
                return `${year}`;
            case "MM":
                return month;
            case "yyyy-MM-dd'T'HH:mm:ss":
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        }
    }

    toEEE(date: Date): WeekDay {
        const day = this._timeZone === "UTC"
            ? date.getUTCDay()
            : date.getDay();

        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day] as WeekDay;
    }

    toYMD(date: Date): PlainYMD {
        return {
            y: this._getYear(date),
            m: this._getMonth(date),
            d: this._getDay(date),
        };
    }

    toTimestamp(date: Date): number {
        return date.getTime();
    }

    parseDateString(str: string, type: "date"): Date | undefined;
    parseDateString(str: string, type: "plain-date"): PlainDate | undefined;
    parseDateString(str: string, type: "date-time"): DateTime | undefined;
    parseDateString(str: string): DateTime | undefined;
    parseDateString(
        str: string,
        type?: "date" | "plain-date" | "date-time",
    ): Date | PlainDate | DateTime | undefined {
        const date = this._parseDate(str);
        if (!date) return undefined;

        switch (type) {
            case "date":
                return date;
            case "plain-date":
                return PlainDate.from(date);
            case "date-time":
            default:
                return DateTime.from(date);
        }
    }

    private _parseDate(value: string): Date | undefined {
        const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2}))?$/.exec(value);
        if (!match) return undefined;

        const [, y, mo, d, h = "00", mi = "00", s = "00"] = match;
        const year = Number(y);
        const month = Number(mo);
        const day = Number(d);
        const hours = Number(h);
        const minutes = Number(mi);
        const seconds = Number(s);

        const date = this._timeZone === "UTC"
            ? new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds))
            : new Date(year, month - 1, day, hours, minutes, seconds);

        // Date は範囲外の日付を翌月などに繰り越すため、各要素を照合する
        if (
            this._getYear(date) !== year ||
            this._getMonth(date) !== month ||
            this._getDay(date) !== day ||
            this._getHours(date) !== hours ||
            this._getMinutes(date) !== minutes ||
            this._getSeconds(date) !== seconds
        ) {
            return undefined;
        }

        return date;
    }

    private _getYear(date: Date): number {
        return this._timeZone === "UTC" ? date.getUTCFullYear() : date.getFullYear();
    }

    private _getMonth(date: Date): number {
        return (this._timeZone === "UTC" ? date.getUTCMonth() : date.getMonth()) + 1;
    }

    private _getDay(date: Date): number {
        return this._timeZone === "UTC" ? date.getUTCDate() : date.getDate();
    }

    private _getHours(date: Date): number {
        return this._timeZone === "UTC" ? date.getUTCHours() : date.getHours();
    }

    private _getMinutes(date: Date): number {
        return this._timeZone === "UTC" ? date.getUTCMinutes() : date.getMinutes();
    }

    private _getSeconds(date: Date): number {
        return this._timeZone === "UTC" ? date.getUTCSeconds() : date.getSeconds();
    }

    private _pad(value: number): string {
        return value < 10 ? `0${value}` : String(value);
    }
}