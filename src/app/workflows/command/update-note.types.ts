import { AllAnyNoteMetadata, NoteId, NoteKind, NoteName } from "../../../domain/note";

// nameとkindは別の更新画面を用意する。
export type UpdateAnyNoteMetadataRequest = {
    id: NoteId,
    originalEntryVersion: number, // 整合性を保つために、受け取ったNoteのversionを渡す。
    metadata: AllAnyNoteMetadata
}

export type UpdateAnyNoteCoreDataRequest = {
    id: NoteId,
    originalEntryVersion: number,
    name?: NoteName,
    kind?: NoteKind,
}