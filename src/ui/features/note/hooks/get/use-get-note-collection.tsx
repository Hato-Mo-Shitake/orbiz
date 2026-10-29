import { AnyNote, NoteCollection, NoteIdList } from "../../../../../domain/note";
import { useOrbizResolver } from "../../../../context/use-context";

export function useGetNoteCollection() {
    const resolver = useOrbizResolver();

    return (ids: NoteIdList) => {
        const notes: AnyNote[] = [];
        for (const id of ids) {
            const note = resolver.getNote(id);

            if (note) notes.push(note);
        }
        return NoteCollection.from(notes);
    }
}