import { useCallback } from "react";
import { UiUtilsFacades } from "../../../_shared/ui-utils-facades";
import { CommandMap } from "../../../app/workflows/command/command";
import { AnyNote, NoteId, NoteKind, NoteName } from "../../../domain/note";
import { useIo, useStore } from "../../context/use-context";

export function useUpdateNoteCoreData(
    onUpdated?: (note: AnyNote) => void,
    setIsProcessing?: (isProcessing: boolean) => void,
) {
    const store = useStore()
    const io = useIo();

    return useCallback(async (
        id: NoteId,
        originalEntryVersion: number,
        newName?: NoteName,
        newKind?: NoteKind,
    ) => {
        try {
            setIsProcessing?.(true);
            if (!newName && !newKind) {
                UiUtilsFacades.alert("both name and kind is empty");
                return;
            }

            const note = await CommandMap.updateNoteCoreData({
                id,
                originalEntryVersion,
                name: newName,
                kind: newKind,
            }, { ...io, ...store });

            onUpdated?.(note);
        } catch (e) {
            const msg = (e instanceof Error) ? e.message : "unknown error";
            UiUtilsFacades.alert(`Error: ${msg}`);
        } finally {
            setIsProcessing?.(false);
        }
    }, [store, io, onUpdated, setIsProcessing]);
}