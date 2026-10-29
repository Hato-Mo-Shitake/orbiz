import { useEffect, useState } from "react";
import { DateTime } from "../../../../../_shared/date-time.vo";
import { NoteId } from "../../../../../domain/note";
import { useStore } from "../../../../context/use-context";

export function useNoteEntryModifiedAt(
    noteId: NoteId,
    initialDate: DateTime
): DateTime {
    const store = useStore().noteIndexStore;
    const [d, setD] = useState<DateTime>(initialDate);

    useEffect(() => {
        const un = store.subscribeChanged((note, oldNote) => {
            if (!oldNote || !noteId.equals(note.id)) return;
            if (note.entryModifiedAt.equals(d)) return;
            setD(note.entryModifiedAt);
        })
        return () => {
            un();
        }
    }, [noteId, store])

    return d;
}