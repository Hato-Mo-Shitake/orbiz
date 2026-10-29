import { useEffect, useState } from "react";
import { AnyNote, AnyNoteDS } from "../../../../../domain/note";
import { useStore } from "../../../../context/use-context";

export function useNoteResolvedAt(
    note: AnyNote,
) {
    const store = useStore().noteIndexStore;
    const iniDate = AnyNoteDS.hasResolvedAt(note) ? note.resolvedAt : undefined;
    const [ResolvedAt, setResolvedAt] = useState(iniDate);

    useEffect(() => {
        const unsubscribe = store.subscribeChanged((newNote, oldNote) => {
            if (!oldNote || !note.id.equals(newNote.id)) return;

            const oldResolvedAt = AnyNoteDS.hasResolvedAt(oldNote)
                ? oldNote.resolvedAt
                : undefined;
            const newResolvedAt = AnyNoteDS.hasResolvedAt(newNote)
                ? newNote.resolvedAt
                : undefined;

            const isUnchanged =
                oldResolvedAt === undefined
                    ? newResolvedAt === undefined
                    : (
                        oldResolvedAt === null
                            ? newResolvedAt === null
                            : newResolvedAt?.equals(oldResolvedAt)
                    );

            if (!isUnchanged) {
                setResolvedAt(newResolvedAt);
            }
        });

        return unsubscribe;
    }, [note, store]);

    return ResolvedAt;
}