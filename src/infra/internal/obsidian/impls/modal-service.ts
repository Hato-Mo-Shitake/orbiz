import { App } from "obsidian";
import { ModalService, RenderModal, RenderResultModal } from "../../../../app/modal.types";
import { ObsidianOrbizModal, ObsidianOrbizResultModal } from "../modals/orbiz-modal";

export class ObsidianModalService implements ModalService {
    constructor(private readonly _app: App) { }

    open<TProps>(render: RenderModal<TProps>, props: TProps): void {
        const modal = new ObsidianOrbizModal(this._app, props, render);
        modal.open();
    }

    openAndGetResult<TProps, TResult>(render: RenderResultModal<TProps, TResult>, props: TProps): Promise<TResult | undefined> {
        const modal = new ObsidianOrbizResultModal(this._app, props, render);
        return modal.openAndGetResult();
    }
}