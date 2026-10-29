import { CommandError } from "../../../../_shared/error";
import { AsyncCommit, Commit } from "../../../../_shared/types";
import { UtilsFacades } from "../../../../_shared/utils-facades";
import { IssueStore } from "../../../stores/issue-store";
import { LogStore } from "../../../stores/log-store";

export async function handleCommand<T>({
    callback, issueStore, logStore, startLogMsg, successLogMsg, errorLogMsg
}: {
    callback: () => Promise<{
        value: T,
        commitStack: (Commit | AsyncCommit)[]
    }>,
    issueStore: IssueStore,
    logStore: LogStore,
    startLogMsg: string,
    successLogMsg: string,
    errorLogMsg: string,
}): Promise<T> {
    const now = UtilsFacades.clock.nowDateTime();
    logStore.add({
        kind: "command-started",
        message: startLogMsg,
        createdAt: now
    });
    let isCommitIssue = false;
    try {
        const result = await callback();

        try {
            for (const c of result.commitStack) {
                await c();
            }
        } catch (e) {
            isCommitIssue = true;
            throw e;
        }

        logStore.add({
            kind: "command-success",
            message: successLogMsg,
            createdAt: now
        });

        return result.value;
    } catch (e) {
        issueStore.addAnyError(e, isCommitIssue);
        const errorMsg = e instanceof Error ? e.message : "unknown";
        logStore.add({
            kind: "command-failed",
            message: errorLogMsg,
            createdAt: now,
        });

        // これ、IssueErrowを継承すべきだ。layerの情報とか消える。
        // 違う。UI側でissueStoreに追加してるのが問題なんだ。
        throw new CommandError(
            `${errorLogMsg}
            -> ${errorMsg}`
        );
    }
}