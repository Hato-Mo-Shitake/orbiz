
import { IssueError } from "./error";
import { Clock, IdGenerator } from "./utils-facades.types";


type Contracts = {
    readonly clock: Clock,
    readonly idGenerator: IdGenerator
}

export class UtilsFacades {
    private static _contracts: Contracts | undefined = undefined;

    static initialize(contracts: Contracts) {
        this._contracts = contracts;
    }

    private static _get<K extends keyof Contracts>(key: K): Contracts[K] {
        if (!this._contracts) {
            throw new IssueError({
                title: "Not Initialized UtilsFacades",
                layer: "shared",
                location: "UtilsFacades._get()",
                message: "Not Initialized UtilsFacades."
            });
        }
        return this._contracts[key];
    }

    static get clock(): Clock {
        return this._get("clock");
    }
    static get idGenerator(): IdGenerator {
        return this._get("idGenerator");
    }
}