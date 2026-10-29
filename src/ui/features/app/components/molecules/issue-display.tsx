import { Issue } from "../../../../../app/stores/issue-store.types"

type Props = {
    issue: Issue
}

export function IssueDisplay({ issue }: Props) {
    return <div>
        <div> title: {issue.title}</div>
        <div>kind: {issue.kind}, severity: {issue.severity}</div>
        <div>layer: {issue.layer}, location: {issue.location}</div>
        <div>message: {issue.message}</div>
        <div>isCommitIssue: {issue.isCommitIssue ? "true" : "false"}</div>
        <div>occur: {issue.createdAt.toString("yyyy-MM-dd'T'HH:mm:ss")}</div>
        {issue?.stackTrace &&
            < details >
                <summary>stack</summary>
                <div>{issue.stackTrace}</div>
            </details>
        }
    </div>
}