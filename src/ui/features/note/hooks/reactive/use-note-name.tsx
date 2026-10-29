import { useEffect, useState } from "react";
import { NoteId, NoteName } from "../../../../../domain/note";
import { useStore } from "../../../../context/use-context";

export function useNoteName(
    noteId: NoteId,
    initialName: NoteName
) {
    const store = useStore().noteIndexStore;
    const [name, setName] = useState<NoteName>(initialName);

    useEffect(() => {
        const un = store.subscribeChanged((note, oldNote) => {
            if (!oldNote || !noteId.equals(note.id)) return;
            if (note.name.equals(name)) return;
            setName(note.name);
        })
        return () => {
            un();
        }
    }, [noteId, store]);

    return name;
}