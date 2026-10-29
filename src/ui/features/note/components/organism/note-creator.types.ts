import { NoteKind, NoteName, NotePriority, NoteTagList, NoteWeight } from "../../../../../domain/note";
import { AnyNoteSemanticDateRecord, AnyNoteSemanticOutlinkIdsRecord } from "../note.types";


export type DefaultNoteCreatorParams = {
    name?: NoteName,
    kind?: NoteKind,
    tags?: NoteTagList,
    semanticOutlinks?: Partial<AnyNoteSemanticOutlinkIdsRecord>,
    semanticDates?: Partial<AnyNoteSemanticDateRecord>,
    wight?: NoteWeight,
    priority?: NotePriority,
}