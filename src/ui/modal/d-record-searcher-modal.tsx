import { ModalProps } from "../../app/modal.types"
import { OrbizResolver } from "../../app/orbiz-resolver.types"
import { OrbizSpace } from "../../app/orbiz-space.types"
import { StoreMap } from "../../app/stores/store.types"
import { OrbizResolverContext, OrbizSpaceContext, StoreContext } from "../context/context"
import { DRecordSearcher } from "../features/note-sub/d-record/components/organism/d-record-searcher"


type Props = {
    orbizSpace: OrbizSpace,
    orbizResolver: OrbizResolver,
    storeMap: StoreMap,
}

export function renderDRecordSearcherModal({
    orbizSpace,
    orbizResolver,
    storeMap,
    onClose
}: ModalProps<Props>) {
    return (
        <StoreContext.Provider value={storeMap}>
            <OrbizSpaceContext.Provider value={orbizSpace}>
                <OrbizResolverContext.Provider value={orbizResolver}>
                    <DRecordSearcher onDRecordOpened={() => {
                        onClose();
                    }} />
                </OrbizResolverContext.Provider>
            </OrbizSpaceContext.Provider>
        </StoreContext.Provider>
    )
}