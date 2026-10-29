import { ORBIZ } from "../../../../_shared/const";
import { DateTime } from "../../../../_shared/date-time.vo";
import { IssueError } from "../../../../_shared/error";
import { PathSegment } from "../../../../_shared/path-segment.vo";
import { Path } from "../../../../_shared/path.vo";
import { PlainDate } from "../../../../_shared/plain-date.vo";
import { PlainYMD } from "../../../../_shared/types";
import { ValueObject } from "../../../../_shared/value-object.vo";
import { DRecordId } from "./d-record-id.vo";

const ORBIZ_ROOT = 0;
const SPACE = 1;
const ROOT = 2;
const YEAR = 3;
const MONTH = 4;
const FILE = 5;

const segmentLength = 6;

const dRecordFolderName = "d-records";

function _validate(value: Path): void {
    const segments = value.toSegments();

    if (segments.length !== segmentLength) {
        throw new IssueError({
            title: "DomainError: DRecord",
            layer: "domain",
            location: "_validate() in record-path.vo",
            message: `DRecordPath segments length must be ${segmentLength}, path: ${value.toString()}`,
        });
    }

    if (segments[ORBIZ_ROOT]?.value !== ORBIZ) {
        throw new IssueError({
            title: "DomainError: DRecord",
            layer: "domain",
            location: "_validate() in note-path.vo",
            message: `Invalid DRecordPath value: the 1st segment must be '${ORBIZ}', path: ${value.toString()}`,
        });
    }

    if (segments[ROOT]?.toString() !== dRecordFolderName) {
        throw new IssueError({
            title: "DomainError: DRecord",
            layer: "domain",
            location: "_validate() in record-path.vo",
            message: `Invalid DRecordPath value: the 3rd segment must be '${dRecordFolderName}', path: ${value.toString()}`,
        });
    }

    if (!/^\d{4}$/.test(segments[YEAR]?.toString() || "")) {
        throw new IssueError({
            title: "DomainError: DRecord",
            layer: "domain",
            location: "_validate() in record-path.vo",
            message: `Invalid DRecordPath value: the 4th segment must be year in yyyy format, path: ${value.toString()}`,
        });
    }

    if (!/^\d{4}-\d{2}$/.test(segments[MONTH]?.toString() || "")) {
        throw new IssueError({
            title: "DomainError: DRecord",
            layer: "domain",
            location: "_validate() in record-path.vo",
            message: `Invalid DRecordPath value: the 5th segment must be year in yyyy-MM format, path: ${value.toString()}`,
        });
    }
    if (!/^\d{4}-\d{2}-\d{2}.md$/.test(segments[FILE]?.toString() || "")) {
        throw new IssueError({
            title: "DomainError: DRecord",
            layer: "domain",
            location: "_validate() in record-path.vo",
            message: `Invalid DRecordPath value: the 6th segment must be year in yyyy-MM-dd.md format, path: ${value.toString()}`,
        });
    }
}

export class DRecordPath extends ValueObject<Path> {
    readonly brand = "DRecordPath" as const;

    private constructor(value: Path) {
        _validate(value);
        super(value);
    }

    static from(value: Path | string): DRecordPath {
        if (value instanceof Path) {
            return new DRecordPath(value);
        } else {
            return new DRecordPath(Path.from(value));
        }

    }

    static tryFrom(value: Path | string): DRecordPath | null {
        try {
            return DRecordPath.from(value);
        } catch {
            return null;
        }
    }

    static toString(d: Date | PlainDate | DateTime | PlainYMD, spaceName: string): string {
        let pd: PlainDate;
        if (d instanceof PlainDate) {
            pd = d;
        } else if (d instanceof DateTime) {
            pd = d.toPlainDate();
        } else {
            pd = PlainDate.from(d);
        }

        // const s = PATH_SEPARATOR;
        const yyyy = pd.toString("yyyy");
        const yyyyMM = pd.toString("yyyy-MM");
        const yyyyMMdd = pd.toString("yyyy-MM-dd");

        return Path.toJoinString([
            ORBIZ,
            spaceName,
            dRecordFolderName,
            yyyy,
            yyyyMM,
            `${yyyyMMdd}.md`
        ]);
    }

    static create(d: Date | PlainDate | DateTime | PlainYMD, spaceName: string): DRecordPath {
        return DRecordPath.from(
            DRecordPath.toString(d, spaceName)
        );
    }

    static getDRecordFolderName(): string {
        return dRecordFolderName;
    }
    // static createByDate(date: Date, spaceName: string): DRecordPath {
    //     const pd = PlainDate.fromDate(date);
    //     return DRecordPath.createByPlainDate(pd, spaceName);
    // }
    // static createByPlainDate(date: PlainDate, spaceName: string): DRecordPath {
    //     const s = PATH_SEPARATOR;
    //     const yyyy = date.toString("yyyy");
    //     const yyyyMM = date.toString("yyyy-MM");
    //     const yyyyMMdd = date.toString("yyyy-MM");
    //     return DRecordPath.fromString(
    //         `${spaceName}${s}${recordFolderName}${s}${yyyy}${s}${yyyyMM}${yyyyMMdd}.md`
    //     );
    // }
    // static createByYMD(ymd: PlainYMD, spaceName: string): DRecordPath {
    //     const pd = PlainDate.from(ymd);
    //     return DRecordPath.createByPlainDate(pd, spaceName);
    // }

    public equals(other?: DRecordPath): boolean {
        return other ? this._value.equals(other._value) : false;
    }

    get spaceName(): string {
        return this._segments[SPACE]!.toString();
    }
    get year(): number {
        return Number(this._segments[YEAR]!.toString());
    }
    get month(): number {
        return Number(this._segments[MONTH]!.toString());
    }

    get name(): string {
        return this._value.baseName;
    }

    get recordId(): DRecordId {
        return DRecordId.from(this.name);
    }

    get value() {
        return this.toString();
    }

    toString(): string {
        return this._value.toString();
    }

    toDateTime(): DateTime {
        return DateTime.from(this.name)
    }

    toPath(): Path {
        return this._value;
    }

    private get _lastSegment(): PathSegment {
        const seg = this._value.lastSegment!;
        return seg;
    }

    private get _segments(): PathSegment[] {
        return this._value.toSegments();
    }
}