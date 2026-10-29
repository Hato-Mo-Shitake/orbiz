import { Path } from "../../_shared/path.vo"
import { IoMap } from "../../app/io/io.types"
import { ModalProps } from "../../app/modal.types"
import { OrbizResolver } from "../../app/orbiz-resolver.types"
import { OrbizSpace } from "../../app/orbiz-space.types"
import { StoreMap } from "../../app/stores/store.types"
import { AnyNote } from "../../domain/note"
import { IoContext, OrbizResolverContext, OrbizSpaceContext, StoreContext } from "../context/context"
import { NoteAdaptor } from "../features/note/components/organism/note-adaptor"
import { DefaultNoteCreatorParams } from "../features/note/components/organism/note-creator.types"

type Props = {
    filePath: Path,
    defaultParams?: DefaultNoteCreatorParams,
    onSubmit: (value: AnyNote) => void,
    orbizSpace: OrbizSpace,
    orbizResolver: OrbizResolver,
    storeMap: StoreMap,
    ioMap: IoMap,

}

export function renderNoteAdaptorModal({
    filePath,
    orbizSpace,
    orbizResolver,
    storeMap,
    ioMap,
    defaultParams,
    onSubmit,
    onClose
}: ModalProps<Props>) {
    return (
        <StoreContext.Provider value={storeMap}>
            <OrbizSpaceContext.Provider value={orbizSpace}>
                <OrbizResolverContext.Provider value={orbizResolver}>
                    <IoContext.Provider value={ioMap}>
                        <NoteAdaptor
                            filePath={filePath}
                            defaultParams={defaultParams}
                            onAdapted={async (note) => {
                                onSubmit(note);
                                storeMap.latestActiveOrbizFileStore.setActivePath(note.path.value);
                                await orbizSpace.openFile(note.path);
                                onClose();
                            }}
                        />
                    </IoContext.Provider>
                </OrbizResolverContext.Provider>
            </OrbizSpaceContext.Provider>
        </StoreContext.Provider>
    )
}