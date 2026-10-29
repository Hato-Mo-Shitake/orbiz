import { DateTime } from "../../../../_shared/date-time.vo";
import { IssueError } from "../../../../_shared/error";
import { PlainDate } from "../../../../_shared/plain-date.vo";
import { PlainYMD } from "../../../../_shared/types";
import { isIntegerLike } from "../../../../_shared/utils";
import { UtilsFacades } from "../../../../_shared/utils-facades";
import { NoteId, NoteIdList } from "../../../note";
import { DRecordId } from "./d-record-id.vo";
import { DRecordPath } from "./d-record-path.vo";
import { DRecordEntry, DRecordNoteIdsKey, DRecordNoteIdsMap } from "./d-record.types";

export class DRecord {
    readonly entryVersion: number;

    readonly createdAt: DateTime;
    readonly entryModifiedAt: DateTime;
    readonly path: DRecordPath;
    readonly noteIdsMap: DRecordNoteIdsMap;

    private constructor(props: DRecordEntry) {
        const version = props.entryVersion;
        if (!isIntegerLike(version)) {
            throw new IssueError({
                title: "DomainError: DRecord",
                layer: "domain",
                location: "DRecord.constructor()",
                message: `version is not integer, version: ${version}`,
            });
        }

        this.entryVersion = version;
        this.createdAt = props.createdAt;
        this.entryModifiedAt = props.entryModifiedAt;
        this.path = props.path;
        this.noteIdsMap = props.noteIdsMap;
    }

    static construct(props: DRecordEntry) {
        return new DRecord(props);
    }
    static create(
        params: {
            date: PlainDate | DateTime | Date,
            noteIdsMap?: DRecordNoteIdsMap,
        },
        spaceName: string
    ): DRecord {
        const now = UtilsFacades.clock.nowDateTime();
        const path = DRecordPath.create(
            params.date,
            spaceName
        );

        return DRecord.construct({
            entryVersion: 1,
            createdAt: now,
            entryModifiedAt: now,
            path,
            noteIdsMap: params.noteIdsMap || {}
        });
    }

    get id(): DRecordId {
        return this.path.recordId;
    }

    get plainDate(): PlainDate {
        return this.id.toPlainDate();
    }
    get date(): Date {
        return this.id.toDate();
    }

    get ymd(): PlainYMD {
        return this.id.toYMD();
    }
    get y(): number {
        return this.plainDate.y;
    }
    get m(): number {
        return this.plainDate.m;
    }
    get d(): number {
        return this.plainDate.d;
    }

    isToday(): boolean {
        return this.id.isToday();
    }

    isFuture(): boolean {
        return this.id.isFuture();
    }

    getNoteIds(dateKey: DRecordNoteIdsKey): NoteIdList | undefined {
        return this.noteIdsMap[dateKey];
    }

    withNoteIds(dateKey: DRecordNoteIdsKey, newNoteIds: NoteIdList): DRecord {
        const currentIds = this.getNoteIds(dateKey);
        if (currentIds && newNoteIds.equals(currentIds)) return this;

        return DRecord.construct({
            ...this.getEntry(),
            noteIdsMap: {
                ...this.noteIdsMap,
                [dateKey]: newNoteIds
            }
        });
    }
    addNoteId(dateKey: DRecordNoteIdsKey, ids: NoteId | NoteIdList): DRecord {
        const currentIds = this.getNoteIds(dateKey);

        const newNoteIds = currentIds?.add(ids)
            || (ids instanceof NoteId ? NoteIdList.fromNoteIdArray([ids]) : ids);
        if (currentIds && newNoteIds.equals(currentIds)) return this;

        return DRecord.construct({
            ...this.getEntry(),
            noteIdsMap: {
                ...this.noteIdsMap,
                [dateKey]: newNoteIds
            }
        });
    }
    removeNoteId(dateKey: DRecordNoteIdsKey, id: NoteId): DRecord {
        const currentIds = this.getNoteIds(dateKey);
        if (!currentIds) return this;

        const newNoteIds = currentIds.remove(id);
        if (newNoteIds.equals(currentIds)) return this;

        return DRecord.construct({
            ...this.getEntry(),
            noteIdsMap: {
                ...this.noteIdsMap,
                [dateKey]: newNoteIds
            }
        });
    }

    entryVersionUp(now: DateTime): DRecord {
        return DRecord.construct({
            ...this.getEntry(),
            entryVersion: (this.entryVersion + 1),
            entryModifiedAt: now,
        });
    }

    // versionUp(): DRecord {
    //     return DRecord.construct({
    //         ...this.getEntry(),
    //         entryVersion: this.entryVersion + 1
    //     });
    // }
    getEntry(): DRecordEntry {
        return {
            entryVersion: this.entryVersion,
            createdAt: this.createdAt,
            entryModifiedAt: this.entryModifiedAt,
            path: this.path,
            noteIdsMap: this.noteIdsMap
        }
    }
}