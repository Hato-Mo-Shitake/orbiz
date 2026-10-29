import { Listener, Unsubscribe } from "../../_shared/types";
import { RenamedFileInfo } from "./renamed-file-store.types";

export class RenamedFileHistoryStore {
    private _listeners: Set<Listener> = new Set();

    private _renamedHistory: string[] = [];

    constructor(private readonly _historySize = 100) {
    }

    getHistory(): readonly string[] {
        return this._renamedHistory;
    }

    setHistory(renamed: RenamedFileInfo) {
        const next = [
            _createKey(renamed),
            ...this._renamedHistory
        ];
        if (next.length > this._historySize) {
            next.splice(this._historySize);
        }
        this._renamedHistory = next;
        this._notify();
    }

    subscribe(listener: Listener): Unsubscribe {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }

    private _notify() {
        this._listeners.forEach(l => l());
    }
}

export class RenamedFileValidationStore {
    private _listeners: Set<Listener> = new Set();

    private _validRenamedSet: Set<string> = new Set();
    private _invalidRenamedMap: Map<string, RenamedFileInfo> = new Map();

    hasValidRenamed(renamed: RenamedFileInfo): boolean {
        return this._validRenamedSet.has(_createKey(renamed));
    }
    addValidRenamed(renamed: RenamedFileInfo) {
        this._validRenamedSet.add(
            _createKey(renamed)
        );
        this._notify();
    }
    deleteValidRenamed(renamed: RenamedFileInfo) {
        this._validRenamedSet.delete(_createKey(renamed));
        this._notify();
    }

    getInvalidRenamed(renamed: RenamedFileInfo): Readonly<RenamedFileInfo> | undefined {
        return this._invalidRenamedMap.get(_createKey(renamed));
    }
    addInvalidRenamed(renamed: RenamedFileInfo) {
        this._invalidRenamedMap.set(
            _createKey(renamed),
            renamed
        );
        this._notify();
    }
    deleteInvalidRenamed(renamed: RenamedFileInfo) {
        this._invalidRenamedMap.delete(_createKey(renamed));
        this._notify();
    }

    subscribe(listener: Listener): Unsubscribe {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }

    private _notify() {
        this._listeners.forEach(l => l());
    }
}

function _createKey(renamed: RenamedFileInfo): string {
    return `${renamed.oldPath} -> ${renamed.newPath}`;
}