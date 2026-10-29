import { TreeNode } from "../../../_shared/types";
import { buildReachableNodeList, buildTree } from "../../../_shared/utils";
import { AnyNote, AnyNoteDS, NoteCollection, NoteId, NoteIdList, NoteName, NoteNameList, NoteTreeCollection } from "../../../domain/note";
import { OrbizResolver } from "../../orbiz-resolver.types";
import { IssueStore } from "../../stores/issue-store";
import { LogStore } from "../../stores/log-store";
import { NoteIndexStoreReader } from "../../stores/note-index-store.types";
import { handleQuery } from "../sub/query/handle-query";
import { SearchNoteByRootNoteRequest } from "./search-note.types";

type Deps = {
    orbizResolver: OrbizResolver,
    noteIndexStore: NoteIndexStoreReader,
    issueStore: IssueStore,
    logStore: LogStore,
}

export function searchNoteByRootNote(
    request: SearchNoteByRootNoteRequest<"note-tree">,
    deps: Deps,
): NoteTreeCollection | undefined;
export function searchNoteByRootNote(
    request: SearchNoteByRootNoteRequest<"id-flat">,
    deps: Deps,
): NoteIdList | undefined;
export function searchNoteByRootNote(
    request: SearchNoteByRootNoteRequest<"id-tree">,
    deps: Deps,
): TreeNode<NoteId> | undefined;
export function searchNoteByRootNote(
    request: SearchNoteByRootNoteRequest<"name-flat">,
    deps: Deps,
): TreeNode<NoteName> | undefined;
export function searchNoteByRootNote(
    request: SearchNoteByRootNoteRequest<"name-flat">,
    deps: Deps,
): NoteNameList | undefined;
export function searchNoteByRootNote(
    request: SearchNoteByRootNoteRequest<"note-flat">,
    deps: Deps,
): NoteCollection | undefined;
// export function searchNoteByRootNote(
//     request: SearchNoteByRootNoteRequest,
//     deps: Deps,
// ): NoteCollection | NoteIdList | NoteNameList
export function searchNoteByRootNote(
    request: SearchNoteByRootNoteRequest,
    deps: Deps,
): NoteCollection | NoteIdList | NoteNameList
    | NoteTreeCollection | TreeNode<NoteId> | TreeNode<NoteName> | undefined {
    const { orbizResolver, noteIndexStore, issueStore, logStore } = deps;

    const callback = () => {
        const {
            rootNoteId,
            key,
            dataType = "note-tree",
            depth = "infinity",
            direction = "inlink"
        } = request;

        const getNeighbors = (id: NoteId): NoteId[] | undefined => {
            if (direction === "outlink") {



                // const note = orbizResolver.findNote(id);
                // if (!note) return undefined; // outlink方向は、ArchiveNote等を考慮してエラーは投げない。

                const note = orbizResolver.getNote(id);

                return AnyNoteDS.extractNoteSemanticOutlinks(note, [key])?.toArray() || [];
            } else if (direction === "inlink") {
                const source = noteIndexStore.getSource(id);
                return source.inlinkNoteIds[key].toArray();
            } else {
                throw new Error("Unexpected process");
            }
        }

        const buildNoteTree = <T>(fromId: (id: NoteId) => T | undefined): TreeNode<T> | undefined => {
            return buildTree(
                rootNoteId,
                fromId,
                getNeighbors,
                (id) => id.toString(),
                depth
            );
        }
        const buildReachableNoteList = <T>(fromId: (id: NoteId) => T | undefined): T[] | undefined => {
            return buildReachableNodeList(
                rootNoteId,
                fromId,
                getNeighbors,
                (id) => id.toString(),
                depth
            );
        }

        switch (dataType) {
            case "note-flat": {
                const notes = buildReachableNoteList<AnyNote>((id) => orbizResolver.getNote(id));
                return notes ? NoteCollection.from(notes) : undefined;
            }
            case "note-tree": {
                // orbizResolver.findNoteをそのままコールバック関数としても。thisの対象が違うとかで、狙い通りの挙動にならないんだこれ。
                // const noteTree = buildNoteTree<AnyNote>(orbizResolver.findNote);
                const noteTree = buildNoteTree<AnyNote>((id) => orbizResolver.getNote(id));
                return noteTree ? NoteTreeCollection.from(noteTree) : undefined;
            }
            case "id-flat": {
                const ids = buildReachableNoteList(id => id);
                return ids ? NoteIdList.fromNoteIdArray(ids) : undefined;
            }
            case "id-tree": {
                return buildNoteTree(id => id);
            }
            case "name-flat": {
                const names = buildReachableNoteList((id) => noteIndexStore.getName(id));
                return names ? NoteNameList.from(names) : undefined;
            }
            case "name-tree": {
                return buildNoteTree((id: NoteId) => {
                    const name = noteIndexStore.getName(id);
                    if (name === undefined) return undefined;
                    return NoteName.tryFrom(name)
                });
            }
        }
    }

    // これを実行した時に、まだObsidianのキャッシュが整っていない可能性があるから、
    // 非同期にしてリトライできるようにしたい。
    // というかそれを踏まえると、pathが変化せず、fmだけ変わるような時は、更新前のキャッシュデータを元にした
    // データを持ってくる可能性があるな。。。。
    return handleQuery({
        callback,
        issueStore,
        logStore,
        errorLogMsg: "Failed to search note by root note."
    })
}