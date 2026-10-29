import { Listener, Unsubscribe } from "../../_shared/types";

export interface OpenedFileStoreReader {
    getPaths(): ReadonlySet<string>;
    subscribe(listener: Listener): Unsubscribe
}