import { DateTime } from "../../_shared/date-time.vo";
import { Listener, Unsubscribe } from "../../_shared/types";

export type IssueSeverity = 'warning' | 'error' | 'fatal';

export type IssueStorageKind = 'transient' | 'persistent';
export type IssueOccurredLayer =
    | 'app' | 'infra' | 'domain' | 'ui'
    | "bootstrap" | "shared"
    | 'other';

export interface Issue {
    id: string;
    kind: IssueStorageKind;
    layer: IssueOccurredLayer;
    location: string;
    severity: IssueSeverity;
    title: string;
    message: string;
    createdAt: DateTime;
    isCommitIssue?: boolean,
    stackTrace?: string;
}

export interface IssueStoreReader {
    get(): readonly Issue[];
    subscribe(listener: Listener): Unsubscribe
}