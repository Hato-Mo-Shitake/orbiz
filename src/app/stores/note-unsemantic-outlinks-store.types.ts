import { Unsubscribe } from "../../_shared/types";
import { NoteId, NoteIdList } from "../../domain/note";

export type HandleUnsemanticOutlinksChanged = (id: NoteId, unsemanticOutlinks: NoteIdList | undefined) => void;
export interface NoteUnsemanticOutlinksStoreReader {
    find(noteId: NoteId): NoteIdList | undefined;
    subscribe(listener: HandleUnsemanticOutlinksChanged): Unsubscribe;
}