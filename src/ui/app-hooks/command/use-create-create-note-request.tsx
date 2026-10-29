import { useCallback } from "react";
import { NewCreatoriumParams, NewFaqParams, NewGalleryNoteParams, NewKnowledgeNoteParams, NewMemoNoteParams, NewNoticeNoteParams, NewScheduleNoteParams, NewTaskNoteParams, NoteKind, NoteName, NotePriority, NoteTagList, NoteWeight } from "../../../domain/note";
import { AnyNoteSemanticDateRecord, AnyNoteSemanticOutlinkNamesRecord } from "../../features/note/components/note.types";
import { useGetNoteIdsByName } from "../../features/note/hooks/get/use-get-note-id-by-name";

export function useCreateCreateNoteRequest(

) {
    const getNoteIdsByName = useGetNoteIdsByName();

    return useCallback((params: {
        name: NoteName,
        kind: NoteKind,
        tags: NoteTagList,
        semanticOutlinkNames: AnyNoteSemanticOutlinkNamesRecord,
        semanticDates: AnyNoteSemanticDateRecord,
        weight: NoteWeight,
        priority: NotePriority
    }) => {

        const { name, kind, tags, semanticOutlinkNames, semanticDates, weight, priority } = params;

        const noteName = name;

        const baseRequest = {
            name: noteName,
            tags,
            belongsTo: getNoteIdsByName(semanticOutlinkNames.belongsTo),
            references: getNoteIdsByName(semanticOutlinkNames.references),
        }

        switch (kind) {
            case "gallery": {
                const request: NewGalleryNoteParams = {
                    ...baseRequest,
                    kind: "gallery",
                    weight,
                    creators: getNoteIdsByName(semanticOutlinkNames.creators)
                }
                return request;

            }
            case "knowledge": {
                const request: NewKnowledgeNoteParams = {
                    ...baseRequest,
                    kind: "knowledge",
                    weight,
                }
                return request;
            }
            case "creatorium": {
                const request: NewCreatoriumParams = {
                    ...baseRequest,
                    kind: "creatorium",
                    weight,
                }
                return request;
            }
            case "faq": {
                const request: NewFaqParams = {
                    ...baseRequest,
                    kind: "faq",
                    resolvedAt: semanticDates.resolvedAt,
                    weight,
                }
                return request;
            }

            case "task": {
                const startedAt = semanticDates.startedAt;
                if (!startedAt) {
                    throw new Error("startedAt is empty.")
                }
                const dueAt = semanticDates.dueAt;
                if (!dueAt) {
                    throw new Error("dueAt is empty.")
                }

                const request: NewTaskNoteParams = {
                    ...baseRequest,
                    kind: "task",
                    priority,
                    startedAt,
                    dueAt,
                    resolvedAt: semanticDates.resolvedAt,
                }
                return request;
            }
            case "schedule": {
                const startedAt = semanticDates.startedAt;
                if (!startedAt) {
                    throw new Error("startedAt is empty.")
                }
                const request: NewScheduleNoteParams = {
                    ...baseRequest,
                    kind: "schedule",
                    priority,
                    startedAt,
                    dueAt: semanticDates.dueAt,
                    resolvedAt: semanticDates.resolvedAt,
                }
                return request;
            }
            case "notice": {
                const request: NewNoticeNoteParams = {
                    ...baseRequest,
                    kind: "notice",
                    resolvedAt: semanticDates.resolvedAt,
                    priority,
                }
                return request;
            }
            case "memo": {
                const request: NewMemoNoteParams = {
                    ...baseRequest,
                    kind: "memo",
                    resolvedAt: semanticDates.resolvedAt,
                    priority,
                }
                return request;
            }
        }

    }, [getNoteIdsByName])
}