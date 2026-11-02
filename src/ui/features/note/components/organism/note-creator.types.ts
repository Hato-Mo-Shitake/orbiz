import { AnyNoteSemanticDateRecord, AnyNoteSemanticOutlinksRecord, NoteKind, NoteName, NotePriority, NoteTagList, NoteWeight } from "../../../../../domain/note";


export type DefaultNoteCreatorParams = {
    name?: NoteName,
    kind?: NoteKind,
    tags?: NoteTagList,
    semanticOutlinks?: Partial<AnyNoteSemanticOutlinksRecord>,
    semanticDates?: Partial<AnyNoteSemanticDateRecord>,
    wight?: NoteWeight,
    priority?: NotePriority,
}