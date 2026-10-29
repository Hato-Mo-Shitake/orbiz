import { WorkspaceLeaf } from "obsidian";
import { ReactNode } from "react";
import { OrbizResolver } from "../../../../app/orbiz-resolver.types";
import { OrbizSpace, ViewType } from "../../../../app/orbiz-space.types";
import { StoreMap } from "../../../../app/stores/store.types";
import { OrbizResolverContext, OrbizSpaceContext, StoreContext } from "../../../../ui/context/context";
import { OrbizHome } from "../../../../ui/features/app/components/organism/orbiz-home";
import { BaseItemView } from "./base-item-view";

export class OrbizHomeView extends BaseItemView {
    constructor(
        leaf: WorkspaceLeaf,
        private readonly _storeMap: StoreMap,
        private readonly _orbizResolver: OrbizResolver,
        private readonly _orbizSpace: OrbizSpace,
    ) {
        super(leaf, _storeMap.issueStore, _storeMap.logStore);
    }

    getViewType(): ViewType {
        return "VIEW_TYPE_Orbiz_Home";
    }

    getTargetNode(): ReactNode {
        return (
            <StoreContext.Provider value={this._storeMap}>
                <OrbizSpaceContext.Provider value={this._orbizSpace}>
                    <OrbizResolverContext.Provider value={this._orbizResolver}>
                        <OrbizHome />
                    </OrbizResolverContext.Provider>
                </OrbizSpaceContext.Provider>
            </StoreContext.Provider>
        )
    }
}