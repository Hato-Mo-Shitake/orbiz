import { useCallback } from "react";
import { UiUtilsFacades } from "../../../_shared/ui-utils-facades";
import { CommandMap } from "../../../app/workflows/command/command";
import { AnyNote, NoteId, NotePriority, NoteTagList, NoteWeight } from "../../../domain/note";
import { useIo, useStore } from "../../context/use-context";
import { AnyNoteSemanticDateRecord, AnyNoteSemanticOutlinkNamesRecord } from "../../features/note/components/note.types";

export function useUpdateNoteMetadata(
    onUpdated?: (note: AnyNote) => void,
    setIsProcessing?: (isProcessing: boolean) => void,
) {
    const store = useStore()
    const io = useIo();

    return useCallback(async (
        id: NoteId,
        originalEntryVersion: number,
        metadata: {
            tags: NoteTagList,
            semanticOutlinkNames: AnyNoteSemanticOutlinkNamesRecord,
            semanticDates: AnyNoteSemanticDateRecord,
            weight: NoteWeight,
            priority: NotePriority
        }
    ) => {
        try {
            setIsProcessing?.(true);
            const note = await CommandMap.updateNoteMetadata({
                id,
                originalEntryVersion,
                metadata
            }, { ...store, ...io });

            onUpdated?.(note);

        } catch (e) {
            const msg = (e instanceof Error) ? e.message : "unknown error";
            UiUtilsFacades.alert(`Error: ${msg}`);
        } finally {
            setIsProcessing?.(false)
        }
    }, [store, io, onUpdated, setIsProcessing])
}