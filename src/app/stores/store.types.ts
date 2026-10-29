import { EntryModifiedDRecordHistoryStore } from "./entry-modified-d-record-history-store";
import { IssueStore } from "./issue-store";
import { LatestActiveOrbizFileStore } from "./latest-active-orbiz-file";
import { LogStore } from "./log-store";
import { ModifiedNoteHistoryStore } from "./modified-note-history-store";
import { NoteIndexStore } from "./note-index-store";
import { NoteUnsemanticOutlinksStore } from "./note-unsemantic-outlinks-store";
import { OpenedFileStore } from "./opened-file-store";
import { OrbizSettingStore } from "./orbiz-setting-store.types";
import { RenamedFileHistoryStore, RenamedFileValidationStore } from "./renamed-file-store";
import { TodayStore } from "./today-store";

export type StoreMap = {
    orbizSettingStore: OrbizSettingStore,

    noteIndexStore: NoteIndexStore,
    noteUnsemanticOutlinksStore: NoteUnsemanticOutlinksStore,

    todayStore: TodayStore,

    modifiedNoteHistoryStore: ModifiedNoteHistoryStore,
    entryModifiedDRecordHistoryStore: EntryModifiedDRecordHistoryStore,

    renamedFileHistoryStore: RenamedFileHistoryStore,
    renamedFileValidationStore: RenamedFileValidationStore,

    latestActiveOrbizFileStore: LatestActiveOrbizFileStore,

    openedFileStore: OpenedFileStore,
    // openedNoteStore: OpenedNoteStore,
    // openedDRecordStore: OpenedDRecordStore,

    issueStore: IssueStore,
    logStore: LogStore,
}