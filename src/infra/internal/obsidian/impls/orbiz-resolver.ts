import { App } from "obsidian";
import { ORBIZ } from "../../../../_shared/const";
import { DateTime } from "../../../../_shared/date-time.vo";
import { IssueError } from "../../../../_shared/error";
import { Path } from "../../../../_shared/path.vo";
import { PlainDate } from "../../../../_shared/plain-date.vo";
import { toYearMonthString } from "../../../../_shared/utils";
import { DRecordSrc, NoteSrc, OrbizResolver } from "../../../../app/orbiz-resolver.types";
import { NoteIndexStore } from "../../../../app/stores/note-index-store";
import { OrbizSettingStoreReader } from "../../../../app/stores/orbiz-setting-store.types";
import { AnyNote, NoteId, NoteName, NotePath } from "../../../../domain/note";
import { DRecord, DRecordId, DRecordPath } from "../../../../domain/note-sub/d-record";
import { ObsidianOrbizFileCache } from "../orbiz-file-cache";
import { constructDRecordByFm } from "../utils/construct-d-record-by-fm";
import { constructNoteByFm } from "../utils/construct-note-by-fm";
import { getFile, getFrontmatter } from "../utils/get";

export class ObsidianOrbizResolver implements OrbizResolver {

    constructor(
        private readonly _app: App,
        private readonly _noteIndexStore: NoteIndexStore,
        private readonly _orbizSettingStore: OrbizSettingStoreReader,
        private readonly _orbizFileCache: ObsidianOrbizFileCache,
    ) { }

    existsFile(path: string | Path): boolean {
        // orbiz/ のファイルだけ対象にしてもいいが、一旦。
        const file = this._app.vault.getFileByPath(path.toString());
        return file !== undefined;
    }

    getNote(src: NoteSrc): AnyNote {
        const path = this._toNotePathString(src);

        const note = (() => {
            const cachedNote = this._orbizFileCache.findNote(path);

            if (cachedNote) {
                return cachedNote;
            }

            const file = getFile(path, this._app.vault);
            const fm = getFrontmatter(file, this._app.metadataCache);
            return constructNoteByFm(NotePath.from(path), fm);
        })();

        const entryVersion = this._noteIndexStore.getSource(note.id).entryVersion;

        // add note-outlink の処理後、ここで引っ掛かる。
        // やっぱり更新直後にここで引っかかるな。Obsidianのキャッシュが追いついてない。
        // 新規作成時のクエリのエラーと合わせて何とかしたい。
        // 両方 byLinkNote の サーチノートでのエラー
        if (entryVersion !== note.entryVersion) {
            throw new IssueError({
                title: "invalid note entry-version",
                message: `invalid note entry-version, path: ${path}, note entry-version: ${note.entryVersion}, source's entry-version: ${entryVersion}`,
                location: "ObsidianOrbizResolver",
                layer: "infra",
            });
        }

        return note;

    }
    findNote(src: NoteSrc): AnyNote | undefined {
        try {
            return this.getNote(src);
        } catch {
            return undefined;
        }
    }

    getNoteModifiedAt(src: NoteSrc): DateTime {
        const path = this._toNotePathString(src);
        const file = getFile(path, this._app.vault);

        return DateTime.from(file.stat.mtime);
    }
    findNoteModifiedAt(src: NoteSrc): DateTime | undefined {
        try {
            return this.getNoteModifiedAt(src);
        } catch {
            return undefined;
        }
    }

    getDRecord(src: DRecordSrc): DRecord {
        const path = this._toDRecordPath(src);

        const cachedDRecord = this._orbizFileCache.findDRecord(path);
        if (cachedDRecord) {
            return cachedDRecord;
        }

        const file = getFile(path.value, this._app.vault);
        const fm = getFrontmatter(file, this._app.metadataCache);
        return constructDRecordByFm(path, fm);
    }
    findDRecord(src: DRecordSrc): DRecord | undefined {
        try {
            return this.getDRecord(src);
        } catch {
            return undefined;
        }
    }

    getDRecordsByYM(src: string | { y: number, m: number }): DRecord[] {
        let yyyyMM = undefined;
        let errSrc = "";
        if (typeof src === "string") {
            yyyyMM = src;
            errSrc = src;
        } else {
            yyyyMM = toYearMonthString(src.y, src.m);
            errSrc = `y: ${src.y}, m: ${src.m}`
        }

        if (!yyyyMM) {
            throw new IssueError({
                title: "Invalid year or month number",
                message: `invalid year or month number, src: ${errSrc}`,
                location: "ObsidianOrbizResolver",
                layer: "infra"
            });
        }

        const yyyy = yyyyMM.slice(0, 4);
        const folderPath = Path.toJoinString([
            ORBIZ,
            this._orbizSettingStore.get().spaceName,
            DRecordPath.getDRecordFolderName(),
            yyyy,
            yyyyMM
        ]);

        const folder = this._app.vault.getFolderByPath(folderPath);
        if (!folder) return [];

        const dList: DRecord[] = [];
        for (const t of folder.children) {
            const dPath = DRecordPath.tryFrom(t.path);
            if (!dPath) continue;
            const d = this.findDRecord(dPath);
            if (!d) continue;
            dList.push(d);
        }

        return dList;
    }

    private _toNotePathString(src: NoteSrc): string {
        let path: string;
        if (src instanceof NotePath) {
            path = src.value;
        } else if (src instanceof NoteName) {
            const id = this._noteIndexStore.getIdByName(src);
            path = this._noteIndexStore.getPath(id);
        } else if (src instanceof NoteId) {
            path = this._noteIndexStore.getPath(src);
        } else {
            throw new Error("Unexpected process in ObsidianOrbizResolver");
        }

        return path;
    }
    private _toDRecordPath(src: DRecordSrc): DRecordPath {
        const spaceName = this._orbizSettingStore.get().spaceName;
        let path: DRecordPath;
        if (src instanceof DRecordId) {
            path = src.toPath(spaceName);
        } else if (src instanceof DRecordPath) {
            path = src;
        } else if (src instanceof PlainDate) {
            path = DRecordId.from(src).toPath(spaceName);
        } else if (src instanceof DateTime) {
            path = DRecordId.from(src).toPath(spaceName);
        } else if (src instanceof Date) {
            path = DRecordId.from(src).toPath(spaceName);
        } else {
            path = DRecordId.from(src).toPath(spaceName);
        }
        return path;
    }
}