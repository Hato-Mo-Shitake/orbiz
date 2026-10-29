import { DateTime } from "../../_shared/date-time.vo";
import { Listener, Unsubscribe } from "../../_shared/types";

export interface Log {
    kind:
    | "command-started" | "command-success" | "command-failed"
    | "query-failed" | "other",
    message: string,
    createdAt: DateTime,
}

export interface LogStoreReader {
    get(): readonly Log[];
    subscribe(listener: Listener): Unsubscribe
}