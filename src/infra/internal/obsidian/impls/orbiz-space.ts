
import { App, WorkspaceLeaf } from "obsidian";
import { PATH_SEPARATOR } from "../../../../_shared/const";
import { Path } from "../../../../_shared/path.vo";
import { ModalService } from "../../../../app/modal.types";
import { OrbizSpace, ViewType } from "../../../../app/orbiz-space.types";
import { OrbizFilePath } from "../../../../app/orbiz.types";

export class ObsidianOrbizSpace implements OrbizSpace {
    constructor(
        private readonly _app: App,
        readonly modal: ModalService,
    ) {
    }

    private get _ws() {
        return this._app.workspace;
    }

    existsFile(path: string): boolean {
        const file = this._app.vault.getFileByPath(path);
        return file !== undefined;
    }

    async openSideView(type: ViewType, position: "right" | "left") {
        await this._ws.ensureSideLeaf(type, position, {
            active: true,
            reveal: true,
        });
    }

    async openMainView(type: ViewType): Promise<void> {
        let existingLeaf: WorkspaceLeaf | undefined;

        this._ws.iterateRootLeaves(leaf => {
            if (!existingLeaf && leaf.view.getViewType() === type) {
                existingLeaf = leaf;
            }
        });

        if (existingLeaf) {
            await this._ws.revealLeaf(existingLeaf);
            // return existingLeaf;
        }

        const leaf = this._ws.getLeaf("tab");
        await leaf.setViewState({ type, active: true });
        await this._ws.revealLeaf(leaf);

        // return leaf;
    }
    async openFile(
        path: string | Path | OrbizFilePath,
        newLeaf?: "tab" | "window" | "split"
    ): Promise<boolean> {
        const pathString = typeof path === "string" ? path : path.toString();

        const file = this._app.vault.getFileByPath(pathString);
        if (!file) return false;

        await this._ws.openLinkText(pathString, PATH_SEPARATOR, newLeaf);
        return true;
    }
}