import { useCallback } from "react";
import { NoteId, NoteIdList, NotePath } from "../../../../../domain/note";
import { useStore } from "../../../../context/use-context";

export function useGetNotePath(): (id: NoteId) => NotePath | undefined {
    const noteIndexStore = useStore().noteIndexStore;

    return useCallback((id: NoteId) => {
        const source = noteIndexStore.findSource(id);
        if (!source) return undefined;
        return NotePath.tryFrom(source.path);
    }, [noteIndexStore])
}

type GetPaths = (ids: NoteIdList) => NotePath[];
export function useGetNotePaths(): GetPaths {
    const noteIndexStore = useStore().noteIndexStore;

    return useCallback((ids: NoteIdList) => {
        const paths: NotePath[] = []
        for (const id of ids) {
            const path = noteIndexStore.findSource(id)?.path;
            if (!path) continue;
            paths.push(NotePath.from(path));
        }

        return paths;
    }, [noteIndexStore])
}