import { useEffect, useState } from "react";
import { AnyNote, AnyNoteDS } from "../../../../../domain/note";
import { useStore } from "../../../../context/use-context";

export function useNotePriority(
    note: AnyNote
) {
    const store = useStore().noteIndexStore;
    const iniPriority = AnyNoteDS.hasPriority(note) ? note.priority : undefined;
    const [priority, setpriority] = useState(iniPriority);

    useEffect(() => {
        const unsubscribe = store.subscribeChanged((newNote, oldNote) => {
            if (!oldNote || !note.id.equals(newNote.id)) return;

            const oldPriority = AnyNoteDS.hasPriority(oldNote)
                ? oldNote.priority
                : undefined;
            const newPriority = AnyNoteDS.hasPriority(newNote)
                ? newNote.priority
                : undefined;

            const isUnchanged =
                oldPriority === undefined
                    ? newPriority === undefined
                    : newPriority !== undefined && oldPriority.equals(newPriority);

            if (!isUnchanged) {
                setpriority(newPriority);
            }
        });

        return unsubscribe;
    }, [note, store]);

    return priority;
}