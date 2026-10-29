import { useSyncExternalStore } from "react";
import { Listener } from "../../../../../_shared/types";
import { NoteTagList } from "../../../../../domain/note";
import { useStore } from "../../../../context/use-context";

export function useAllNoteTagList(): NoteTagList {
    const noteIndexStore = useStore().noteIndexStore;

    const subscribe = (cb: Listener) => noteIndexStore.subscribe(cb);
    const getSnapshot = () => noteIndexStore.getTagList();

    return useSyncExternalStore(subscribe, getSnapshot);
}