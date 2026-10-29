import { AnyNote, NotePath } from "../../../domain/note";
import { DRecord, DRecordPath } from "../../../domain/note-sub/d-record";

export class ObsidianOrbizFileCache {
    private _noteCache: Map<string, AnyNote> = new Map();
    private _dRecordCache: Map<string, DRecord> = new Map();

    findNote(path: string | NotePath): AnyNote | undefined {
        return this._noteCache.get(path.toString());
    }

    findDRecord(path: string | DRecordPath): DRecord | undefined {
        return this._dRecordCache.get(path.toString());
    }

    setNote(path: string | NotePath, note: AnyNote) {
        this._noteCache.set(path.toString(), note);
    }
    deleteNote(path: string | NotePath) {
        this._noteCache.delete(path.toString());
    }

    setDRecord(path: string | DRecordPath, dRecord: DRecord) {
        this._dRecordCache.set(path.toString(), dRecord);
    }
    deleteDRecord(path: string | DRecordPath) {
        this._dRecordCache.delete(path.toString());
    }
}