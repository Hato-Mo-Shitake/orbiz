import { WorkspaceLeaf } from "obsidian";
import { ReactNode } from "react";
import { IoMap } from "../../../../app/io/io.types";
import { OrbizResolver } from "../../../../app/orbiz-resolver.types";
import { OrbizSpace, ViewType } from "../../../../app/orbiz-space.types";
import { StoreMap } from "../../../../app/stores/store.types";
import { IoContext, OrbizResolverContext, OrbizSpaceContext, StoreContext } from "../../../../ui/context/context";
import { LatestActiveOrbizFileSideDisplay } from "../../../../ui/features/app/components/organism/latest-active-orbiz-file-side-display";
import { BaseItemView } from "./base-item-view";

export class LatestActiveOrbizFileSideView extends BaseItemView {
    constructor(
        leaf: WorkspaceLeaf,
        private readonly _storeMap: StoreMap,
        private readonly _ioMap: IoMap,
        private readonly _orbizResolver: OrbizResolver,
        private readonly _orbizSpace: OrbizSpace,
    ) {
        super(leaf, _storeMap.issueStore, _storeMap.logStore);
    }

    getViewType(): ViewType {
        return "VIEW_TYPE_Latest_Active_OrbizFile_Side";
    }

    getTargetNode(): ReactNode {
        return (
            <StoreContext.Provider value={this._storeMap}>
                <OrbizSpaceContext.Provider value={this._orbizSpace}>
                    <OrbizResolverContext.Provider value={this._orbizResolver}>
                        <IoContext.Provider value={this._ioMap}>
                            <LatestActiveOrbizFileSideDisplay />
                        </IoContext.Provider>
                    </OrbizResolverContext.Provider>
                </OrbizSpaceContext.Provider>
            </StoreContext.Provider>
        )
    }
}