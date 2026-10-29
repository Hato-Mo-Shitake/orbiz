import { AnyNoteDS } from "../..";
import { DateTime } from "../../../../_shared/date-time.vo";
import { PlainDateList } from "../../../../_shared/plain-date-list.vo";
import { AnyNote, NoteFilter } from "./any-note.types";

export function filterNote(
    note: AnyNote,
    filter: NoteFilter,
    now: DateTime,
): boolean {
    const matchesKind = (note: AnyNote): boolean => {
        const c = filter.kind;
        if (!c) return true;
        return c.inKinds.includes(note.kind);
    };

    const matchesTags = (note: AnyNote): boolean => {
        const c = filter.tag;
        if (!c) return true;

        const requiredTags = c.tags;
        if (requiredTags.length === 0) return true;

        return c.type === "union"
            ? note.tags.hasAny(requiredTags)
            : note.tags.contains(requiredTags);
    };

    const matchesSemanticOutLink = (note: AnyNote): boolean => {
        const c = filter.semanticOutlink;
        if (!c) return true;

        const requestedIds = c.noteIds;
        if (requestedIds.isEmpty()) return true;

        const keys = c.inKeys;

        const outlinks = AnyNoteDS.extractNoteSemanticOutlinks(note, keys);
        if (outlinks === undefined) return false;

        return c.type === "union"
            ? outlinks.hasAny(requestedIds)
            : outlinks.contains(requestedIds);
    };

    const matchesDate = (note: AnyNote): boolean => {
        const c = filter.date;
        if (!c) return true;

        const requiredDates = c.inDates;
        if (requiredDates.length === 0) return true;

        const keys = c.inKeys;
        const dates = AnyNoteDS.extractNoteDates(note, keys);
        const pdList = PlainDateList.fromDateTimes(dates);

        return pdList.hasAny(requiredDates);
    };

    const matchesState = (note: AnyNote, now: DateTime): boolean => {
        const c = filter.state
        if (!c) return true;

        const actualState: Record<string, boolean> = {
            isTop: note.isTop(),
        };

        if ("resolvedAt" in note) {
            actualState["isResolved"] = note.isResolved();
        }

        if ("dueAt" in note && "startedAt" in note) {
            actualState["isOverStartedAt"] = note.isOverStartedAt(now);
            actualState["isInProgress"] = note.isInProgress(now);
            actualState["isOverDueAt"] = note.isOverDueAt(now);
        }

        for (const key of Object.keys(c) as (keyof typeof c)[]) {
            const expected = c[key];
            if (expected === undefined) continue;

            if (actualState[key] !== expected) {
                return false;
            }
        }

        return true;
    }

    const matchesWeight = (note: AnyNote): boolean => {
        const c = filter.weight;
        if (!c) return true;

        const weights = c.inWeights;
        if (weights.length === 0) return true;

        if (!note.isMy()) return false;

        return weights.some(
            weight => weight.equals(note.weight),
        );
    };

    const matchesPriority = (note: AnyNote): boolean => {
        const c = filter.priority;
        if (!c) return true;

        const priorities = c.inPriorities;
        if (priorities.length === 0) return true;

        if (!note.isBoard()) return false;

        return priorities.some(
            priority => priority.equals(note.priority),
        );
    };

    return matchesKind(note) &&
        matchesTags(note) &&
        matchesSemanticOutLink(note) &&
        matchesDate(note) &&
        matchesState(note, now) &&
        matchesWeight(note) &&
        matchesPriority(note);
}