import { FrontMatterCache } from "obsidian";
import { DateTime } from "../../../../_shared/date-time.vo";
import { NoteIdList } from "../../../../domain/note";
import { DRecord, dRecordNoteIdsKeys, DRecordNoteIdsMap, DRecordPath } from "../../../../domain/note-sub/d-record";
import { createDRecordNoteIdsKey } from "./create-d-record-noteIds-key";
import { validateInteger, validateString, validateStringArrayOrEmpty } from "./validate-fm-value";

export function tryConstructDRecordByFm(
    path: DRecordPath,
    fm: FrontMatterCache
): DRecord | undefined {
    try {
        return constructDRecordByFm(path, fm);
    } catch {
        return undefined;
    }
}

export function constructDRecordByFm(
    path: DRecordPath,
    fm: FrontMatterCache
): DRecord {
    const entryVersion = validateInteger(fm, "entryVersion");
    const createdAt = DateTime.from(
        validateString(fm, "createdAt")
    );
    const entryModifiedAt = DateTime.from(
        validateString(fm, "entryModifiedAt")
    );

    const noteIdsMap: DRecordNoteIdsMap = {
    };
    dRecordNoteIdsKeys.forEach(key => {
        const dRecordNoteIdsKey = createDRecordNoteIdsKey(key);
        noteIdsMap[key] = NoteIdList.fromStringArray(
            validateStringArrayOrEmpty(fm, dRecordNoteIdsKey)
        );
    });

    return DRecord.construct({
        entryVersion,
        createdAt,
        entryModifiedAt,
        path,
        noteIdsMap
    });
}