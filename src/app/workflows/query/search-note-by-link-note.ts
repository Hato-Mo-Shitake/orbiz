import { AnyNoteDS, NoteCollection, NoteId, NoteIdList, NoteName, NoteNameList } from "../../../domain/note"
import { OrbizResolver } from "../../orbiz-resolver.types"
import { IssueStore } from "../../stores/issue-store"
import { LogStore } from "../../stores/log-store"
import { NoteIndexStoreReader } from "../../stores/note-index-store.types"
import { handleQuery } from "../sub/query/handle-query"
import { SearchNoteByLinkNoteRequest } from "./search-note.types"

type Deps = {
    orbizResolver: OrbizResolver,
    noteIndexStore: NoteIndexStoreReader,
    issueStore: IssueStore,
    logStore: LogStore,
}

export function searchNoteByLinkNote(
    request: SearchNoteByLinkNoteRequest<"note">,
    deps: Deps,
): NoteCollection
export function searchNoteByLinkNote(
    request: SearchNoteByLinkNoteRequest<"name">,
    deps: Deps
): NoteNameList
export function searchNoteByLinkNote(
    request: SearchNoteByLinkNoteRequest<"id">,
    deps: Deps,
): NoteIdList
export function searchNoteByLinkNote(
    request: SearchNoteByLinkNoteRequest,
    deps: Deps,
): NoteCollection | NoteIdList | NoteNameList {
    const { orbizResolver, noteIndexStore, issueStore, logStore } = deps;

    const callback = () => {
        const { noteIds, inKeys, direction, type = "union", dataType = "note" } = request;

        const getNeighbors = (id: NoteId): NoteIdList | undefined => {
            if (direction === "outlink") {


                // const note = orbizResolver.findNote(id);
                // if (!note) return undefined; // outlink方向は、ArchiveNote等を考慮してエラーは投げない。


                const note = orbizResolver.getNote(id);


                return AnyNoteDS.extractNoteSemanticOutlinks(note, inKeys);
            } else {
                const source = noteIndexStore.getSource(id);
                let result = NoteIdList.empty();
                for (const key of inKeys) {
                    result = result.add(source.inlinkNoteIds[key]);
                }
                return result;
            }
        }

        let resultIds = NoteIdList.empty();
        let isFirstTag = true;
        for (const id of noteIds instanceof NoteIdList ? noteIds : [noteIds]) {
            const targetIds = getNeighbors(id);

            if (type === "union") {
                if (targetIds) {
                    resultIds = resultIds.add(targetIds);
                }
                continue;
            }

            if (!targetIds || targetIds.isEmpty()) {
                resultIds = NoteIdList.empty();
                isFirstTag = false;
                break;
            }

            if (isFirstTag) {
                resultIds = targetIds;
                isFirstTag = false;
                continue;
            }

            resultIds = resultIds.intersect(targetIds);
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
        errorLogMsg: "Failed to search note by link note."
    });
}