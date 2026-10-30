import { AllAnyNoteMetadata, NoteId, NoteKind, NoteName } from "../../../domain/note";

// nameとkindは別の更新画面を用意する。
export type UpdateAnyNoteMetadataRequest = {
    id: NoteId,
    // kind: NoteKind,
    originalEntryVersion: number, // 整合性を保つために、受け取ったNoteのversionを渡す。
    newMetadata: AllAnyNoteMetadata
}

export type UpdateAnyNoteCoreDataRequest = {
    id: NoteId,
    originalEntryVersion: number,
    newName?: NoteName,
    newKind?: NoteKind,
}