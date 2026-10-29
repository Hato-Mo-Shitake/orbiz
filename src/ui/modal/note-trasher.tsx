import { Path } from "../../_shared/path.vo"
import { IoMap } from "../../app/io/io.types"
import { ModalProps } from "../../app/modal.types"
import { OrbizResolver } from "../../app/orbiz-resolver.types"
import { OrbizSpace } from "../../app/orbiz-space.types"
import { StoreMap } from "../../app/stores/store.types"
import { NoteId } from "../../domain/note"
import { IoContext, OrbizResolverContext, OrbizSpaceContext, StoreContext } from "../context/context"
import { NoteTrasher } from "../features/app/components/organism/note-trasher"


type Props = {
    orbizSpace: OrbizSpace,
    orbizResolver: OrbizResolver,
    storeMap: StoreMap,
    ioMap: IoMap,
    defaultNoteId?: NoteId,
    onTrashed?: (path: Path) => void,
}

export function renderNoteTrasherModal({
    orbizSpace,
    orbizResolver,
    storeMap,
    ioMap,
    defaultNoteId,
    onTrashed,
    onClose
}: ModalProps<Props>) {

    return (
        <StoreContext.Provider value={storeMap}>
            <OrbizSpaceContext.Provider value={orbizSpace}>
                <OrbizResolverContext.Provider value={orbizResolver}>
                    <IoContext.Provider value={ioMap}>
                        <NoteTrasher
                            defaultNoteId={defaultNoteId}
                            onTrashed={(path) => {
                                onTrashed?.(path);
                                onClose();
                            }}
                        />
                    </IoContext.Provider>
                </OrbizResolverContext.Provider>
            </OrbizSpaceContext.Provider>
        </StoreContext.Provider>
    )

}