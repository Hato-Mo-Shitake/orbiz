/* eslint-disable no-restricted-imports -- bootstrap内は許可 */

import { Modal, Plugin } from "obsidian";
import { UiUtilsFacades } from "../_shared/ui-utils-facades";
import { UtilsFacades } from "../_shared/utils-facades";
import { ClockImpl } from "../infra/internal/impls/clock";
import { IdGeneratorImpl } from "../infra/internal/impls/id-generator";
import { registerEvent } from "./register-event";
import { registerUi } from "./register-ui";
import { registerUiCommand } from "./register-ui-command";
import { resolveDependencies } from "./resolve-dependencies";

export async function initializeOrbiz(
    plugin: Plugin
) {
    try {
        UtilsFacades.initialize({
            clock: new ClockImpl(),
            idGenerator: new IdGeneratorImpl(),
        });
        UiUtilsFacades.setApp(plugin.app);

        const deps = await resolveDependencies(plugin);

        registerUi(
            plugin,
            deps.storeMap,
            deps.ioMap,
            deps.orbizResolver,
            deps.orbizSpace
        );

        registerEvent(
            deps.storeMap,
            deps.ioMap,
            plugin,
            deps.orbizResolver,
            deps.orbizSpace,
            deps.orbizFileCache
        );

        registerUiCommand(
            plugin,
            deps.orbizSpace,
            deps.orbizResolver,
            deps.storeMap,
            deps.ioMap
        );
    } catch (e) {
        let alertMsg = "unknown error";
        if (e instanceof Error) {
            alertMsg = e.message;
            console.error(e.stack);
        }

        const modal = new Modal(plugin.app);
        modal.setTitle("Error");
        modal.contentEl.setText(`Failed to initialize orbiz: ${alertMsg}`);
        modal.open();
    }
}

/* eslint-enable -- 終了*/