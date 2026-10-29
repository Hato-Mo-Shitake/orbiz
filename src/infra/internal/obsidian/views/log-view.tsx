import { WorkspaceLeaf } from "obsidian";
import { ReactNode } from "react";
import { OrbizResolver } from "../../../../app/orbiz-resolver.types";
import { OrbizSpace, ViewType } from "../../../../app/orbiz-space.types";
import { StoreMap } from "../../../../app/stores/store.types";
import { OrbizResolverContext, OrbizSpaceContext, StoreContext } from "../../../../ui/context/context";
import { LogsDisplay } from "../../../../ui/features/app/components/organism/logs-display";
import { BaseItemView } from "./base-item-view";

export class LogView extends BaseItemView {
    constructor(
        leaf: WorkspaceLeaf,
        private readonly _storeMap: StoreMap,
        private readonly _orbizResolver: OrbizResolver,
        private readonly _orbizSpace: OrbizSpace,
    ) {
        super(leaf, _storeMap.issueStore, _storeMap.logStore);
    }

    getViewType(): ViewType {
        return "VIEW_TYPE_Log";
    }

    getTargetNode(): ReactNode {
        return (
            <StoreContext.Provider value={this._storeMap}>
                <OrbizSpaceContext.Provider value={this._orbizSpace}>
                    <OrbizResolverContext.Provider value={this._orbizResolver}>
                        <LogsDisplay />
                    </OrbizResolverContext.Provider>
                </OrbizSpaceContext.Provider>
            </StoreContext.Provider>
        )
    }
}