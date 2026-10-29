import { useCallback } from "react";
import { Path } from "../../../_shared/path.vo";
import { UiUtilsFacades } from "../../../_shared/ui-utils-facades";
import { CommandMap } from "../../../app/workflows/command/command";
import { CreateAnyNoteRequest } from "../../../app/workflows/command/create-note.types";
import { AnyNote } from "../../../domain/note";
import { useIo, useStore } from "../../context/use-context";


export function useAdaptFileToNote(params: {
    onAdapted?: (note: AnyNote) => void,
    setIsProcessing?: (isProcessing: boolean) => void,
}) {
    const store = useStore();
    const io = useIo();
    const { onAdapted, setIsProcessing } = params;

    return useCallback(async (request: {
        filePath: Path,
        createNoteRequest: CreateAnyNoteRequest
    }) => {
        try {
            setIsProcessing?.(true);
            const note = await CommandMap.adaptFileToNote(request, {
                ...store,
                ...io,
            });
            setIsProcessing?.(false);
            UiUtilsFacades.notice("Success: File is adapted to note!!");
            onAdapted?.(note)
        } catch (e) {
            const msg = (e instanceof Error) ? e.message : "unknown error";
            UiUtilsFacades.alert(`Error: ${msg}`);
            setIsProcessing?.(false);
        } finally {
            setIsProcessing?.(false);
        }
    }, [store, io, onAdapted, setIsProcessing])
}