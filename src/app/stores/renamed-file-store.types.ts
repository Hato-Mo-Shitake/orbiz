import { Listener, Unsubscribe } from "../../_shared/types";

export type RenamedFileInfo = {
    oldPath: string,
    newPath: string,
}

export interface RenamedFileHistoryStoreReader {
    getHistory(): readonly string[];
    subscribe(listener: Listener): Unsubscribe;
}