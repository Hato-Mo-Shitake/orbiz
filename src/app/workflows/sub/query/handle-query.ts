import { QueryError } from "../../../../_shared/error";
import { UtilsFacades } from "../../../../_shared/utils-facades";
import { IssueStore } from "../../../stores/issue-store";
import { LogStore } from "../../../stores/log-store";

export function handleQuery<T>({
    callback, issueStore, logStore, errorLogMsg
}: {
    callback: () => T,
    issueStore: IssueStore,
    logStore: LogStore,
    errorLogMsg: string,
}): T {
    const now = UtilsFacades.clock.nowDateTime();

    try {
        return callback();
    } catch (e) {
        issueStore.addAnyError(e);
        const errorMsg = e instanceof Error ? e.message : "unknown";

        logStore.add({
            kind: "query-failed",
            message: errorLogMsg,
            createdAt: now,
        });

        throw new QueryError(`${errorLogMsg}: ${errorMsg}`);
    }
}