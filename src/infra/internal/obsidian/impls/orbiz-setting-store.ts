import { Plugin } from "obsidian";
import { orbizSettingDefault } from "../../../../_shared/const";
import { IssueError } from "../../../../_shared/error";
import { Listener, Unsubscribe } from "../../../../_shared/types";
import { OrbizSetting, OrbizSettingStore } from "../../../../app/stores/orbiz-setting-store.types";

export class ObsidianOrbizSettingStore implements OrbizSettingStore {
    private _setting: OrbizSetting | undefined;
    private readonly _listeners: Set<Listener> = new Set();

    $_ini = false;
    constructor(
        // private readonly _app: App
        private readonly _plugin: Plugin
    ) {
    }

    get(): OrbizSetting {
        if (!this.$_ini) throw new Error("Uninitialized ObsidianOrbizSettingStore");
        if (!this._setting) {
            throw new IssueError({
                title: "ObsidianOrbizSettingStore Error",
                layer: "app",
                location: "OrbizSettingStore.get()",
                message: "this._setting is undefined."
            });
        }

        return this._setting;
    }

    async initialize(): Promise<void> {
        await this._load();
        this.$_ini = true;
    }

    private async _load(): Promise<void> {
        const data = await this._plugin.loadData() as unknown;
        this._setting = Object.assign({}, orbizSettingDefault,
            data
        );
    }

    async saveSpaceName(spaceName: string): Promise<void> {
        const setting = this.get();

        await this._plugin.saveData({
            ...setting,
            spaceName,
        });

        await this._load();
        this._notify();
    }

    subscribe(listener: Listener): Unsubscribe {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }

    private _notify() {
        this._listeners.forEach(l => l());
    }
}