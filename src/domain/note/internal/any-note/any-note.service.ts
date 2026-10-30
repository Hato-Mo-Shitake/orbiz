import { DateTime } from "../../../../_shared/date-time.vo";
import { IssueError } from "../../../../_shared/error";
import { UtilsFacades } from "../../../../_shared/utils-facades";
import { MemoNote } from "../board-note/memo/memo-note";
import { NoticeNote } from "../board-note/notice/notice-note";
import { ScheduleNote } from "../board-note/schedule/schedule-note";
import { TaskNote } from "../board-note/task/task-note";
import { CreatoriumNote } from "../my-note/creatorium/creatorium-note";
import { FaqNote } from "../my-note/faq/faq-note";
import { GalleryNote } from "../my-note/gallery/gallery-note";
import { KnowledgeNote } from "../my-note/knowledge/knowledge-note";
import { NoteIdList } from "../note-id-list.vo";
import { NoteId } from "../note-id.vo";
import { NotePath } from "../note-path.vo";
import { anyNoteDateKeys, anyNoteSemanticOutlinksKeys, isAnyNoteSemanticOutlinksKey } from "./any-note.const";
import { AllAnyEntryDto, AllAnyNoteMetadata, AnyNote, AnyNoteDateKey, AnyNoteEntry, AnyNoteSemanticOutlinksKey, NewAnyNoteParams } from "./any-note.types";
import { hasCreators, hasDueAt, hasResolvedAt, hasStartedAt } from "./has-note-field.service";


export function createNewAnyNoteEntry(
    params: NewAnyNoteParams,
    now: DateTime,
    spaceName: string,
): AnyNoteEntry {
    const path = NotePath.createByNameAndKind({
        noteName: params.name,
        kind: params.kind,
        spaceName: spaceName,
    });
    const noteCoreEntry = {
        entryVersion: 1,
        createdAt: now,
        entryModifiedAt: now,
        id: NoteId.generate(),
        path,
    }

    return {
        ...noteCoreEntry,
        ...params,
    }
}

// HACK: 新しいフィールドを追加するたびに、こういうメソッドを修正する必要があるのはどうなんだろうか。
export function updateAnyNoteEntry(
    currentNote: AnyNote,
    newMetadata: AllAnyNoteMetadata
): AnyNoteEntry {
    const now = UtilsFacades.clock.nowDateTime();
    const newVersion = currentNote.entryVersion + 1;

    const tags = newMetadata.tags ?? currentNote.tags;
    const belongsTo = newMetadata.belongsTo ?? currentNote.belongsTo;
    const references = newMetadata.references ?? currentNote.references;

    const newBaseMetadata = {
        tags,
        belongsTo,
        references,
    }

    // if (newMetadata.tags !== undefined) {
    //     newBaseMetadata["tags"] = newMetadata.tags;
    // }
    // if (newMetadata.belongsTo !== undefined) {
    //     newBaseMetadata["belongsTo"] = newMetadata.belongsTo;
    // }
    // if (newMetadata.references !== undefined) {
    //     newBaseMetadata["references"] = newMetadata.references;
    // }

    switch (currentNote.kind) {
        case "knowledge":
        case "gallery":
        case "creatorium":
        case "faq":
            {
                // if (newMetadata.weight !== undefined) {
                //     newBaseMetadata["weight"] = newMetadata.weight
                // }
                const weight = newMetadata.weight ?? currentNote.weight;
                switch (currentNote.kind) {
                    case "creatorium":
                    case "knowledge": {
                        return {
                            ...currentNote.getEntry(),
                            ...newBaseMetadata,
                            weight,
                            entryModifiedAt: now,
                            entryVersion: newVersion,
                        }
                    }
                    case "gallery": {
                        // if (newMetadata.creators !== undefined) {
                        //     newBaseMetadata.creators = newMetadata.creators;
                        // }
                        const creators = newMetadata.creators ?? currentNote.creators;
                        return {
                            ...currentNote.getEntry(),
                            ...newBaseMetadata,
                            weight,
                            creators,
                            entryModifiedAt: now,
                            entryVersion: newVersion,
                        }
                    }
                    case "faq": {
                        // if (newMetadata.resolvedAt !== undefined) {
                        //     newBaseMetadata.resolvedAt = newMetadata.resolvedAt;
                        // }
                        const resolvedAt = newMetadata.resolvedAt ?? currentNote.resolvedAt;
                        return {
                            ...currentNote.getEntry(),
                            ...newBaseMetadata,
                            weight,
                            resolvedAt,
                            entryModifiedAt: now,
                            entryVersion: newVersion,
                        }
                    }
                }
            }
            break;
        case "task":
        case "schedule":
        case "memo":
        case "notice":
            {
                // if (newMetadata.priority !== undefined) {
                //     newBaseMetadata["priority"] = newMetadata.priority
                // }
                // if (newMetadata.resolvedAt !== undefined) {
                //     newBaseMetadata["resolvedAt"] = newMetadata.resolvedAt
                // }
                const priority = newMetadata.priority ?? currentNote.priority;
                const resolvedAt = newMetadata.resolvedAt ?? currentNote.resolvedAt;
                switch (currentNote.kind) {
                    case "task": {
                        // if (newMetadata.startedAt !== undefined && newMetadata.startedAt !== null) {
                        //     newBaseMetadata.startedAt = newMetadata.startedAt
                        // }
                        // if (newMetadata.dueAt !== undefined && newMetadata.dueAt !== null) {
                        //     newBaseMetadata.dueAt = newMetadata.dueAt;
                        // }
                        const startedAt: DateTime = newMetadata.startedAt ?? currentNote.startedAt;
                        const dueAt: DateTime = newMetadata.dueAt ?? currentNote.dueAt;
                        return {
                            ...currentNote.getEntry(),
                            ...newBaseMetadata,
                            priority,
                            resolvedAt,
                            startedAt,
                            dueAt,
                            entryModifiedAt: now,
                            entryVersion: newVersion,
                        }
                    }
                    case "schedule": {
                        const startedAt: DateTime = newMetadata.startedAt ?? currentNote.startedAt;
                        const dueAt: DateTime | null = newMetadata.dueAt ?? currentNote.dueAt;
                        return {
                            ...currentNote.getEntry(),
                            ...newBaseMetadata,
                            priority,
                            resolvedAt,
                            startedAt,
                            dueAt,
                            entryModifiedAt: now,
                            entryVersion: newVersion,
                        }
                    }
                    case "notice":
                    case "memo": {
                        return {
                            ...currentNote.getEntry(),
                            ...newBaseMetadata,
                            priority,
                            resolvedAt,
                            entryModifiedAt: now,
                            entryVersion: newVersion,
                        }
                    }
                }
            }
    }
}



export function removeSemanticOutlinks(removeIds: NoteIdList | NoteId, note: AnyNote): AnyNote {
    let result: AnyNote = note;
    for (const key of anyNoteSemanticOutlinksKeys) {
        result = removeSemanticOutlink(removeIds, key, result);
    }
    return result;
}

export function removeSemanticOutlink(removeIds: NoteIdList | NoteId, key: AnyNoteSemanticOutlinksKey, note: AnyNote): AnyNote {
    switch (key) {
        case "belongsTo":
            return note.withBelongsTo(note.belongsTo.remove(removeIds));
        case "references":
            return note.withReferences(note.references.remove(removeIds));
        case "creators": {
            if (hasCreators(note)) {
                return note.withCreators(note.creators.remove(removeIds));
            } else {
                return note;
            }
        }
    }
}

export function extractNoteDate(
    note: AnyNote,
    key: AnyNoteDateKey,
): DateTime | null | undefined {
    switch (key) {
        case "createdAt":
        case "entryModifiedAt":
            return note[key];
        case "resolvedAt":
            if (hasResolvedAt(note)) {
                return note[key];
            } else {
                return undefined;
            }
        case "dueAt":
            if (hasDueAt(note)) {
                return note[key];
            } else {
                return undefined;
            }
        case "startedAt":
            if (hasStartedAt(note)) {
                return note[key];
            } else {
                return undefined;
            }
    }
}
export function extractNoteDates(
    note: AnyNote,
    keys?: AnyNoteDateKey[],
): DateTime[] {
    const result: DateTime[] = [];
    for (const key of keys || anyNoteDateKeys) {
        const date = extractNoteDate(note, key);
        if (!date) continue;
        result.push(date);
    }
    return result;
}

export function extractNoteDateMap(
    note: AnyNote,
): Record<AnyNoteDateKey, DateTime | null | undefined> {
    const dates: Record<AnyNoteDateKey, DateTime | null | undefined> = {
        createdAt: note.createdAt,
        entryModifiedAt: note.entryModifiedAt,
        startedAt: undefined,
        dueAt: undefined,
        resolvedAt: undefined,
    }

    if (hasStartedAt(note)) {
        dates.startedAt = note.startedAt;
    }

    if (hasDueAt(note)) {
        dates.dueAt = note.dueAt;
    }

    if (hasResolvedAt(note)) {
        dates.resolvedAt = note.resolvedAt;
    }

    return dates;
}

export function extractNoteSemanticOutlinks(
    note: AnyNote,
    keys?: AnyNoteSemanticOutlinksKey | readonly AnyNoteSemanticOutlinksKey[]
): NoteIdList | undefined {
    const extract = (key: AnyNoteSemanticOutlinksKey): NoteIdList | undefined => {
        switch (key) {
            case "belongsTo":
            case "references":
                return note[key];
            case "creators":
                if (hasCreators(note)) {
                    return note[key];
                } else {
                    return undefined;
                }
        }
    }

    if (isAnyNoteSemanticOutlinksKey(keys)) {
        return extract(keys);
    }

    let result: NoteIdList | undefined = undefined;
    for (const key of (keys ?? anyNoteSemanticOutlinksKeys)) {
        const ids = extract(key);
        if (ids === undefined) continue;
        if (!result) {
            result = ids;
        } else {
            result = result.add(ids);
        }
    }

    return result;
}

export const extractNoteSemanticOutlinksMap = (
    note: AnyNote
): Record<AnyNoteSemanticOutlinksKey, NoteIdList | undefined> => {
    const outlinks: Record<AnyNoteSemanticOutlinksKey, NoteIdList | undefined> = {
        "belongsTo": note.belongsTo,
        "references": note.references,
        "creators": undefined
    }

    if (hasCreators(note)) {
        outlinks.creators = note.creators;
    }

    return outlinks;
}


// export function tryGetNoteWithResolvedAt(
//     note: AnyNote,
// ): NoteWithResolvedAt | undefined {
//     if ("resolvedAt" in note) {
//         return note;
//     }
//     return undefined;
// }

export const constructNote = (entry: AnyNoteEntry): AnyNote => {
    switch (entry.kind) {
        case "knowledge": {
            return KnowledgeNote.construct(entry);
        }
        case "gallery": {
            return GalleryNote.construct(entry);
        }
        case "creatorium": {
            return CreatoriumNote.construct(entry);
        }
        case "faq": {
            return FaqNote.construct(entry);
        }
        case "task": {
            return TaskNote.construct(entry);
        }
        case "schedule": {
            return ScheduleNote.construct(entry);
        }
        case "notice": {
            return NoticeNote.construct(entry);
        }
        case "memo": {
            return MemoNote.construct(entry);
        }
    }
}

export function toAllAnyEntryDto(entry: AnyNoteEntry): AllAnyEntryDto {
    const primitiveEntry: AllAnyEntryDto = {
        path: entry.path.value,

        id: entry.id.value,
        entryVersion: entry.entryVersion,
        createdAt: entry.createdAt.toString(),
        entryModifiedAt: entry.entryModifiedAt.toString(),
        kind: entry.kind,

        tags: entry.tags.toStringArray(),

        startedAt: undefined,
        dueAt: undefined,
        resolvedAt: undefined,

        belongsTo: entry.belongsTo.toStringArray(),
        references: entry.references.toStringArray(),
        creators: undefined,

        weight: undefined,
        priority: undefined,
    }

    if ("weight" in entry) {
        primitiveEntry.weight = entry.weight.value;
    }
    if ("priority" in entry) {
        primitiveEntry.priority = entry.priority.value;
    }

    // date
    if ("startedAt" in entry) {
        primitiveEntry.startedAt = entry.startedAt?.toString() || null;
    }
    if ("dueAt" in entry) {
        primitiveEntry.dueAt = entry.dueAt?.toString() || null;
    }
    if ("resolvedAt" in entry) {
        primitiveEntry.resolvedAt = entry.resolvedAt?.toString() || null;
    }

    // link
    if ("creators" in entry) {
        primitiveEntry.creators = entry.creators.toStringArray();
    }

    const unmappedKeys = Object.keys(entry).filter(
        key => !Object.prototype.hasOwnProperty.call(primitiveEntry, key),
    );
    if (unmappedKeys.length > 0) {
        throw new IssueError({
            title: "Invalid Note domain service",
            layer: "domain",
            location: "toPrimitiveAllAnyEntry()",
            message: `Unmapped AnyNoteEntry keys: ${unmappedKeys.join(", ")}`
        });
    }

    return primitiveEntry;
}