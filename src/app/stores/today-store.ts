import { PlainDate } from "../../_shared/plain-date.vo";
import { Unsubscribe } from "../../_shared/types";
import { HandleTodayChanged, TodayStoreReader } from "./today-store.types";

export class TodayStore implements TodayStoreReader {
    private _today: PlainDate

    private _listeners: Set<HandleTodayChanged> = new Set();

    constructor(
        today: PlainDate
    ) {
        this._today = today;
    }

    get(): PlainDate {
        return this._today;
    }

    subscribe(listener: HandleTodayChanged): Unsubscribe {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }

    update(today: PlainDate): void {
        if (today.equals(this._today)) return;

        this._today = today;
        this._notify(today);
    }

    private _notify(today: PlainDate) {
        this._listeners.forEach(l => l(today));
    }
}