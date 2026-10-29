/* eslint-disable -- 開発用 */

import { Plugin } from "obsidian";
import { $_isDev } from "../_shared/const";
import { StoreMap } from "../app/stores/store.types";

export class DevUtils {
    static consoleLog(...data: any[]) {
        if (!$_isDev) return;
        console.log(data);
    }

    static registerDevUiCommand({
        plugin,
        storeMap
    }: { plugin: Plugin, storeMap: StoreMap }): void {
        if (!$_isDev) return;

        plugin.addCommand({
            id: "check-note-registry",
            name: "Check note-registry",
            callback: () => {
                console.log("note-registry:")
                console.log((storeMap.noteIndexStore as any)._registry);
            }
        });
    }
}