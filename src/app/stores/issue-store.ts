import { $_isDev } from "../../_shared/const";
import { DateTime } from "../../_shared/date-time.vo";
import { IssueError } from "../../_shared/error";
import { Listener, Unsubscribe } from "../../_shared/types";
import { UtilsFacades } from "../../_shared/utils-facades";
import { Issue, IssueOccurredLayer, IssueSeverity, IssueStorageKind, IssueStoreReader } from "./issue-store.types";

export class IssueStore implements IssueStoreReader {
    private _issues: Issue[] = [];
    private _listeners: Set<Listener> = new Set();
    private _capacity: number;

    constructor(options?: {
        capacity?: number
    }) {
        this._capacity = options?.capacity ?? 50;
    }

    get(): readonly Issue[] {
        return this._issues;
    }

    private _add(issue: Issue): void {
        if (this._issues.length >= this._capacity) {
            this._issues.shift();
        }
        this._issues = [
            ...this._issues,
            issue,
        ]
        this._notify();

        if ($_isDev) {
            console.error(issue);
        }
    }

    add(params: {
        id?: string,
        severity?: IssueSeverity,
        title: string,
        message: string,
        layer: IssueOccurredLayer,
        location: string,
        kind?: IssueStorageKind,
        createdAt?: DateTime,
        isCommitIssue?: boolean,
        stackTrace?: string;
    }) {
        const issue: Issue = {
            id: params?.id || UtilsFacades.idGenerator.generate(),
            kind: params.kind || "transient",
            isCommitIssue: params.isCommitIssue || false,
            layer: params.layer,
            location: params.location,
            severity: params.severity || "error",
            title: params.title,
            message: params.message,
            createdAt: UtilsFacades.clock.nowDateTime(),
            stackTrace: params.stackTrace,
        }
        this._add(issue);
    }

    addAnyError(e: unknown, isCommitIssue = false): void {
        if (e instanceof IssueError) {
            this.addIssueError(e, isCommitIssue);
        } else {
            this.addUnknownError(e, isCommitIssue);
        }
    }

    addUnknownError(e: unknown, isCommitIssue = false): void {
        let title: string;
        let message: string;
        let stackTrace: string | undefined;
        if (e instanceof Error) {
            title = `Unknown Error: ${e.name}`;
            message = e.message;
            stackTrace = e.stack;
        } else {
            title = "Unknown Error";
            message = "unknown error";
            stackTrace = undefined;
        }

        const issue: Issue = {
            id: UtilsFacades.idGenerator.generate(),
            kind: "transient",
            isCommitIssue,
            layer: "other",
            location: "unknown",
            severity: "fatal",
            title,
            message,
            createdAt: UtilsFacades.clock.nowDateTime(),
            stackTrace,
        }
        this._add(issue);
    }

    addIssueError(e: IssueError, isCommitIssue = false): void {
        const issue: Issue = {
            id: UtilsFacades.idGenerator.generate(),
            kind: "transient",
            isCommitIssue,
            layer: e.layer,
            location: e.location,
            severity: e.severity,
            title: e.title,
            message: e.message,
            createdAt: UtilsFacades.clock.nowDateTime(),
            stackTrace: e.stack,
        }
        this._add(issue);
    }

    remove(id: string): void {
        const next = this._issues.filter(item => item.id !== id);
        if (next.length !== this._issues.length) {
            this._issues = next;
            this._notify();
        }
    }

    subscribe(listener: Listener): Unsubscribe {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }
    private _notify() {
        this._listeners.forEach(l => l());
    }
}