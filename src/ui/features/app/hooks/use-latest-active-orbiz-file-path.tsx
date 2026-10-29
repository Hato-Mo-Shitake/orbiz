import { useSyncExternalStore } from "react";
import { Listener } from "../../../../_shared/types";
import { useStore } from "../../../context/use-context";

export function useLatestActiveOrbizFilePath() {
    const store = useStore().latestActiveOrbizFileStore;

    const subscribe = (cb: Listener) => store.subscribe(cb);
    const getSnapshot = () => store.getPath();
    return useSyncExternalStore(subscribe, getSnapshot);
}