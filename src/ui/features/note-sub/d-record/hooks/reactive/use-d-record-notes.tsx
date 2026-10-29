import { useEffect, useState } from "react";
import { NoteCollection, NoteIdList } from "../../../../../../domain/note";
import { DRecord, DRecordNoteIdsKey } from "../../../../../../domain/note-sub/d-record";
import { useStore } from "../../../../../context/use-context";
import { useGetNoteCollection } from "../../../../note/hooks/get/use-get-note-collection";

export function useDRecordNotes(dRecord: DRecord, dateKey: DRecordNoteIdsKey): NoteCollection | undefined {
    // const noteIndexStore = useStore().noteIndexStore;
    const store = useStore().entryModifiedDRecordHistoryStore;
    const getCollection = useGetNoteCollection();
    const noteIds = dRecord.noteIdsMap[dateKey];

    const [notes, setNotes] = useState(
        noteIds ? getCollection(noteIds) : undefined
    );

    const set = (noteIds: NoteIdList | undefined) => {
        setNotes(noteIds ? getCollection(noteIds) : undefined)
    }
    useEffect(() => {
        const un = store.subscribe((newDRecord, oldDRecord) => {
            const newList = newDRecord.getNoteIds(dateKey);
            const oldList = oldDRecord?.getNoteIds(dateKey);

            const isUnchanged = !newList
                ? !oldList
                : oldList?.equals(newList);

            if (isUnchanged) {
                return;
            }

            set(newList);
        });
        return () => {
            un();
        }
    }, [dRecord, dateKey]);

    return notes;
}