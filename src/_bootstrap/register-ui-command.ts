import { Plugin } from "obsidian";
import { DevUtils } from "../__for_dev/dev-utils";
import { IoMap } from "../app/io/io.types";
import { OrbizResolver } from "../app/orbiz-resolver.types";
import { OrbizSpace } from "../app/orbiz-space.types";
import { StoreMap } from "../app/stores/store.types";
import { renderDRecordSearcherModal } from "../ui/modal/d-record-searcher-modal";
import { renderNoteCoreDataUpdaterModal } from "../ui/modal/note-core-data-updater-modal";
import { renderNoteCreatorModal } from "../ui/modal/note-creator-modal";
import { renderNoteMetadataUpdaterModal } from "../ui/modal/note-metadata-updater-modal";
import { renderNoteTrasherModal } from "../ui/modal/note-trasher";

export function registerUiCommand(
    plugin: Plugin,
    orbizSpace: OrbizSpace,
    orbizResolver: OrbizResolver,
    storeMap: StoreMap,
    ioMap: IoMap,
) {
    plugin.addCommand({
        id: "open-home",
        name: "Open home",
        callback: async () => {
            await orbizSpace.openSideView("VIEW_TYPE_Orbiz_Home", "left");
        }
    });

    plugin.addCommand({
        id: "open-side-view",
        name: "Open side view",
        callback: async () => {
            await orbizSpace.openSideView("VIEW_TYPE_Latest_Active_OrbizFile_Side", "right");
        }
    });

    plugin.addCommand({
        id: "open-issue-view",
        name: "Open issue view",
        callback: async () => {
            await orbizSpace.openMainView("VIEW_TYPE_Issue");
        }
    });
    plugin.addCommand({
        id: "open-log-view",
        name: "Open log view",
        callback: async () => {
            await orbizSpace.openMainView("VIEW_TYPE_Log");
        }
    });

    plugin.addCommand({
        id: "open-d-record-searcher",
        name: "Open d-record searcher",
        callback: () => {
            orbizSpace.modal.open(renderDRecordSearcherModal, {
                orbizSpace,
                orbizResolver,
                storeMap,
            })
        }
    });

    plugin.addCommand({
        id: "open-note-creator",
        name: "Open note-creator",
        callback: () => {
            orbizSpace.modal.open(renderNoteCreatorModal, {
                orbizSpace,
                orbizResolver,
                storeMap,
                ioMap,
            })
        }
    });

    plugin.addCommand({
        id: "open-note-metadata-updater",
        name: "Open note-metadata updater",
        callback: () => {
            orbizSpace.modal.open(renderNoteMetadataUpdaterModal, {
                orbizSpace,
                orbizResolver,
                storeMap,
                ioMap,
            })
        }
    });

    plugin.addCommand({
        id: "open-note-core-data-updater",
        name: "Open note-core-data updater",
        callback: () => {
            orbizSpace.modal.open(renderNoteCoreDataUpdaterModal, {
                orbizSpace,
                orbizResolver,
                storeMap,
                ioMap,
            })
        }
    });

    plugin.addCommand({
        id: "open-note-trasher",
        name: "Open note-trasher",
        callback: () => {
            orbizSpace.modal.open(renderNoteTrasherModal, {
                orbizSpace,
                orbizResolver,
                storeMap,
                ioMap,
            })
        }
    });

    DevUtils.registerDevUiCommand({ plugin, storeMap });
}

