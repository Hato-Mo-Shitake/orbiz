import { useCallback } from "react";
import { Path } from "../../../_shared/path.vo";
import { UiUtilsFacades } from "../../../_shared/ui-utils-facades";
import { CommandMap } from "../../../app/workflows/command/command";
import { NoteId } from "../../../domain/note";
import { useIo, useOrbizResolver, useStore } from "../../context/use-context";

export function useTrashNote(
    onTrashed?: (path: Path) => void,
    setIsProcessing?: (isProcessing: boolean) => void,
) {
    // const deps = useDeps();
    const store = useStore();
    const io = useIo();
    const orbizResolver = useOrbizResolver();

    return useCallback(async (
        id: NoteId
    ) => {
        try {
            setIsProcessing?.(true);
            const path = await CommandMap.trashNote(id, { ...store, ...io, orbizResolver });
            onTrashed?.(path);
            setIsProcessing?.(false);
        } catch (e) {
            const msg = (e instanceof Error) ? e.message : "unknown error";
            UiUtilsFacades.alert(`Error: ${msg}`);
            setIsProcessing?.(false);
        }
    }, [store, io, orbizResolver]);
}