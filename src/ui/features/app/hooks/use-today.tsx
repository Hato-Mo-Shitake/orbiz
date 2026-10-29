import { useCallback, useSyncExternalStore } from "react";
import { Listener } from "../../../../_shared/types";
import { useStore } from "../../../context/use-context";

export function useToday() {
    const store = useStore().todayStore;


    const subscribe = useCallback(
        (cb: Listener) => store.subscribe(cb),
        [store],
    );

    const getSnapshot = useCallback(
        () => store.get(),
        [store],
    );

    return useSyncExternalStore(subscribe, getSnapshot);
}