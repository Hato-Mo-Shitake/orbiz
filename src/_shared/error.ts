import { IssueOccurredLayer, IssueSeverity } from "../app/stores/issue-store.types";

export class IssueError extends Error {
    title: string;
    layer: IssueOccurredLayer;
    location: string;
    severity: IssueSeverity;
    isPersistent: boolean;

    constructor(params: {
        title: string;
        layer: IssueOccurredLayer;
        location: string;
        message: string;
        severity?: Exclude<IssueSeverity, "warning">;
        isPersistent?: boolean;
    }) {
        super(params.message);
        this.name = "IssueError";
        this.title = params.title;
        this.layer = params.layer;
        this.location = params.location;
        this.severity = params.severity ?? "error";
        this.isPersistent = params.isPersistent ?? false;
    }
}

export class CommandError extends Error {
    // readonly request: string;
    constructor(
        message: string,
        // request: string,
    ) {
        super(message);
        this.name = "CommandError";
        // this.request = params.request;
    }
}

export class QueryError extends Error {
    // readonly request: string;
    constructor(
        message: string,
        // request: string,
    ) {
        super(message);
        this.name = "QueryError";
        // this.request = params.request;
    }
}