import { useCallback } from "react";
import { NoteId, NoteIdList, NoteName, NoteNameList } from "../../../../../domain/note";
import { useStore } from "../../../../context/use-context";

type Mapper = (name: NoteName) => NoteId | undefined;
export function useGetNoteIdByName(): Mapper {
    const noteIndexStore = useStore().noteIndexStore;

    return useCallback((name: NoteName) => {
        const id = noteIndexStore.findIdByName(name);
        if (!id) return undefined;
        return NoteId.from(id);
    }, [noteIndexStore])
}

export function useGetNoteIdsByName(params?: { isStrict: boolean }): (names: NoteNameList) => NoteIdList {
    const noteIndexStore = useStore().noteIndexStore;

    if (params?.isStrict) {
        return useCallback((names: NoteNameList) => {
            const ids: string[] = [];
            for (const name of names) {
                const id = noteIndexStore.getIdByName(name);
                ids.push(id);
            }
            return NoteIdList.fromStringArray(ids);
        }, [noteIndexStore])
    } else {
        return useCallback((names: NoteNameList) => {
            const ids: string[] = [];
            for (const name of names) {
                const id = noteIndexStore.findIdByName(name);
                if (id === undefined) continue;
                ids.push(id);
            }
            return NoteIdList.fromStringArray(ids);
        }, [noteIndexStore])
    }
}