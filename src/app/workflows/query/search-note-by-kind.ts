import { NoteCollection, NoteId, NoteIdList, NoteNameList } from "../../../domain/note";
import { OrbizResolver } from "../../orbiz-resolver.types";
import { IssueStore } from "../../stores/issue-store";
import { LogStore } from "../../stores/log-store";
import { NoteIndexStoreReader } from "../../stores/note-index-store.types";
import { handleQuery } from "../sub/query/handle-query";
import { SearchNoteByKindRequest } from "./search-note.types";

type Deps = {
    orbizResolver: OrbizResolver,
    noteIndexStore: NoteIndexStoreReader,
    issueStore: IssueStore,
    logStore: LogStore
}

export function searchNoteByKind(
    request: SearchNoteByKindRequest<"note">,
    deps: Deps,
): NoteCollection
export function searchNoteByKind(
    request: SearchNoteByKindRequest<"id">,
    deps: Deps,
): NoteIdList
export function searchNoteByKind(
    request: SearchNoteByKindRequest<"name">,
    deps: Deps,
): NoteNameList
export function searchNoteByKind(
    request: SearchNoteByKindRequest,
    deps: Deps,
): NoteCollection | NoteIdList | NoteNameList {
    const { orbizResolver, noteIndexStore, issueStore, logStore } = deps;

    const callback = () => {
        const { inKinds, dataType = "note" } = request;

        let nameList = NoteNameList.empty();
        for (const kind of inKinds) {
            nameList = nameList.add(
                noteIndexStore.getNameListByKind(kind)
            );
        }
        if (dataType === "name") {
            return nameList;
        }

        const ids: string[] = [];
        for (const name of nameList) {
            const id = noteIndexStore.getIdByName(name);
            ids.push(id)
        }
        if (dataType === "id") {
            return NoteIdList.fromStringArray(ids);
        }

        return NoteCollection.from(
            ids.map(id => orbizResolver.getNote(NoteId.from(id)))
        );
    }

    return handleQuery({
        callback,
        issueStore,
        logStore,
        errorLogMsg: `Failed to search note by kind.`
    })
}