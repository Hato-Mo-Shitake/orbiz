import { useCallback, useSyncExternalStore } from "react";
import { Listener } from "../../../../../_shared/types";
import { useStore } from "../../../../context/use-context";

export function useUnresolvedNoteIdList() {
    const noteIndexStore = useStore().noteIndexStore;

    const subscribe = useCallback(
        (cb: Listener) => noteIndexStore.subscribe(cb),
        [noteIndexStore],
    );

    const getSnapshot = useCallback(
        () => noteIndexStore.getNoteList("unresolved"),
        [noteIndexStore],
    );

    return useSyncExternalStore(subscribe, getSnapshot);
}