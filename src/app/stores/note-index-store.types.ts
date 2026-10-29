
import { Listener, Unsubscribe } from "../../_shared/types";
import { AnyNote, AnyNoteSemanticOutlinksKey, NoteId, NoteIdList, NoteKind, NoteName, NoteNameList, NoteTag, NoteTagList } from "../../domain/note";

export type NoteIndex = {
    registry: NoteRegistry,
    nameIndex: NoteNameIndex,
    tagIndex: NoteTagIndex,
    tagList: NoteTagList,
    noteListMap: NoteListMap,
    nameListByKindMap: NoteNameListByKindMap,
}

export type IndexNoteListType = "topNote" | "unresolved";
export type NoteListMap = Record<IndexNoteListType, NoteIdList>;
export type NoteNameListByKindMap = Record<NoteKind, NoteNameList>;

/**
 * id -> source
 */
export type NoteRegistry = Map<string, NoteSource>;

/**
 * name -> id
 */
export type NoteNameIndex = Map<string, string>;

/**
 * tag name -> id list
 */
export type NoteTagIndex = Map<string, NoteIdList>;

// NOTE: note domainはinlinksの存在を意識しないから、ここに定義
export type NoteSemanticInlinksRecord = Record<AnyNoteSemanticOutlinksKey, NoteIdList>;

export type NoteSource = {
    id: string
    path: string
    inlinkNoteIds: Record<AnyNoteSemanticOutlinksKey, NoteIdList>,
    entryVersion: number
};
export type ReadonlyNoteSource = Readonly<{
    id: string
    path: string
    inlinkNoteIds: Readonly<Record<AnyNoteSemanticOutlinksKey, NoteIdList>>
    entryVersion: number
}>;

// TODO: 実装はパフォーマンス重視でこのままでもいいけど、公開するインターフェースはインデックスの種別ごとに分けたい。
export type ListenerInlinksChanged = (id: NoteId, key: AnyNoteSemanticOutlinksKey, inlinks: NoteIdList) => void;
export interface NoteIndexStoreReader {
    findSource(id: string | NoteId): ReadonlyNoteSource | undefined
    getSource(id: string | NoteId): ReadonlyNoteSource

    findName(id: string | NoteId): string | undefined
    getName(id: string | NoteId): string;

    findPath(id: string | NoteId): string | undefined;
    getPath(id: string | NoteId): string;

    findInlinks(id: string | NoteId): Readonly<NoteSemanticInlinksRecord> | undefined;
    getInlinks(id: string | NoteId): Readonly<NoteSemanticInlinksRecord>;

    findIdByName(name: string | NoteName): string | undefined
    getIdByName(name: string | NoteName): string

    findIdByPath(path: string): string | undefined;
    getIdByPath(path: string): string;

    findIdsByTag(tag: string | NoteTag): NoteIdList | undefined
    getIdsByTag(tag: string | NoteTag): NoteIdList

    getTagList(): NoteTagList;
    getNameListByKind(kind: NoteKind): NoteNameList;
    getNoteList(type: IndexNoteListType): NoteIdList

    subscribe(listener: Listener): Unsubscribe;
    subscribeInlinksChanged(listener: ListenerInlinksChanged): Unsubscribe;
    subscribeChanged(listener: (note: AnyNote, oldNote?: AnyNote) => void): Unsubscribe;
    subscribeDeleted(listener: (note: AnyNote) => void): Unsubscribe;
}