/* eslint-disable no-restricted-imports -- indexでは無視 */

// import { filterNotes } from "./internal/any-note/any-note-filter.service";
import { constructNote, createNewAnyNoteEntry, extractNoteDate, extractNoteDateMap, extractNoteDates, extractNoteSemanticOutlinks, extractNoteSemanticOutlinksMap, removeSemanticOutlinks, toAllAnyEntryDto, updateAnyNoteEntry } from "./internal/any-note/any-note.service";
import { hasCreators, hasDueAt, hasPriority, hasResolvedAt, hasStartedAt, hasWeight } from "./internal/any-note/has-note-field.service";


export { Note } from "./internal/note";

/**
 * note
 */
export { NoteIdList } from "./internal/note-id-list.vo";
export { NoteId } from "./internal/note-id.vo";
export { NoteNameList } from "./internal/note-name-list.vo";
export { NoteName } from "./internal/note-name.vo";
export { NotePath } from "./internal/note-path.vo";
export { NoteTagList } from "./internal/note-tag-list.vo";
export { NoteTag } from "./internal/note-tag.vo";
export { boardNoteKindList, isBoardNoteKind, isMyNoteKind, isNoteKind, myNoteKindList, noteKindList } from "./internal/note.const";
export type { BoardNoteKind, MyNoteKind, NoteDateKey, NoteEntry, NoteKind, NoteSemanticOutlinksKey } from "./internal/note.types";

/**
 * my-note
 */
export { CreatoriumNote } from "./internal/my-note/creatorium/creatorium-note";
export { FaqNote } from "./internal/my-note/faq/faq-note";
export { GalleryNote } from "./internal/my-note/gallery/gallery-note";
export type { GalleryNoteEntry, GalleryNoteSemanticOutLinksKey } from "./internal/my-note/gallery/gallery-note.types";
export { KnowledgeNote } from "./internal/my-note/knowledge/knowledge-note";
export type { KnowledgeNoteEntry } from "./internal/my-note/knowledge/knowledge-note.types";
export { noteWeightList } from "./internal/my-note/my-note.const";
export type { AnyMyNote, AnyMyNoteEntry, MyNoteEntry, NoteWeightValue } from "./internal/my-note/my-note.types";
export { NoteWeight } from "./internal/my-note/note-weight.vo";

/**
 * board-note
 */
export { notePriorityList } from "./internal/board-note/board-note.const";
export type { AnyBoardNote, AnyBoardNoteEntry, BoardNoteDateKey, BoardNoteEntry, NotePriorityValue } from "./internal/board-note/board-note.types";
export { MemoNote } from "./internal/board-note/memo/memo-note";
export { NotePriority } from "./internal/board-note/note-priority.vo";
export { NoticeNote } from "./internal/board-note/notice/notice-note";
export { ScheduleNote } from "./internal/board-note/schedule/schedule-note";
export { TaskNote } from "./internal/board-note/task/task-note";
export type { TaskNoteEntry } from "./internal/board-note/task/task-note.types";

/**
 * any-note
 */
// export type { FilterAnyNoteCondition, FilterBoardNoteCondition, FilterGalleryNoteCondition, FilterKnowledgeNoteCondition, FilterMyNoteCondition, FilterNoteCondition, FilterTaskNoteCondition } from "./internal/any-note/any-note-filter.types";
export { anyNoteDateKeys, anyNoteSemanticDateKeys, anyNoteSemanticOutlinksKeys, isAnyNoteSemanticOutlinksKey, noteDatesKeysMap, noteSemanticOutlinkKeysMap } from "./internal/any-note/any-note.const";
export type { AllAnyNoteMetadata, AnyNote, AnyNoteDateKey, AnyNoteEntry, AnyNoteSemanticDateKey, AnyNoteSemanticDateRecord, AnyNoteSemanticOutlinksKey, NewAnyNoteParams, NewCreatoriumParams, NewFaqParams, NewGalleryNoteParams, NewKnowledgeNoteParams, NewMemoNoteParams, NewNoticeNoteParams, NewScheduleNoteParams, NewTaskNoteParams, NoteFilter } from "./internal/any-note/any-note.types";
export { NoteCollection } from "./internal/any-note/note-collection";
export { NoteTreeCollection } from "./internal/any-note/note-tree-collection";
// service

export class AnyNoteDS {
    static createNewAnyNoteEntry = createNewAnyNoteEntry;
    static updateAnyNoteEntry = updateAnyNoteEntry;
    static constructNote = constructNote

    static extractNoteSemanticOutlinks = extractNoteSemanticOutlinks;
    static extractNoteSemanticOutlinksMap = extractNoteSemanticOutlinksMap;
    static extractNoteDate = extractNoteDate;
    static extractNoteDates = extractNoteDates;
    static extractNoteDateMap = extractNoteDateMap;

    static hasWeight = hasWeight;
    static hasPriority = hasPriority;
    static hasCreators = hasCreators;
    static hasStartedAt = hasStartedAt;
    static hasDueAt = hasDueAt;
    static hasResolvedAt = hasResolvedAt;

    // static tryGetNoteWithResolvedAt = tryGetNoteWithResolvedAt;

    static toAllAnyEntryDto = toAllAnyEntryDto;

    static removeSemanticOutlinks = removeSemanticOutlinks
}

/* eslint-enable no-restricted-imports -- indexでは無視 */

