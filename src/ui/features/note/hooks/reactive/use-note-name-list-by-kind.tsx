import { useCallback, useSyncExternalStore } from "react";
import { Listener } from "../../../../../_shared/types";
import { NoteKind, NoteNameList } from "../../../../../domain/note";
import { useStore } from "../../../../context/use-context";

export function useNoteNameListByKind(
    kind: NoteKind,
): NoteNameList {
    const noteIndexStore = useStore().noteIndexStore;

    const subscribe = useCallback(
        (cb: Listener) => noteIndexStore.subscribe(cb),
        [noteIndexStore],
    );

    const getSnapshot = useCallback(
        () => noteIndexStore.getNameListByKind(kind),
        [noteIndexStore, kind],
    );

    return useSyncExternalStore(subscribe, getSnapshot);
}