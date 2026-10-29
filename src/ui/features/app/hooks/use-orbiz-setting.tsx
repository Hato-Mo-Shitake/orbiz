import { useSyncExternalStore } from "react";
import { Listener } from "../../../../_shared/types";
import { OrbizSetting } from "../../../../app/stores/orbiz-setting-store.types";
import { useStore } from "../../../context/use-context";

export const useOrbizSetting = (): OrbizSetting => {
    const store = useStore().orbizSettingStore;

    const subscribe = (cb: Listener) => store.subscribe(cb);
    const getSnapshot = () => store.get();

    return useSyncExternalStore(subscribe, getSnapshot);
}