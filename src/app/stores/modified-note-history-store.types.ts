import { Listener, Unsubscribe } from "../../_shared/types";
import { NoteIdList } from "../../domain/note";

export interface ModifiedNoteHistoryStoreReader {
    get(): NoteIdList;
    subscribe(listener: Listener): Unsubscribe;
}