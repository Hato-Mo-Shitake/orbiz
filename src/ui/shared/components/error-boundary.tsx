import { ReactNode } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { UiUtilsFacades } from "../../../_shared/ui-utils-facades";
import { UtilsFacades } from "../../../_shared/utils-facades";
import { IssueStore } from "../../../app/stores/issue-store";
import { LogStore } from "../../../app/stores/log-store";
import { Button } from "./atoms/button";

type AppErrorBoundaryProps = {
    children: ReactNode,
    logStore: LogStore,
    issueStore: IssueStore
}

const DefaultFallback = ({
    error,
    resetErrorBoundary,
}: FallbackProps) => {
    return (
        <>
            <div>Error: {error instanceof Error ? error.message : "unknown error"}</div>

            <Button onClick={resetErrorBoundary}>
                Retry
            </Button>
        </>
    );
};

export const AppErrorBoundary = ({
    children,
    logStore,
    issueStore,
}: AppErrorBoundaryProps) => {
    const handleError = (e: unknown, stack: string | null | undefined) => {
        try {
            issueStore.addAnyError(e);
            const msg = (e instanceof Error) ? e.message : "unknown error"
            logStore.add({
                kind: "other",
                message: `AppErrorBoundary Error: ${msg}, stack: ${stack}`,
                createdAt: UtilsFacades.clock.nowDateTime(),
            });
        } catch {
            UiUtilsFacades.alert("Fatal Error: Missing push error.");
        }
    }

    return (
        <ErrorBoundary
            FallbackComponent={DefaultFallback}
            onError={(e, info) => { handleError(e, info.componentStack) }}
        >
            {children}
        </ErrorBoundary>
    );
}