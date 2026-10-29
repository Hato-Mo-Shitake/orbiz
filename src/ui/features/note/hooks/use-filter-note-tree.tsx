import { useEffect, useState } from "react";
import { UtilsFacades } from "../../../../_shared/utils-facades";
import { NoteFilter, NoteTreeCollection } from "../../../../domain/note";
import { useOrbizResolver, useOrbizSpace, useStore } from "../../../context/use-context";
import { renderNoteFilterInputModal } from "../../../modal/note-filter-input-modal";

export function useFilterNoteTree(originalNoteTree: NoteTreeCollection | undefined) {
    const orbizSpace = useOrbizSpace();
    const orbizResolver = useOrbizResolver();
    const storeMap = useStore();

    const [filteredNoteTree, setFilteredNoteTree] = useState<NoteTreeCollection | undefined>(originalNoteTree);
    const [filter, setFilter] = useState<NoteFilter | undefined>(undefined);

    useEffect(() => {
        setFilteredNoteTree(originalNoteTree);
    }, [originalNoteTree]);

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
            setFilteredNoteTree(originalNoteTree?.filter(newFilter, now));
        } else {
            setFilteredNoteTree(originalNoteTree);
        }
    }

    return { filteredNoteTree, openModalAndHandleFilter }
}