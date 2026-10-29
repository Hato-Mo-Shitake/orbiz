import { useEffect, useState } from "react";
import { AnyNote, NoteTagList } from "../../../../../domain/note";
import { useStore } from "../../../../context/use-context";

export function useNoteTags(
    note: AnyNote
) {
    const store = useStore().noteIndexStore;
    const [tags, setTags] = useState<NoteTagList>(note.tags);

    useEffect(() => {
        const un = store.subscribeChanged((newNote, oldNote) => {
            if (!oldNote || !note.id.equals(newNote.id)) return;
            if (newNote.tags.equals(tags)) return;
            setTags(newNote.tags);
        })
        return () => {
            un();
        }
    }, [note, store]);

    return tags;
}