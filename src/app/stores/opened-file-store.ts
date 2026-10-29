import { Listener, Unsubscribe } from "../../_shared/types";
import { OpenedFileStoreReader } from "./opened-file-store.types";

export class OpenedFileStore implements OpenedFileStoreReader {
    private _paths = new Set<string>();
    private _listeners = new Set<Listener>();

    setPaths(paths: string[]): void {
        const next = new Set(paths);

        if (this._isEqual(this._paths, next)) return;

        this._paths = next;
        this._notify();
    }

    getPaths(): ReadonlySet<string> {
        return this._paths;
    }

    subscribe(listener: Listener): Unsubscribe {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }

    private _isEqual(a: Set<string>, b: Set<string>): boolean {
        if (a.size !== b.size) return false;
        for (const val of a) {
            if (!b.has(val)) return false;
        }
        return true;
    }

    private _notify() {
        this._listeners.forEach(l => l());
    }
}