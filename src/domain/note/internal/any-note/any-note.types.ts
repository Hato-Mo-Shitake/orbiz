import { DateTime } from "../../../../_shared/date-time.vo";
import { PlainDateList } from "../../../../_shared/plain-date-list.vo";
import { AnyBoardNote, AnyBoardNoteEntry } from "../board-note/board-note.types";
import { MemoNoteEntry } from "../board-note/memo/memo-note.types";
import { NotePriority } from "../board-note/note-priority.vo";
import { NoticeNoteEntry } from "../board-note/notice/notice-note.types";
import { ScheduleNoteEntry } from "../board-note/schedule/schedule-note.types";
import { TaskNoteEntry } from "../board-note/task/task-note.types";
import { CreatoriumNoteEntry } from "../my-note/creatorium/creatorium-note.types";
import { FaqNoteEntry } from "../my-note/faq/faq-note.types";
import { GalleryNoteEntry } from "../my-note/gallery/gallery-note.types";
import { KnowledgeNoteEntry } from "../my-note/knowledge/knowledge-note.types";
import { AnyMyNote, AnyMyNoteEntry } from "../my-note/my-note.types";
import { NoteWeight } from "../my-note/note-weight.vo";
import { NoteIdList } from "../note-id-list.vo";
import { NoteName } from "../note-name.vo";
import { NoteTagList } from "../note-tag-list.vo";
import { NoteKind } from "../note.types";
import { anyNoteDateKeys, anyNoteSemanticDateKeys, anyNoteSemanticOutlinksKeys } from "./any-note.const";


// これだとkind補完が効かなくなる箇所がある -> Omit<AnyNoteEntry, "id" | "createdAt" | "entryModifiedAt" | "path" | "entryVersion"> & { name: NoteName },
export type NewAnyNoteParams =
    | NewKnowledgeNoteParams | NewGalleryNoteParams | NewCreatoriumParams | NewFaqParams
    | NewTaskNoteParams | NewScheduleNoteParams | NewNoticeNoteParams | NewMemoNoteParams;

type omitType = "id" | "createdAt" | "entryModifiedAt" | "path" | "entryVersion";
type NewNoteParams<TEntry> = Omit<TEntry, omitType> & { name: NoteName };

export type NewKnowledgeNoteParams = Omit<KnowledgeNoteEntry, omitType> & { name: NoteName };
export type NewGalleryNoteParams = NewNoteParams<GalleryNoteEntry>;
export type NewCreatoriumParams = NewNoteParams<CreatoriumNoteEntry>;
export type NewFaqParams = NewNoteParams<FaqNoteEntry>;

export type NewTaskNoteParams = NewNoteParams<TaskNoteEntry>;
export type NewScheduleNoteParams = NewNoteParams<ScheduleNoteEntry>;
export type NewNoticeNoteParams = NewNoteParams<NoticeNoteEntry>;
export type NewMemoNoteParams = NewNoteParams<MemoNoteEntry>;


export type AnyNote = AnyMyNote | AnyBoardNote;
export type AnyNoteSemanticOutlinksKey = typeof anyNoteSemanticOutlinksKeys[number];
export type AnyNoteDateKey = typeof anyNoteDateKeys[number];
export type AnyNoteSemanticDateKey = typeof anyNoteSemanticDateKeys[number];

export type AnyNoteEntry = AnyMyNoteEntry | AnyBoardNoteEntry;

export type AllAnyNoteMetadata = {
    tags?: NoteTagList,

    resolvedAt?: DateTime | null,
    startedAt?: DateTime | null,
    dueAt?: DateTime | null,

    belongsTo?: NoteIdList,
    references?: NoteIdList,
    creators?: NoteIdList,

    weight?: NoteWeight,
    priority?: NotePriority,
}
export type AllAnyEntryDto = {
    path: string,

    id: string,
    entryVersion: number,
    createdAt: string,
    entryModifiedAt: string,
    kind: string,

    tags: string[],

    startedAt?: string | null,
    dueAt?: string | null,
    resolvedAt?: string | null,

    belongsTo: string[],
    references: string[],
    creators?: string[],

    weight?: string,
    priority?: string,
}

export type NoteWithResolvedAt = Extract<
    AnyNote,
    { resolvedAt: DateTime | null }
>;


// filter

type FilterNoteByStateCondition = {
    isTop?: boolean,
    isResolved?: boolean,
    isOverStartedAt?: boolean,
    isInProgress?: boolean,
    isOverDueAt?: boolean,
}
type FilterNoteByTagCondition = {
    tags: NoteTagList,
    type: "union" | "intersect",
}

type FilterNoteByDateCondition = {
    inDates: PlainDateList,
    inKeys?: AnyNoteDateKey[],
}

type FilterNoteBySemanticOutlinkCondition = {
    noteIds: NoteIdList,
    inKeys?: AnyNoteSemanticOutlinksKey[],
    type: "union" | "intersect"
}

type FilterNoteByWeightCondition = {
    inWeights: NoteWeight[],
}

type NoteByPriorityFilter = {
    inPriorities: NotePriority[],
}

type NoteByKindFilter = {
    inKinds: NoteKind[];
}

export type NoteFilter = {
    kind?: NoteByKindFilter,
    tag?: FilterNoteByTagCondition,
    semanticOutlink?: FilterNoteBySemanticOutlinkCondition,
    state?: FilterNoteByStateCondition,
    date?: FilterNoteByDateCondition,
    weight?: FilterNoteByWeightCondition,
    priority?: NoteByPriorityFilter,
}
