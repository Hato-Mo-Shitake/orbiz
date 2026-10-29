import { App, IconName, Modal, Notice, setIcon as setIconObsidian, setTooltip as setTooltipObsidian } from "obsidian";
import { IssueError } from "./error";
import { TooltipOptions } from "./ui-utils-facades.types";


// TODO: とりあえず限定的にObsidian依存を許す。どこかでインフラ実装からの依存注入する形式に変更。
// また置き場所を ui/ にするか否かも検討.
export class UiUtilsFacades {

    private static __app: App | undefined;

    private static get _app(): App {
        if (!this.__app) {
            throw new IssueError({
                title: "Unset app",
                message: "Unset app in UiUtilsFacades",
                location: "UiUtilsFacades",
                layer: "shared"
            });
        }
        return this.__app;
    }

    static alert(message: string) {
        const modal = new Modal(this._app);
        modal.setTitle("Error");
        modal.contentEl.setText(`${message}`);
        modal.open();
    }

    static notice(message: string | DocumentFragment, duration?: number) {
        new Notice(message, duration);
    }

    static setIcon = (parent: HTMLElement, iconId: IconName) => {
        setIconObsidian(parent, iconId);
    }

    static setTooltip = (el: HTMLElement, content: string, options?: TooltipOptions) => {
        if (options) {
            if (!options?.delay) {
                options['delay'] = 400;
            }
            if (!options.placement) {
                options['placement'] = 'top';
            }
        } else {
            setTooltipObsidian(el, content, {
                delay: 300,
                placement: 'top'
            });
        }

        setTooltipObsidian(el, content, options);
    }
}