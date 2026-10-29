import { useCallback } from "react";
import { NoteId, NoteIdList, NoteName, NoteNameList } from "../../../../../domain/note";
import { useStore } from "../../../../context/use-context";

type GetNoteName = (id: NoteId) => NoteName | undefined;
export function useGetNoteName(): GetNoteName {
    const noteIndexStore = useStore().noteIndexStore;

    return useCallback((id: NoteId) => {
        const name = noteIndexStore.findName(id);
        if (!name) return undefined;
        return NoteName.from(name);
    }, [noteIndexStore])
}


type GetNoteNames = (ids: NoteIdList) => NoteNameList;
export function useGetNoteNames(): GetNoteNames {
    const noteIndexStore = useStore().noteIndexStore;

    return useCallback((ids: NoteIdList) => {
        const names: string[] = []
        for (const id of ids) {
            const name = noteIndexStore.getName(id);
            // if (!name) continue;
            names.push(name);
        }

        return NoteNameList.from(names);
    }, [noteIndexStore])
}

type NoteNamesWithId = { name: string, id: NoteId }
export function useGetNoteNamesWithId() {
    const noteIndexStore = useStore().noteIndexStore;

    return useCallback((ids: NoteIdList) => {
        const namesWithId: NoteNamesWithId[] = []
        for (const id of ids) {
            const name = noteIndexStore.getName(id);

            namesWithId.push({
                name,
                id,
            });
        }

        return namesWithId;
    }, [noteIndexStore]);
}