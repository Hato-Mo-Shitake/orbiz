import { useCallback } from "react";
import { UiUtilsFacades } from "../../../_shared/ui-utils-facades";
import { CommandMap } from "../../../app/workflows/command/command";
import { AnyNote, AnyNoteSemanticOutlinksKey, NoteId } from "../../../domain/note";
import { useIo, useStore } from "../../context/use-context";

export function useAddNoteOutlink(
    onAdded?: (note: AnyNote) => void,
    setIsProcessing?: (isProcessing: boolean) => void,
) {
    const store = useStore();
    const io = useIo();

    return useCallback(async (params: {
        noteId: NoteId,
        key: AnyNoteSemanticOutlinksKey,
        addId: NoteId,
    }) => {
        const { noteId, key, addId } = params;

        try {
            setIsProcessing?.(true);
            const newNote = await CommandMap.addNoteOutlink({
                noteId,
                key,
                addId
            }, { ...store, ...io });
            onAdded?.(newNote);


            UiUtilsFacades.notice("Success: semantic outlink added!!");
        } catch (e) {
            const msg = (e instanceof Error) ? e.message : "unknown error";
            UiUtilsFacades.alert(`Error: ${msg}`);

        } finally {
            setIsProcessing?.(false);
        }
    }, [onAdded, setIsProcessing, store, io]);
}