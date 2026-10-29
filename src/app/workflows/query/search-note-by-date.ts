import { extractBaseNameFromPath } from "../../../_shared/utils";
import { AnyNote, NoteCollection, NoteIdList, NoteNameList } from "../../../domain/note";
import { dRecordNoteIdsKeys } from "../../../domain/note-sub/d-record";
import { OrbizResolver } from "../../orbiz-resolver.types";
import { IssueStore } from "../../stores/issue-store";
import { LogStore } from "../../stores/log-store";
import { NoteIndexStoreReader } from "../../stores/note-index-store.types";
import { handleQuery } from "../sub/query/handle-query";
import { SearchNoteByDateRequest } from "./search-note.types";

type Deps = {
    orbizResolver: OrbizResolver,
    noteIndexStore: NoteIndexStoreReader,
    issueStore: IssueStore,
    logStore: LogStore,
};

// noteを一番上に置く。オーバーロードは上から判定する関係上、dataTypeが指定されないとき、ここに合致させるため。
export function searchNoteByDate(
    request: SearchNoteByDateRequest<"note">,
    deps: Deps,
): NoteCollection
export function searchNoteByDate(
    request: SearchNoteByDateRequest<"id">,
    deps: Deps,
): NoteIdList
export function searchNoteByDate(
    request: SearchNoteByDateRequest<"name">,
    deps: Deps,
): NoteNameList
export function searchNoteByDate(
    request: SearchNoteByDateRequest,
    deps: Deps,
): NoteCollection | NoteNameList | NoteIdList {
    const { orbizResolver, noteIndexStore, issueStore, logStore } = deps;

    const callback = () => {
        const { dates, inKeys, dataType = "note" } = request;
        let resultNoteIdList = NoteIdList.empty();
        for (const d of dates) {
            const dRecord = orbizResolver.findDRecord(d);
            if (!dRecord) continue;

            for (const key of inKeys || dRecordNoteIdsKeys) {
                const noteIds = dRecord.noteIdsMap[key];
                if (!noteIds) continue;
                resultNoteIdList = resultNoteIdList.add(noteIds);
            }
        }

        if (dataType === "id") {
            return resultNoteIdList
        }
        if (dataType === "name") {
            const names: string[] = [];
            for (const id of resultNoteIdList) {
                const source = noteIndexStore.getSource(id);
                const name = extractBaseNameFromPath(source.path);
                names.push(name);
            }
            return NoteNameList.from(names);
        }

        const notes: AnyNote[] = [];
        for (const id of resultNoteIdList) {



            // const note = orbizResolver.findNote(id);
            // if (!note) continue; // archive考慮
            const note = orbizResolver.getNote(id);



            notes.push(note);
        }
        return NoteCollection.from(notes);
    }

    return handleQuery({
        callback,
        issueStore,
        logStore,
        errorLogMsg: "Failed to search note by date",
    });
}
