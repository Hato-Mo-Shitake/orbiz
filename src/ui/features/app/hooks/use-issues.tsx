import { useCallback, useSyncExternalStore } from "react";
import { Listener } from "../../../../_shared/types";
import { useStore } from "../../../context/use-context";

export function useIssues() {
    const issueStore = useStore().issueStore;

    const subscribe = useCallback(
        (cb: Listener) => issueStore.subscribe(cb),
        [issueStore],
    );

    const getSnapshot = useCallback(
        () => issueStore.get(),
        [issueStore],
    );

    return useSyncExternalStore(subscribe, getSnapshot);
}