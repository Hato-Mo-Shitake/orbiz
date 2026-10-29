import { NoteId } from "../../../../../domain/note";
import { useStore } from "../../../../context/use-context";

export function useGetLatestActiveNoteId() {
    const noteIndexStore = useStore().noteIndexStore;
    const store = useStore().latestActiveOrbizFileStore;

    return () => {
        const notePath = store.getPath("note");
        if (!notePath) return undefined;
        return NoteId.from(noteIndexStore.getIdByName(notePath.name));
    }
}