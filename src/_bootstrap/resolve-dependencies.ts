/* eslint-disable no-restricted-imports -- bootstrap内は許可 */

import { Plugin } from "obsidian";
import { UtilsFacades } from "../_shared/utils-facades";
import { IoMap } from "../app/io/io.types";
import { IssueStore } from "../app/stores/issue-store";
import { LogStore } from "../app/stores/log-store";
import { NoteIndexStore } from "../app/stores/note-index-store";
import { TodayStore } from "../app/stores/today-store";
import { ObsidianDRecordIo } from "../infra/internal/obsidian/impls/d-record-io";

import { ObsidianNoteIo } from "../infra/internal/obsidian/impls/note-io";
import { ObsidianOrbizFileIo } from "../infra/internal/obsidian/impls/orbiz-file-io";
import { ObsidianOrbizSettingStore } from "../infra/internal/obsidian/impls/orbiz-setting-store";

import { OrbizResolver } from "../app/orbiz-resolver.types";
import { OrbizSpace } from "../app/orbiz-space.types";
import { EntryModifiedDRecordHistoryStore } from "../app/stores/entry-modified-d-record-history-store";
import { LatestActiveOrbizFileStore } from "../app/stores/latest-active-orbiz-file";
import { ModifiedNoteHistoryStore } from "../app/stores/modified-note-history-store";
import { NoteUnsemanticOutlinksStore } from "../app/stores/note-unsemantic-outlinks-store";
import { OpenedFileStore } from "../app/stores/opened-file-store";
import { RenamedFileHistoryStore, RenamedFileValidationStore } from "../app/stores/renamed-file-store";
import { StoreMap } from "../app/stores/store.types";
import { ObsidianModalService } from "../infra/internal/obsidian/impls/modal-service";
import { ObsidianOrbizResolver } from "../infra/internal/obsidian/impls/orbiz-resolver";
import { ObsidianOrbizSpace } from "../infra/internal/obsidian/impls/orbiz-space";
import { ObsidianOrbizFileCache } from "../infra/internal/obsidian/orbiz-file-cache";
import { initializeNoteIndex } from "./initialize-note-index";

type OrbizResolvedDeps = {
    orbizFileCache: ObsidianOrbizFileCache,
    orbizSpace: OrbizSpace,
    orbizResolver: OrbizResolver,
    storeMap: StoreMap,
    ioMap: IoMap,
}
export async function resolveDependencies(
    plugin: Plugin
): Promise<OrbizResolvedDeps> {
    const now = UtilsFacades.clock.nowDateTime();

    const orbizFileCache = new ObsidianOrbizFileCache();

    /**
     * orbiz-space
     */
    const modalService = new ObsidianModalService(plugin.app);
    const orbizSpace = new ObsidianOrbizSpace(
        plugin.app,
        modalService
    );

    /**
     * stores
     */
    const orbizSettingStore = new ObsidianOrbizSettingStore(
        plugin
    );
    await orbizSettingStore.initialize();

    const issueStore = new IssueStore();
    const logStore = new LogStore();

    const latestActiveOrbizFileStore = new LatestActiveOrbizFileStore();

    const noteIndexStore = new NoteIndexStore(
        await initializeNoteIndex(
            plugin.app,
            orbizSettingStore.get().spaceName,
            issueStore,
        )
    );

    const modifiedNoteHistoryStore = new ModifiedNoteHistoryStore();
    const entryModifiedDRecordHistoryStore = new EntryModifiedDRecordHistoryStore();

    const todayStore = new TodayStore(
        now.toPlainDate()
    );

    const renamedFileHistoryStore = new RenamedFileHistoryStore();
    const renamedFileValidationStore = new RenamedFileValidationStore();

    const openedFileStore = new OpenedFileStore();

    const noteUnsemanticOutlinksStore = new NoteUnsemanticOutlinksStore(
        noteIndexStore
    );

    const storeMap: StoreMap = {
        orbizSettingStore,

        noteIndexStore,
        noteUnsemanticOutlinksStore,

        todayStore,

        modifiedNoteHistoryStore,
        entryModifiedDRecordHistoryStore,

        renamedFileHistoryStore,
        renamedFileValidationStore,

        latestActiveOrbizFileStore,

        openedFileStore,

        issueStore,
        logStore,
    }

    /**
     * orbiz-resolver
     */
    const orbizResolver = new ObsidianOrbizResolver(
        plugin.app,
        storeMap.noteIndexStore,
        storeMap.orbizSettingStore,
        orbizFileCache
    );

    /**
     * io
     */
    const noteIo = new ObsidianNoteIo(plugin.app, orbizFileCache);
    const dRecordIo = new ObsidianDRecordIo(plugin.app, orbizFileCache);
    const orbizFileIo = new ObsidianOrbizFileIo(plugin.app, noteIndexStore, orbizFileCache);
    const ioMap = {
        noteIo,
        dRecordIo,
        orbizFileIo
    }

    return {
        orbizFileCache,
        orbizSpace,
        orbizResolver,
        storeMap,
        ioMap
    }
}

/* eslint-enable -- 終了 */