import { useEffect, useState } from "react";
import { NoteId, NoteKind } from "../../../../../domain/note";
import { useStore } from "../../../../context/use-context";

export function useNoteKind(
    noteId: NoteId,
    initialKind: NoteKind
): NoteKind {
    const store = useStore().noteIndexStore;
    const [kind, setKind] = useState<NoteKind>(initialKind);

    useEffect(() => {
        const un = store.subscribeChanged((note, oldNote) => {
            if (!oldNote || !noteId.equals(note.id)) return;
            if (note.kind === oldNote.kind) return;
            setKind(note.kind);
        })
        return () => {
            un();
        }
    }, [noteId, store]);

    return kind;
}