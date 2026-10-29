import { ItemView, WorkspaceLeaf } from "obsidian";
import React, { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { ViewType } from "../../../../app/orbiz-space.types";
import { IssueStore } from "../../../../app/stores/issue-store";
import { LogStore } from "../../../../app/stores/log-store";
import { AppErrorBoundary } from "../../../../ui/shared/components/error-boundary";

export abstract class BaseItemView extends ItemView {
    root: Root | null = null;

    constructor(
        leaf: WorkspaceLeaf,
        private readonly _issueStore: IssueStore,
        private readonly _logStore: LogStore,
    ) {
        super(leaf);
    }

    abstract getViewType(): ViewType;
    abstract getTargetNode(): React.ReactNode;

    getDisplayText() {
        const type = this.getViewType().toString();
        const prefix = "VIEW_TYPE_";
        return type.startsWith(prefix)
            ? type.slice(prefix.length)
            : type;
    }

    async onOpen() {
        this.root = createRoot(this.contentEl);
        this.root.render(
            <StrictMode>
                <AppErrorBoundary
                    issueStore={this._issueStore}
                    logStore={this._logStore}
                >
                    {this.getTargetNode()}
                </AppErrorBoundary>
            </StrictMode>,
        );
    }

    async onClose() {
        this.root?.unmount();
    }
}