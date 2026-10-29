import { useCallback } from "react";
import { UiUtilsFacades } from "../../../_shared/ui-utils-facades";
import { CommandMap } from "../../../app/workflows/command/command";
import { CreateAnyNoteRequest, } from "../../../app/workflows/command/create-note.types";
import { AnyNote } from "../../../domain/note";
import { useIo, useStore } from "../../context/use-context";

export function useCreateNote(params: {
    onCreated?: (note: AnyNote) => void,
    setIsProcessing?: (isProcessing: boolean) => void,
}) {

    const store = useStore();
    const io = useIo();
    const { onCreated, setIsProcessing } = params;

    return useCallback(async (request: CreateAnyNoteRequest) => {
        try {
            setIsProcessing?.(true);
            const note = await CommandMap.createNote(
                request,
                { ...store, ...io }
            );
            setIsProcessing?.(false);
            UiUtilsFacades.notice("Success: Note is created!!")
            onCreated?.(note);

        } catch (e) {
            const msg = (e instanceof Error) ? e.message : "unknown error";
            UiUtilsFacades.alert(`Error: ${msg}`);
        } finally {
            setIsProcessing?.(false);
        }
    }, [onCreated, setIsProcessing, store, io])
}
