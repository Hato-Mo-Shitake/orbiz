import { IssueError } from "../../../_shared/error";
import { AsyncCommit, Commit } from "../../../_shared/types";
import { UtilsFacades } from "../../../_shared/utils-facades";
import { AllAnyNoteMetadata, AnyNote, AnyNoteDS, AnyNoteEntry, NotePath } from "../../../domain/note";
import { DRecordIo } from "../../io/d-record-io.types";
import { NoteIo } from "../../io/note-io.types";
import { EntryModifiedDRecordHistoryStore } from "../../stores/entry-modified-d-record-history-store";
import { IssueStore } from "../../stores/issue-store";
import { LogStore } from "../../stores/log-store";
import { NoteIndexStore } from "../../stores/note-index-store";
import { OrbizSettingStoreReader } from "../../stores/orbiz-setting-store.types";
import { handleCommand } from "../sub/command/handle-command";

import { upsertNote } from "../sub/command/upsert-note";
import { UpdateAnyNoteMetadataRequest } from "./update-note.types";

type Deps = {
    noteIo: NoteIo,
    // openedNoteStore: OpenedNoteStore,
    // openedDRecordStore: OpenedDRecordStore,
    entryModifiedDRecordHistoryStore: EntryModifiedDRecordHistoryStore,
    dRecordIo: DRecordIo,
    noteIndexStore: NoteIndexStore,
    issueStore: IssueStore,
    logStore: LogStore,
    orbizSettingStore: OrbizSettingStoreReader,
}

export async function updateNoteMetadata(
    request: UpdateAnyNoteMetadataRequest,
    deps: Deps,
): Promise<AnyNote> {
    const { noteIndexStore, noteIo, issueStore, logStore } = deps;

    const callback = async () => {
        const commitStack: (Commit | AsyncCommit)[] = [];

        // 登録時の循環参照を検知するのは一旦置きで。SearchNoteの際に検知はする。

        // note作成
        const newNoteEntry = await createNewAnyNoteEntry(
            request,
            noteIndexStore,
            noteIo
        );
        const note = AnyNoteDS.constructNote(newNoteEntry);
        const { commit } = await upsertNote(note, deps);

        // 本来こういう処理は、Commandが知るべきではなく、
        // ストア側がCommandの実行を感知して実行するべきな気がするけど、コミットの順番とか状態の一貫性を保つという理由で一旦この運用
        // Commandをクラスにして、beforeHandlers, afterHandlers みたいなフィールドを持つようにすれば。
        // 外部からそこにコミットコールバックを登録して、現状と同じ処理を保ったまま、イベント駆動っぽいことができるし
        // 依存関係を綺麗にできる。Commandはストアの存在を知らなくて済む。
        // openedNoteStore.updateNote(note.path.value, note);

        commitStack.push(commit);
        return {
            value: note,
            commitStack,
        }
    }

    return handleCommand({
        callback,
        issueStore,
        logStore,
        startLogMsg: `update note-metadata, id: ${request.id.value}`,
        successLogMsg: `note-metadata updated, id: ${request.id.value}`,
        errorLogMsg: `failed to update note metadata, id: ${request.id.value}`,
    });
}

async function createNewAnyNoteEntry(
    request: UpdateAnyNoteMetadataRequest,
    noteIndexStore: NoteIndexStore,
    noteIo: NoteIo
): Promise<AnyNoteEntry> {
    const path = noteIndexStore.getSource(request.id).path;
    const currentNote = await noteIo.get(NotePath.from(path));
    if (!currentNote) {
        throw new IssueError({
            severity: "fatal",
            title: "Not found note",
            location: "update-note-metadata.ts",
            layer: "app",
            message: `Not found not, path: ${path}`
        });
    }
    if (request.originalEntryVersion !== currentNote.entryVersion) {
        throw new IssueError({
            severity: "fatal",
            title: "Invalid note entry-version",
            location: "update-note-metadata.ts",
            layer: "app",
            message: `Not equals note entry-version, ${request.originalEntryVersion} !== ${currentNote.entryVersion}`
        });
    }

    // この処理微妙かも、ちゃんとkind分岐して、型通りに組み立てた方がいい。
    const requestMetadata = request.metadata;
    const newMetadata: Record<string, unknown> = {};

    for (const key of (Object.keys(requestMetadata) as unknown as (keyof AllAnyNoteMetadata)[])) {
        if (requestMetadata[key] !== undefined) {
            newMetadata[key] = requestMetadata[key];
        }
    }

    const now = UtilsFacades.clock.nowDateTime();

    return {
        ...currentNote.getEntry(),
        ...newMetadata,
        entryModifiedAt: now,
        entryVersion: currentNote.entryVersion + 1,
    }
}