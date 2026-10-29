import { Unsubscribe } from "../../_shared/types";
import { DRecord, DRecordIdList } from "../../domain/note-sub/d-record";
import { EntryModifiedDRecordHistoryStoreReader, HandleDRecordSaved } from "./entry-modified-d-record-history-store.types";

export class EntryModifiedDRecordHistoryStore implements EntryModifiedDRecordHistoryStoreReader {
    private readonly _listeners: Set<HandleDRecordSaved> = new Set();
    private _history: DRecordIdList = DRecordIdList.empty();

    constructor(private readonly _historySize = 30) { }

    get(): DRecordIdList {
        return this._history;
    }

    subscribe(listener: HandleDRecordSaved): Unsubscribe {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }

    set(newDRecord: DRecord, oldDRecord?: DRecord) {
        const next = this._history.addTop(newDRecord.id);

        if (next.length > this._historySize) {
            this._history = next.slice(0, this._historySize);
        } else {
            this._history = next;
        }

        this._notify(newDRecord, oldDRecord);
    }

    private _notify(newDRecord: DRecord, oldDRecord?: DRecord): void {
        this._listeners.forEach(l => l(newDRecord, oldDRecord));
    }
}