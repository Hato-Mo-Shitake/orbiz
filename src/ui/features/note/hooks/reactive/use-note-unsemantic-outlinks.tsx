import { useCallback, useSyncExternalStore } from "react";
import { Listener } from "../../../../../_shared/types";
import { NoteId, NoteIdList } from "../../../../../domain/note";
import { useStore } from "../../../../context/use-context";

export function useNoteUnsemanticOutlinks(id: NoteId | string | undefined): NoteIdList | undefined {
    const store = useStore().noteUnsemanticOutlinksStore;

    const subscribe = useCallback(
        (cb: Listener) => store.subscribe(cb),
        [store],
    );
    const getSnapshot = () => id ? store.find(id) : undefined;

    return useSyncExternalStore(subscribe, getSnapshot);
}