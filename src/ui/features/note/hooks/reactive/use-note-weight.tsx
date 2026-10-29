import { useEffect, useState } from "react";
import { AnyNote, AnyNoteDS } from "../../../../../domain/note";
import { useStore } from "../../../../context/use-context";

export function useNoteWeight(
    note: AnyNote
) {
    const store = useStore().noteIndexStore;
    const iniWeight = AnyNoteDS.hasWeight(note) ? note.weight : undefined;
    const [weight, setWeight] = useState(iniWeight);

    useEffect(() => {
        const unsubscribe = store.subscribeChanged((newNote, oldNote) => {
            if (!oldNote || !note.id.equals(newNote.id)) return;

            const oldWeight = AnyNoteDS.hasWeight(oldNote)
                ? oldNote.weight
                : undefined;
            const newWeight = AnyNoteDS.hasWeight(newNote)
                ? newNote.weight
                : undefined;

            const isUnchanged =
                oldWeight === undefined
                    ? newWeight === undefined
                    : newWeight?.equals(oldWeight);

            if (!isUnchanged) {
                setWeight(newWeight);
            }
        });

        return unsubscribe;
    }, [note, store]);

    return weight;
}