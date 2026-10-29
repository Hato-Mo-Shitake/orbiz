import { FrontMatterCache } from "obsidian";
import { DateTime } from "../../../../_shared/date-time.vo";
import { IssueError } from "../../../../_shared/error";
import { AnyNote, CreatoriumNote, FaqNote, GalleryNote, isNoteKind, KnowledgeNote, MemoNote, NoteId, NoteIdList, NotePath, NotePriority, NoteTagList, NoteWeight, NoticeNote, ScheduleNote, TaskNote } from "../../../../domain/note";

import { validateInteger, validateString, validateStringArrayOrEmpty, validateStringOrNull } from "./validate-fm-value";


export function tryConstructNoteByFm(
    path: NotePath,
    fm: FrontMatterCache
): AnyNote | undefined {
    try {
        return constructNoteByFm(path, fm);
    } catch {
        return undefined;
    }
}
export function constructNoteByFm(
    path: NotePath,
    fm: FrontMatterCache
): AnyNote {
    const entryVersion = validateInteger(fm, "entryVersion");
    const createdAt = DateTime.from(
        validateString(fm, "createdAt")
    );
    const entryModifiedAt = DateTime.from(
        validateString(fm, "entryModifiedAt")
    );
    const id = NoteId.from(
        validateString(fm, "id")
    );

    const kind = validateString(fm, "kind");
    if (!isNoteKind(kind)) {
        throw new IssueError({
            title: "Invalid Note Frontmatter value",
            layer: "infra",
            location: "constructNotePropsByFm()",
            message: `invalid note kind, kind: ${kind}`,
        });
    }

    const tags = NoteTagList.from(
        validateStringArrayOrEmpty(fm, "tags")
    );

    const belongsTo = NoteIdList.fromStringArray(
        validateStringArrayOrEmpty(fm, "belongsTo")
    );

    const references = NoteIdList.fromStringArray(
        validateStringArrayOrEmpty(fm, "references")
    );

    const baseProps = {
        entryVersion,
        createdAt,
        entryModifiedAt,
        path,
        id,
        tags,
        belongsTo,
        references,
    }

    switch (kind) {
        case "knowledge":
        case "gallery":
        case "creatorium":
        case "faq":
            {
                const weight = NoteWeight.fromString(
                    validateString(fm, "weight")
                );
                switch (kind) {
                    case "knowledge":
                        return KnowledgeNote.construct({
                            ...baseProps,
                            kind,
                            weight
                        });
                    case "gallery":
                        return GalleryNote.construct({
                            ...baseProps,
                            kind,
                            weight,
                            creators: NoteIdList.fromStringArray(
                                validateStringArrayOrEmpty(fm, "creators")
                            )
                        });
                    case "creatorium":
                        return CreatoriumNote.construct({
                            ...baseProps,
                            kind,
                            weight,
                        });
                    case "faq":
                        return FaqNote.construct({
                            ...baseProps,
                            kind,
                            weight,
                            resolvedAt: DateTime.fromNullable(
                                validateStringOrNull(fm, "resolvedAt")
                            ),
                        });
                }
            }
            break;
        case "task":
        case "schedule":
        case "notice":
        case "memo":
            {
                const priority = NotePriority.fromString(
                    validateString(fm, "priority")
                );
                const resolvedAt = DateTime.fromNullable(
                    validateStringOrNull(fm, "resolvedAt")
                );
                switch (kind) {
                    case "task":
                        return TaskNote.construct({
                            ...baseProps,
                            kind,
                            startedAt: DateTime.from(
                                validateString(fm, "startedAt")
                            ),
                            dueAt: DateTime.from(
                                validateString(fm, "dueAt")
                            ),
                            resolvedAt,
                            priority
                        });
                    case "schedule":
                        return ScheduleNote.construct({
                            ...baseProps,
                            kind,
                            startedAt: DateTime.from(
                                validateString(fm, "startedAt")
                            ),
                            dueAt: DateTime.fromNullable(
                                validateStringOrNull(fm, "dueAt")
                            ),
                            resolvedAt,
                            priority
                        });
                    case "notice":
                        return NoticeNote.construct({
                            ...baseProps,
                            kind,
                            resolvedAt,
                            priority
                        });
                    case "memo":
                        return MemoNote.construct({
                            ...baseProps,
                            kind,
                            resolvedAt,
                            priority
                        });
                }
            }
    }

}