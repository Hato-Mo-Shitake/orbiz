import { useCallback } from "react";
import { UiUtilsFacades } from "../../../_shared/ui-utils-facades";
import { QueryMap } from "../../../app/workflows/query/query.types";
import { SearchNoteByDateRequest, SearchNoteByKindRequest, SearchNoteByLinkNoteRequest, SearchNoteByRootNoteRequest, SearchNoteByTagRequest } from "../../../app/workflows/query/search-note.types";
import { useOrbizResolver, useStore } from "../../context/use-context";

export function useSearchNoteCollectionByTag() {
    const orbizResolver = useOrbizResolver();
    const store = useStore();
    return useCallback(
        (request: Omit<SearchNoteByTagRequest<"note">, "dataType">) => {
            try {
                return QueryMap.searchNoteByTag({
                    ...request,
                    dataType: "note"
                }, { orbizResolver, ...store });
            } catch (e) {
                UiUtilsFacades.notice(e instanceof Error ? e.message : "unknown query error");
                return undefined;
            }
        },
        [orbizResolver, store]
    )
}



export function useSearchNoteCollectionByKind() {
    const orbizResolver = useOrbizResolver();
    const store = useStore();
    return useCallback(
        (request: Omit<SearchNoteByKindRequest<"note">, "dataType">) => {
            try {
                return QueryMap.searchNoteByKind({
                    ...request,
                    dataType: "note"
                }, { orbizResolver, ...store });
            } catch (e) {
                UiUtilsFacades.notice(e instanceof Error ? e.message : "unknown query error");
                return undefined;
            }
        },
        [orbizResolver, store]
    )
}

export function useSearchNoteCollectionByDate() {
    const orbizResolver = useOrbizResolver();
    const store = useStore();
    return useCallback(
        (request: Omit<SearchNoteByDateRequest<"note">, "dataType">) => {
            try {
                return QueryMap.searchNoteByDate({
                    ...request,
                    dataType: "note"
                }, { orbizResolver, ...store });
            } catch (e) {
                UiUtilsFacades.notice(e instanceof Error ? e.message : "unknown query error");
                return undefined;
            }
        },
        [orbizResolver, store]
    )
}

export function useSearchNoteCollectionByLinkNote() {
    const orbizResolver = useOrbizResolver();
    const store = useStore();
    return useCallback(
        (request: Omit<SearchNoteByLinkNoteRequest<"note">, "dataType">) => {
            try {
                return QueryMap.searchNoteByLinkNote({
                    ...request,
                    dataType: "note"
                }, { orbizResolver, ...store });
            } catch (e) {
                UiUtilsFacades.notice(e instanceof Error ? e.message : "unknown query error");
                return undefined;
            }
        },
        [orbizResolver, store]
    )
}

export function useSearchNoteTreeCollectionByRootNote() {
    const orbizResolver = useOrbizResolver();
    const store = useStore();
    return useCallback(
        (request: Omit<SearchNoteByRootNoteRequest<"note-tree">, "dataType">) => {
            try {
                return QueryMap.searchNoteByRootNote({
                    ...request,
                    dataType: "note-tree"
                }, { orbizResolver, ...store })
            } catch (e) {
                UiUtilsFacades.notice(e instanceof Error ? e.message : "unknown query error");
                return undefined;
            }
        },
        [orbizResolver, store]
    )
}