import { DateTime } from "../../../../_shared/date-time.vo";
import { NotePriority } from "../board-note/note-priority.vo";
import { NoteWeight } from "../my-note/note-weight.vo";
import { NoteIdList } from "../note-id-list.vo";
import { AnyNote } from "./any-note.types";

export function hasWeight(note: AnyNote): note is Extract<
    AnyNote,
    { weight: NoteWeight }
> {
    return ("weight" in note);
}
export function hasPriority(note: AnyNote): note is Extract<
    AnyNote,
    { priority: NotePriority }
> {
    return ("priority" in note);
}

export function hasCreators(note: AnyNote): note is Extract<
    AnyNote,
    { creators: NoteIdList }
> {
    return ("creators" in note);
}

export function hasStartedAt(note: AnyNote): note is Extract<
    AnyNote,
    { startedAt: DateTime }
> {
    return ("startedAt" in note);
}
export function hasDueAt(note: AnyNote): note is Extract<
    AnyNote,
    { dueAt: DateTime | null }
> {
    return ("dueAt" in note);
}
export function hasResolvedAt(note: AnyNote): note is Extract<
    AnyNote,
    { resolvedAt: DateTime | null }
> {
    return ("resolvedAt" in note);
}