import { App, Modal } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { IssueError } from "../../../../_shared/error";
import { RenderModal, RenderResultModal } from "../../../../app/modal.types";


export class ObsidianOrbizModal<TProps> extends Modal {
    private root: Root | null = null;


    constructor(
        app: App,
        private props: TProps,
        private render: RenderModal<TProps>
    ) {
        super(app);
    }

    override onOpen(): void {
        const { contentEl } = this;
        contentEl.empty();

        this.root = createRoot(contentEl);

        const modalProps = {
            ...this.props,
            onClose: () => {
                this.close();
            }
        }

        this.root.render(this.render(modalProps));
    }

    override onClose(): void {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
        this.contentEl.empty();
    }
}

export class ObsidianOrbizResultModal<TProps, TResult> extends Modal {
    private resolvePromise: ((value: TResult | undefined) => void) | undefined;
    private resultValue: TResult | undefined = undefined;
    private root: Root | null = null;

    constructor(
        app: App,
        private props: TProps,
        private render: RenderResultModal<TProps, TResult>
    ) {
        super(app);
    }

    openAndGetResult(): Promise<TResult | undefined> {
        if (this.resolvePromise) {
            throw new IssueError({
                title: "Modal is already awaiting a result.",
                message: "Modal is already awaiting a result.",
                layer: "infra",
                location: "ObsidianOrbizModal"
            });
        }

        return new Promise<TResult | undefined>((resolve) => {
            this.resolvePromise = resolve;
            this.open();
        });
    }

    override onOpen(): void {
        const { contentEl } = this;
        contentEl.empty();

        this.root = createRoot(contentEl);

        const modalProps = {
            ...this.props,
            onSubmit: (result: TResult) => {
                this.resultValue = result;
                this.close();
            },
            onClose: () => {
                this.close();
            }
        }

        this.root.render(this.render(modalProps));
    }

    override onClose(): void {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
        this.contentEl.empty();

        const resolve = this.resolvePromise;
        this.resolvePromise = undefined;
        resolve?.(this.resultValue);
    }
}
