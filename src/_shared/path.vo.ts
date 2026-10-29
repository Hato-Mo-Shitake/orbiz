import { PATH_SEPARATOR } from "./const";
import { IssueError } from "./error";
import { PathSegment } from "./path-segment.vo";
import { ValueObject } from "./value-object.vo";

const _brand = "Path";
export class Path extends ValueObject<PathSegment[]> {
    get brand(): typeof _brand {
        return _brand;
    }

    protected constructor(value: PathSegment[]) {
        super([...value]);
    }

    private static toPathSegments(path: string): PathSegment[] {
        return path
            .split(PATH_SEPARATOR)
            .filter(s => s.length > 0)
            .map((s) => PathSegment.from(s));
    }

    static toJoinString(path: string[]): string {
        return path.join(PATH_SEPARATOR);
    }
    static fromStringArray(path: string[]): Path {
        return Path.from(Path.toJoinString(path));
    }

    static from(path: string | PathSegment[]): Path {
        if (typeof path === "string") {
            const segments = Path.toPathSegments(path);
            return new Path(segments);
        }
        return new Path(path);
    }

    public equals(other?: Path): boolean {
        if (!other) return false;

        const a = this._value;
        const b = other._value;

        if (a.length !== b.length) return false;

        for (let i = 0; i < a.length; i++) {
            if (!a[i]?.equals(b[i])) return false;
        }

        return true;
    }

    equalsDirectory(other: Path): boolean {
        if (this.parent === undefined && other.parent === undefined) return true;

        if (this.parent && other.parent) {
            return this.parent.equals(other.parent);
        }

        return false;
    }

    get length(): number {
        return this._value.length;
    }

    get name(): string {
        const name = this.lastSegment?.toString();
        if (name === undefined) {
            return "";
        }
        return name;
    }
    get baseName(): string {
        const name = this.name;
        const i = name.lastIndexOf(".");

        // ドットなし or 先頭ドット（.gitignore みたいなやつ）
        if (i <= 0) return name;

        return name.slice(0, i);
    }
    get extension(): string | null {
        try {
            const name = this.name;
            const i = name.lastIndexOf(".");

            // ドットなし or 先頭ドット or 末尾ドット
            if (i <= 0 || i === name.length - 1) return null;

            return name.slice(i + 1);
        } catch {
            return null;
        }
    }

    isEmpty(): boolean {
        return this.length === 0;
    }

    get lastSegment(): PathSegment | undefined {
        if (this.isEmpty()) return undefined;

        return this._value[this.length - 1];
    }

    get parent(): Path | undefined {
        if (this.length <= 1) return undefined;

        return new Path(this._value.slice(0, -1));
    }

    startsWith(path: Path): boolean {
        const a = this._value;
        const b = path._value;

        if (b.length > a.length) return false;

        for (let i = 0; i < b.length; i++) {
            if (!a[i]?.equals(b[i])) return false;
        }

        return true;
    }

    withSegment(segment: PathSegment, index: number): Path {
        if (index < 0 || index >= this.length) {
            throw new IssueError({
                title: "Path Error",
                layer: "shared",
                location: "Path.withSegment()",
                message: `Index out of range: ${index}, before path: ${this.toString()}`
            });
        }

        return new Path([
            ...this._value.slice(0, index),
            segment,
            ...this._value.slice(index + 1),

        ]);
    }

    withSegmentString(segmentStr: string, index: number): Path {
        return this.withSegment(PathSegment.from(segmentStr), index);
    }

    addLastSegment(segment: PathSegment): Path {
        return new Path([
            ...this._value,
            segment
        ]);
    }
    addLastSegmentString(segmentStr: string): Path {
        const segment = PathSegment.from(segmentStr);
        return this.addLastSegment(segment);
    }

    withLastSegment(segment: PathSegment): Path {
        if (this.isEmpty()) {
            return new Path([segment]);
        }

        return new Path([
            ...this._value.slice(0, -1),
            segment
        ]);
    }
    withLastSegmentString(segmentStr: string): Path {
        const segment = PathSegment.from(segmentStr);
        return this.withLastSegment(segment);
    }

    toSegments(): PathSegment[] {
        return [...this._value];
    }

    get value() {
        return this.toString();
    }

    toString(): string {
        return this._value.map(s => s.toString()).join(PATH_SEPARATOR);
    }
}