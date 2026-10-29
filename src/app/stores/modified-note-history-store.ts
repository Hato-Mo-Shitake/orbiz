import { Listener, Unsubscribe } from "../../_shared/types";
import { NoteId, NoteIdList } from "../../domain/note";
import { ModifiedNoteHistoryStoreReader } from "./modified-note-history-store.types";

export class ModifiedNoteHistoryStore implements ModifiedNoteHistoryStoreReader {
    private readonly _listeners: Set<Listener> = new Set();
    private _history: NoteIdList = NoteIdList.empty();

    constructor(private readonly _historySize = 100) {
    }

    get(): NoteIdList {
        return this._history;
    }

    subscribe(listener: Listener): Unsubscribe {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }

    set(noteId: NoteId) {
        const next = this._history.addTop(noteId)

        if (next.length > this._historySize) {
            this._history = next.slice(0, this._historySize);
        } else {
            this._history = next;
        }

        this._notify();
    }

    private _notify(): void {
        this._listeners.forEach(l => l());
    }
}