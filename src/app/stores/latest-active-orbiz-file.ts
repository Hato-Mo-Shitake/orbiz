import { Listener, Unsubscribe } from "../../_shared/types";
import { NotePath } from "../../domain/note";
import { DRecordPath } from "../../domain/note-sub/d-record";
import { OrbizFilePath, OrbizFileType } from "../orbiz.types";
import { LatestActiveOrbizFileStoreReader } from "./latest-active-orbiz-file-store.types";

export class LatestActiveOrbizFileStore implements LatestActiveOrbizFileStoreReader {
    private readonly _listeners: Set<Listener> = new Set();
    private _notePath: NotePath | undefined = undefined;
    private _dRecordPath: DRecordPath | undefined = undefined;
    private _orbizFilePath: OrbizFilePath | undefined = undefined;

    constructor() { }

    getPath(type: "d-record"): DRecordPath | undefined;
    getPath(type: "note"): NotePath | undefined;
    getPath(): OrbizFilePath | undefined;
    getPath(type?: OrbizFileType): OrbizFilePath | undefined {
        if (type === undefined) return this._orbizFilePath;

        switch (type) {
            case "note":
                return this._notePath;
            case "d-record":
                return this._dRecordPath;
        }
    }

    subscribe(listener: Listener): Unsubscribe {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }

    setActivePath(path: string) {
        if (this._orbizFilePath?.value === path) {
            return;
        }
        const notePath = NotePath.tryFrom(path);
        if (notePath) {
            this._set(notePath);
            return;
        }

        const dRecordPath = DRecordPath.tryFrom(path);
        if (dRecordPath) {
            this._set(dRecordPath)
            return;
        }
    }

    private _notify(): void {
        this._listeners.forEach(l => l());
    }

    private _set(path: NotePath | DRecordPath): void {
        if (path instanceof NotePath) {
            this._notePath = path;
            this._orbizFilePath = path
        }

        if (path instanceof DRecordPath) {
            this._dRecordPath = path;
            this._orbizFilePath = path
        }

        this._notify();
    }
}