import { useCallback, useSyncExternalStore } from "react";
import { Listener } from "../../../../../_shared/types";
import { NoteId } from "../../../../../domain/note";
import { useStore } from "../../../../context/use-context";

export function useNotePathString(id: NoteId | string): string | undefined {
    const noteIndexStore = useStore().noteIndexStore;

    const subscribe = useCallback(
        (cb: Listener) => noteIndexStore.subscribe(cb),
        [noteIndexStore],
    );
    const getSnapshot = () => noteIndexStore.findPath(id);

    return useSyncExternalStore(subscribe, getSnapshot);
}