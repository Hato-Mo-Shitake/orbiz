import { IoMap } from "../../app/io/io.types"
import { ModalProps } from "../../app/modal.types"
import { OrbizResolver } from "../../app/orbiz-resolver.types"
import { OrbizSpace } from "../../app/orbiz-space.types"
import { StoreMap } from "../../app/stores/store.types"
import { AnyNote, NoteId } from "../../domain/note"
import { IoContext, OrbizResolverContext, OrbizSpaceContext, StoreContext } from "../context/context"
import { NoteCoreDataUpdater } from "../features/note/components/organism/note-core-data-updater"


type Props = {
    orbizSpace: OrbizSpace,
    orbizResolver: OrbizResolver,
    storeMap: StoreMap,
    ioMap: IoMap,
    defaultNoteId?: NoteId,
    onUpdated?: (note: AnyNote) => void,
}

export function renderNoteCoreDataUpdaterModal({
    orbizSpace,
    orbizResolver,
    storeMap,
    ioMap,
    defaultNoteId,
    onUpdated,
    onClose
}: ModalProps<Props>) {
    return (
        <StoreContext.Provider value={storeMap}>
            <OrbizSpaceContext.Provider value={orbizSpace}>
                <OrbizResolverContext.Provider value={orbizResolver}>
                    <IoContext.Provider value={ioMap}>
                        <NoteCoreDataUpdater
                            defaultNoteId={defaultNoteId}
                            onUpdated={async (note) => {
                                onUpdated?.(note);
                                await orbizSpace.openFile(note.path)
                                onClose();
                            }}
                        />
                    </IoContext.Provider>
                </OrbizResolverContext.Provider>
            </OrbizSpaceContext.Provider>
        </StoreContext.Provider>
    )
}