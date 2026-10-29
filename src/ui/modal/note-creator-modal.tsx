import { IoMap } from "../../app/io/io.types"
import { ModalProps } from "../../app/modal.types"
import { OrbizResolver } from "../../app/orbiz-resolver.types"
import { OrbizSpace } from "../../app/orbiz-space.types"
import { StoreMap } from "../../app/stores/store.types"
import { AnyNote } from "../../domain/note"
import { IoContext, OrbizResolverContext, OrbizSpaceContext, StoreContext } from "../context/context"
import { NoteCreator } from "../features/note/components/organism/note-creator"
import { DefaultNoteCreatorParams } from "../features/note/components/organism/note-creator.types"

type Props = {
    orbizSpace: OrbizSpace,
    orbizResolver: OrbizResolver,
    storeMap: StoreMap,
    ioMap: IoMap,
    defaultParams?: DefaultNoteCreatorParams,
    onCreated?: (note: AnyNote) => void,
}

export function renderNoteCreatorModal({
    orbizSpace,
    orbizResolver,
    storeMap,
    ioMap,
    defaultParams,
    onCreated,
    onClose
}: ModalProps<Props>) {
    return (
        <StoreContext.Provider value={storeMap}>
            <OrbizSpaceContext.Provider value={orbizSpace}>
                <OrbizResolverContext.Provider value={orbizResolver}>
                    <IoContext.Provider value={ioMap}>
                        <NoteCreator
                            defaultParams={defaultParams}
                            onCreated={async (note) => {
                                onCreated?.(note);
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