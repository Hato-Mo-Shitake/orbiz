import { DateTime } from "./date-time.vo";
import { PlainDate } from "./plain-date.vo";
import { DateFormat, DateTimeFormat, PlainYMD, WeekDay } from "./types";

export interface IdGenerator {
    generate(): string;
}

// TODO: Clockはよく使うから utils facadesを通すのではなく、直接clockとして使えるようにしたい。
export interface Clock {
    nowTimestamp(): number;
    nowString(format: DateFormat | DateTimeFormat): string;
    nowDate(): Date;
    nowPlainDate(): PlainDate;
    nowDateTime(): DateTime;
    nowYMD(): PlainYMD;
    nowEEE(): WeekDay

    toString(date: Date, format: DateFormat | DateTimeFormat): string;
    toEEE(date: Date): WeekDay
    toYMD(date: Date): PlainYMD;
    toTimestamp(date: Date): number;

    parseDateString(str: string, type: "date"): Date | undefined;
    parseDateString(str: string, type: "plain-date"): PlainDate | undefined;
    parseDateString(str: string, type: "date-time"): DateTime | undefined;
    parseDateString(str: string): DateTime | undefined;
}