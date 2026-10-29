import { useCallback } from "react";
import { NoteId } from "../../../../../domain/note";
import { useStore } from "../../../../context/use-context";

export const useGetNoteSemanticInlinks = () => {
    const store = useStore().noteIndexStore;

    return useCallback((id: NoteId) => {
        return store.findSource(id)?.inlinkNoteIds;
    }, [store]);
}