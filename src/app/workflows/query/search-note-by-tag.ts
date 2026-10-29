import { NoteCollection, NoteId, NoteIdList, NoteName, NoteNameList } from "../../../domain/note";
import { OrbizResolver } from "../../orbiz-resolver.types";
import { IssueStore } from "../../stores/issue-store";
import { LogStore } from "../../stores/log-store";
import { NoteIndexStoreReader } from "../../stores/note-index-store.types";
import { handleQuery } from "../sub/query/handle-query";
import { SearchNoteByTagRequest } from "./search-note.types";

type Deps = {
    orbizResolver: OrbizResolver,
    noteIndexStore: NoteIndexStoreReader;
    issueStore: IssueStore,
    logStore: LogStore,
};

export function searchNoteByTag(request: SearchNoteByTagRequest<"note">, deps: Deps): NoteCollection;
export function searchNoteByTag(request: SearchNoteByTagRequest<"id">, deps: Deps): NoteIdList;
export function searchNoteByTag(request: SearchNoteByTagRequest<"name">, deps: Deps): NoteNameList;
export function searchNoteByTag(
    request: SearchNoteByTagRequest,
    deps: Deps,
): NoteCollection | NoteIdList | NoteNameList {
    const { orbizResolver, noteIndexStore, issueStore, logStore } = deps;

    const callback = () => {
        const { tags, type = "union", dataType = "note" } = request;

        let resultIds = NoteIdList.empty();
        let isFirstTag = true;

        for (const tag of tags) {
            const ids = noteIndexStore.findIdsByTag(tag);

            if (type === "union") {
                if (ids) {
                    resultIds = resultIds.add(ids);
                }
                continue;
            }

            if (!ids || ids.isEmpty()) {
                resultIds = NoteIdList.empty();
                isFirstTag = false;
                break;
            }

            if (isFirstTag) {
                resultIds = ids;
                isFirstTag = false;
                continue;
            }

            resultIds = resultIds.intersect(ids);
        }

        switch (dataType) {
            case "id":
                return resultIds;
            case "name": {
                let namesResult = NoteNameList.empty();
                for (const id of resultIds) {
                    namesResult = namesResult.add(
                        NoteName.from(noteIndexStore.getName(id)),
                    );
                }
                return namesResult;
            }
            case "note":
                return NoteCollection.from(
                    resultIds.value.map(id => orbizResolver.getNote(NoteId.from(id))),
                );
        }
    }

    return handleQuery({
        callback,
        issueStore,
        logStore,
        errorLogMsg: "Failed to search note by tag."
    });
}