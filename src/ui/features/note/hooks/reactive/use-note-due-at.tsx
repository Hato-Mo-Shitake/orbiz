import { useEffect, useState } from "react";
import { AnyNote, AnyNoteDS } from "../../../../../domain/note";
import { useStore } from "../../../../context/use-context";

export function useNoteDueAt(
    note: AnyNote
) {
    const store = useStore().noteIndexStore;
    const iniDate = AnyNoteDS.hasDueAt(note) ? note.dueAt : undefined;
    const [DueAt, setDueAt] = useState(iniDate);

    useEffect(() => {
        const unsubscribe = store.subscribeChanged((newNote, oldNote) => {
            if (!oldNote || !note.id.equals(newNote.id)) return;

            const oldDueAt = AnyNoteDS.hasDueAt(oldNote)
                ? oldNote.dueAt
                : undefined;
            const newDueAt = AnyNoteDS.hasDueAt(newNote)
                ? newNote.dueAt
                : undefined;

            const isUnchanged =
                oldDueAt === undefined
                    ? newDueAt === undefined
                    : (
                        oldDueAt === null
                            ? newDueAt === null
                            : newDueAt?.equals(oldDueAt)
                    );

            if (!isUnchanged) {
                setDueAt(newDueAt);
            }
        });

        return unsubscribe;
    }, [note, store]);

    return DueAt;
}