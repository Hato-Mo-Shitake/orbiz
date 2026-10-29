import { ORBIZ } from "../../../_shared/const";
import { DateTime } from "../../../_shared/date-time.vo";
import { IssueError } from "../../../_shared/error";
import { PathSegment } from "../../../_shared/path-segment.vo";
import { Path } from "../../../_shared/path.vo";
import { UtilsFacades } from "../../../_shared/utils-facades";
import { ValueObject } from "../../../_shared/value-object.vo";

import { NoteName } from "./note-name.vo";
import { isNoteKind } from "./note.const";
import { NoteKind } from "./note.types";

const ORBIZ_ROOT = 0;
const SPACE = 1;
const ROOT = 2;
const KIND = 3;
const YEAR = 4;
const FILE = 5;

const segmentLength = 6;

const noteFolderName = "notes";

function _validate(value: Path): void {
    const segments = value.toSegments();

    if (segments.length !== segmentLength) {
        throw new IssueError({
            title: "DomainError: Note",
            layer: "domain",
            location: "_validate() in note-path.vo",
            message: `NotePath segments length must be ${segmentLength}: ${value.toString()}`,
        });
    }

    if (segments[ORBIZ_ROOT]?.value !== ORBIZ) {
        throw new IssueError({
            title: "DomainError: Note",
            layer: "domain",
            location: "_validate() in note-path.vo",
            message: `Invalid NotePath value: the 1st segment must be '${ORBIZ}', path: ${value.toString()}`,
        });
    }

    if (segments[ROOT]?.value !== noteFolderName) {
        throw new IssueError({
            title: "DomainError: Note",
            layer: "domain",
            location: "_validate() in note-path.vo",
            message: `Invalid NotePath value: the 3rd segment must be '${noteFolderName}', path: ${value.toString()}`,
        });
    }

    if (!isNoteKind(segments[KIND]?.value)) {
        throw new IssueError({
            title: "DomainError: Note",
            layer: "domain",
            location: "_validate() in note-path.vo",
            message: `Invalid NotePath value: the 4th segment must be note kind. path: ${value.toString()}`,
        });
    }

    if (!/^\d{4}$/.test(segments[YEAR]?.value || "")) {
        throw new IssueError({
            title: "DomainError: Note",
            layer: "domain",
            location: "_validate() in note-path.vo",
            message: `Invalid NotePath value: the 5th segment must be year in yyyy format, path: ${value.toString()}`,
        });
    }

    const lastSegment = segments[FILE]?.value;
    if (!lastSegment?.endsWith(".md")) {
        throw new IssueError({
            title: "DomainError: Note",
            layer: "domain",
            location: "_validate() in note-path.vo",
            message: `file extension must .'md' path: ${value.toString()}`,
        });
    }
}

export class NotePath extends ValueObject<Path> {
    readonly brand = "NotePath" as const;

    private constructor(value: Path) {
        super(value);

        _validate(value);
    }

    static from(value: Path | string): NotePath {
        if (value instanceof Path) {
            return new NotePath(value);
        } else {
            return new NotePath(Path.from(value));
        }

    }

    static tryFrom(value: Path | string): NotePath | undefined {
        try {
            return NotePath.from(value);
        } catch {
            return undefined;
        }
    }

    static createByNameAndKind(params: {
        noteName: NoteName,
        kind: NoteKind,
        spaceName: string,
        date?: Date | DateTime
    }): NotePath {
        let yyyy = undefined;
        if (params.date instanceof Date) {
            yyyy = params.date.getFullYear().toString();
        } else if (params.date instanceof DateTime) {
            yyyy = params.date.toString("yyyy");
        } else {
            yyyy = UtilsFacades.clock.nowDate().getFullYear().toString();
        }

        return NotePath.from(
            Path.fromStringArray([
                ORBIZ,
                params.spaceName,
                noteFolderName,
                params.kind,
                yyyy,
                `${params.noteName.toString()}.md`
            ])
        );
    }

    static getFolderName(): string {
        return noteFolderName;
    }

    public equals(other?: NotePath): boolean {
        return other ? this._value.equals(other._value) : false;
    }

    equalsFolder(other: NotePath): boolean {
        return this._value.equalsDirectory(other.parent);
    }

    get spaceName(): string {
        return this._segments[SPACE]!.toString();
    }

    get kind(): NoteKind {
        return this._segments[KIND]!.toString() as NoteKind;
    }

    get year(): number {
        return Number(this._segments[YEAR]!.toString());
    }

    get name(): NoteName {
        return NoteName.from(this._value.baseName);
    }

    get parent(): Path {
        return this._value.parent!;
    }

    withName(newName: NoteName): NotePath {
        const noteName = this.name;

        if (noteName.equals(newName)) {
            return this;
        }

        const segment = PathSegment.from(newName.toString() + ".md");

        const path = this._value.withLastSegment(segment);

        return NotePath.from(path);
    }

    withKind(newKind: NoteKind): NotePath {
        if (newKind === this.kind) return this;
        const newPath = this._value.withSegmentString(newKind.toString(), KIND);
        return NotePath.from(newPath);
    }

    get value() {
        return this.toString();
    }

    toString(): string {
        return this._value.toString();
    }

    toPath(): Path {
        return this._value;
    }

    // private get _lastSegment(): PathSegment {
    //     const seg = this._value.lastSegment;
    //     if (!seg) {
    //         throw new IssueError({
    //             title: "DomainError: Note",
    //             layer: "domain",
    //             location: "NotePath._lastSegment() in note-path.vo",
    //             message: `invalid note path, path: ${this._value.toString()}`,
    //         });
    //     }
    //     return seg;
    // }

    private get _segments(): PathSegment[] {
        return this._value.toSegments();
    }
}