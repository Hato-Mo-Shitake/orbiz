import { PlainDate } from "../../_shared/plain-date.vo";
import { Listener, Unsubscribe } from "../../_shared/types";

export type HandleTodayChanged = (today: PlainDate) => unknown;
export interface TodayStoreReader {
    get(): PlainDate;
    subscribe(listener: Listener): Unsubscribe;
}