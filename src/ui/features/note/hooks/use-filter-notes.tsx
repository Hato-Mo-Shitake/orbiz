import { useEffect, useState } from "react";
import { UtilsFacades } from "../../../../_shared/utils-facades";
import { NoteCollection, NoteFilter } from "../../../../domain/note";
import { useOrbizResolver, useOrbizSpace, useStore } from "../../../context/use-context";
import { renderNoteFilterInputModal } from "../../../modal/note-filter-input-modal";

export function useFilterNotes(originalNotes: NoteCollection | undefined) {
    const orbizSpace = useOrbizSpace();
    const orbizResolver = useOrbizResolver();
    const storeMap = useStore();

    const [filteredNotes, setFilteredNotes] = useState<NoteCollection | undefined>(originalNotes);
    const [filter, setFilter] = useState<NoteFilter | undefined>(undefined);

    useEffect(() => {
        setFilteredNotes(originalNotes);
    }, [originalNotes]);

    const openModalAndHandleFilter = async () => {
        const newFilter = await orbizSpace.modal.openAndGetResult(renderNoteFilterInputModal, {
            orbizSpace,
            orbizResolver,
            storeMap,
            filter,
        });

        const now = UtilsFacades.clock.nowDateTime();
        setFilter(newFilter);
        if (newFilter) {
            setFilteredNotes(originalNotes?.filter(newFilter, now));
        } else {
            setFilteredNotes(originalNotes);
        }
    }

    return { filteredNotes, openModalAndHandleFilter }
}