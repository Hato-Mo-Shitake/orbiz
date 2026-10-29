import { PlainDateList } from "../../../_shared/plain-date-list.vo";
import { AnyNoteSemanticOutlinksKey, NoteId, NoteIdList, NoteKind, NoteTagList } from "../../../domain/note";
import { DRecordNoteIdsKey } from "../../../domain/note-sub/d-record";

type NoteSearchedDataType = "id" | "name" | "note";

export type SearchNoteByDateRequest<DataType extends NoteSearchedDataType = NoteSearchedDataType> = {
    dates: PlainDateList,
    inKeys?: DRecordNoteIdsKey[],
    dataType: DataType,
}

export type SearchNoteByKindRequest<DataType extends NoteSearchedDataType = NoteSearchedDataType> = {
    inKinds: NoteKind[],
    dataType: DataType,
}

export type SearchNoteByLinkNoteRequest<DataType extends NoteSearchedDataType = NoteSearchedDataType> = {
    noteIds: NoteIdList | NoteId,
    inKeys: readonly AnyNoteSemanticOutlinksKey[]
    direction: "inlink" | "outlink"
    type?: "union" | "intersect"
    dataType: DataType,
}

export type SearchNoteByTagRequest<DataType extends NoteSearchedDataType = NoteSearchedDataType> = {
    tags: NoteTagList,
    type: "union" | "intersect",
    dataType: DataType,
}

type NoteSearchedListOrCollectionDataType = "note-flat" | "id-flat" | "name-flat"
    | "note-tree" | "id-tree" | "name-tree";
export type SearchNoteByRootNoteRequest<DataType extends NoteSearchedListOrCollectionDataType = NoteSearchedListOrCollectionDataType> = {
    rootNoteId: NoteId,
    key: AnyNoteSemanticOutlinksKey,
    depth?: number | "infinity",
    direction?: "inlink" | "outlink"
    dataType: DataType,
}