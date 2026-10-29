import { useCallback, useSyncExternalStore } from "react";
import { Listener } from "../../../../_shared/types";
import { useStore } from "../../../context/use-context";

export function useLogs() {
    const logStore = useStore().logStore;

    const subscribe = useCallback(
        (cb: Listener) => logStore.subscribe(cb),
        [logStore],
    );

    const getSnapshot = useCallback(
        () => logStore.get(),
        [logStore],
    );

    return useSyncExternalStore(subscribe, getSnapshot);
}