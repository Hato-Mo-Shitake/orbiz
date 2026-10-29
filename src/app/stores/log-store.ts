import { Listener, Unsubscribe } from "../../_shared/types";
import { Log, LogStoreReader } from "./log-store.types";

export class LogStore implements LogStoreReader {
    private _logs: Log[] = [];
    private _listeners: Set<Listener> = new Set();
    private _capacity: number;

    constructor(options?: {
        capacity?: number
    }) {
        this._capacity = options?.capacity ?? 50;
    }

    get(): readonly Log[] {
        return this._logs;
    }

    add(log: Log): void {
        if (this._logs.length >= this._capacity) {
            this._logs.shift();
        }
        this._logs = [
            ...this._logs,
            log,
        ]
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