import { useCallback } from "react";
import { AnyNote, AnyNoteSemanticDateKey, AnyNoteSemanticOutlinksKey, NoteNameList } from "../../../../domain/note";
import { AnyNoteSemanticOutlinkNamesRecord } from "../components/note.types";
import { useGetNoteNames } from "./get/use-get-note-name";

export function useExtractNoteSemanticOutlinkNamesRecord() {
    const getNoteNames = useGetNoteNames();
    const extractOutlinkNames = (note: AnyNote | undefined, key: AnyNoteSemanticOutlinksKey) => {
        if (note === undefined) return NoteNameList.empty();

        if (key === "belongsTo" || key === "references") {
            return getNoteNames(note[key]);
        }

        if (key === "creators" && "creators" in note) {
            return getNoteNames(note["creators"]);
        }

        return NoteNameList.empty();
    }

    return useCallback((note: AnyNote | undefined): AnyNoteSemanticOutlinkNamesRecord => {
        return {
            belongsTo: extractOutlinkNames(note, "belongsTo"),
            references: extractOutlinkNames(note, "belongsTo"),
            creators: extractOutlinkNames(note, "belongsTo"),
        }
    }, [getNoteNames])
}

export function useExtractNoteSemanticDateRecord() {
    const extractSemanticDate = (note: AnyNote | undefined, key: AnyNoteSemanticDateKey) => {
        if (note === undefined) return null;

        switch (key) {
            case "resolvedAt":
                if ("resolvedAt" in note) return note.resolvedAt;
                break;
            case "dueAt":
                if ("dueAt" in note) return note.dueAt;
                break;
            case "startedAt":
                if ("startedAt" in note) return note.startedAt;
                break;
        }

        return null;
    }

    return useCallback((note: AnyNote | undefined) => {
        return {
            resolvedAt: extractSemanticDate(note, "resolvedAt"),
            startedAt: extractSemanticDate(note, "startedAt"),
            dueAt: extractSemanticDate(note, "dueAt"),
        };
    }, [])
}

