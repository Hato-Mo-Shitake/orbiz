import { useEffect, useState } from "react";
import { AnyNote, AnyNoteDS } from "../../../../../domain/note";
import { useStore } from "../../../../context/use-context";

export function useNoteStartedAt(
    note: AnyNote
) {
    const store = useStore().noteIndexStore;
    const iniDate = AnyNoteDS.hasStartedAt(note) ? note.startedAt : undefined;
    const [StartedAt, setStartedAt] = useState(iniDate);

    useEffect(() => {
        const unsubscribe = store.subscribeChanged((newNote, oldNote) => {
            if (!oldNote || !note.id.equals(newNote.id)) return;

            const oldStartedAt = AnyNoteDS.hasStartedAt(oldNote)
                ? oldNote.startedAt
                : undefined;
            const newStartedAt = AnyNoteDS.hasStartedAt(newNote)
                ? newNote.startedAt
                : undefined;

            const isUnchanged =
                oldStartedAt === undefined
                    ? newStartedAt === undefined
                    : (
                        oldStartedAt === null
                            ? newStartedAt === null
                            : newStartedAt?.equals(oldStartedAt)
                    );

            if (!isUnchanged) {
                setStartedAt(newStartedAt);
            }
        });

        return unsubscribe;
    }, [note, store]);

    return StartedAt;
}