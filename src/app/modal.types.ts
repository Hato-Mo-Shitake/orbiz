import { ReactNode } from "react";

export type ModalProps<TProps> = TProps & {
    onClose: () => void;
}
export type ResultModalProps<TProps, TResult> = TProps & {
    onSubmit: (result: TResult) => void;
    onClose: () => void;
};


export type RenderModal<TProps> = (
    props: ModalProps<TProps>
) => ReactNode;
export type RenderResultModal<TProps, TResult> = (
    props: ResultModalProps<TProps, TResult>
) => ReactNode;

export interface ModalService {
    openAndGetResult<TProps, TResult>(
        render: RenderResultModal<TProps, TResult>,
        props: TProps
    ): Promise<TResult | undefined>;

    open<TProps>(
        render: RenderModal<TProps>,
        props: TProps
    ): void;
}

