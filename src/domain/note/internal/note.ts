import { DateTime } from "../../../_shared/date-time.vo";
import { IssueError } from "../../../_shared/error";
import { isIntegerLike } from "../../../_shared/utils";
import { AnyNote } from "./any-note/any-note.types";
import { AnyBoardNote } from "./board-note/board-note.types";
import { AnyMyNote } from "./my-note/my-note.types";
import { NoteIdList } from "./note-id-list.vo";
import { NoteId } from "./note-id.vo";
import { NoteName } from "./note-name.vo";
import { NotePath } from "./note-path.vo";
import { NoteTagList } from "./note-tag-list.vo";
import { isBoardNoteKind, isMyNoteKind } from "./note.const";
import { NoteEntry, NoteKind } from "./note.types";

export abstract class Note {
    abstract readonly kind: NoteKind;

    readonly entryVersion: number;
    readonly createdAt: DateTime;
    readonly entryModifiedAt: DateTime;
    readonly id: NoteId;
    readonly path: NotePath;
    readonly tags: NoteTagList;
    readonly belongsTo: NoteIdList;
    readonly references: NoteIdList;

    protected constructor(entry: NoteEntry) {
        const entryVersion = entry.entryVersion;
        if (!isIntegerLike(entryVersion)) {
            throw new IssueError({
                title: "DomainError: Note",
                layer: "domain",
                location: "Note.constructor()",
                message: `entryVersion is not integer, entryVersion: ${entryVersion}`,
            });
        }

        this.entryVersion = entryVersion;
        this.createdAt = entry.createdAt;
        this.entryModifiedAt = entry.entryModifiedAt;
        this.id = entry.id;
        this.path = entry.path;
        this.tags = entry.tags;
        this.belongsTo = entry.belongsTo;
        this.references = entry.references;

        if (this.path.kind !== entry.kind) {
            throw new IssueError({
                title: "DomainError: Note",
                layer: "domain",
                location: "Note.constructor()",
                message: `kind in path not equals to note path, path: ${this.path.toString()}, note kind: ${entry.kind}`,
            });
        }

        Note._validateSemanticOutlinks(entry.id, entry.belongsTo);
        Note._validateSemanticOutlinks(entry.id, entry.references);
    }

    protected static _validateKind(entry: NoteEntry, kind: NoteKind) {
        if (entry.kind !== kind) {
            throw new IssueError({
                title: "DomainError: Note",
                layer: "domain",
                location: "Note.validateKind()",
                message: `entry's kind not equals arg's kind, entry's: ${entry.kind} !== ${kind}`,
            });
        }
    }

    protected static _validateSemanticOutlinks(id: NoteId, outlinks: NoteIdList) {
        if (outlinks.has(id)) {
            throw new IssueError({
                title: "DomainError: Note",
                layer: "domain",
                location: "Note._validateSemanticOutlinks()",
                message: `note semantic outlinks must not have one's id, id: ${id.value}`,
            });
        }
    }

    protected abstract _withNoteEntry(entry: NoteEntry): this;

    equalsId(other: Note): boolean {
        return other.id.equals(this.id);
    }

    equalsRef(other: Note): boolean {
        return other === this;
    }

    get name(): NoteName {
        return this.path.name;
    }

    isTop(): boolean {
        return this.belongsTo.isEmpty();
    }

    isMy(): this is AnyMyNote {
        return isMyNoteKind(this.kind);
    }
    isBoard(): this is AnyBoardNote {
        return isBoardNoteKind(this.kind);
    }
    isKind<K extends NoteKind>(kind: K): this is Extract<AnyNote, { kind: K }> {
        return this.kind === kind;
    }

    withEntryModifiedAt(modifiedAt: DateTime): this {
        return this._withNoteEntry({
            ...this.getEntry(),
            entryModifiedAt: modifiedAt
        });
    }

    withName(newName: NoteName): this {
        const newPath = this.path.withName(newName);
        if (newPath.equals(this.path)) return this;

        return this._withNoteEntry({
            ...this.getEntry(),
            path: newPath,
        });
    }

    withTags(newTags: NoteTagList): this {
        if (newTags.equals(this.tags)) return this;

        return this._withNoteEntry({
            ...this.getEntry(),
            tags: newTags
        });
    }

    withBelongsTo(belongsTo: NoteIdList): this {
        if (belongsTo.equals(this.belongsTo)) return this;

        return this._withNoteEntry({
            ...this.getEntry(),
            belongsTo
        })
    }

    withReferences(references: NoteIdList): this {
        if (references.equals(this.belongsTo)) return this;

        return this._withNoteEntry({
            ...this.getEntry(),
            references
        })
    }

    // entryVersionの変更は禁止にした方が都合いいかも。整合性担保、チェックのため。
    entryVersionUp(now: DateTime): this {
        return this._withNoteEntry({
            ...this.getEntry(),
            entryVersion: (this.entryVersion + 1),
            entryModifiedAt: now,
        });
    }

    getEntry(): NoteEntry {
        return {
            createdAt: this.createdAt,
            entryModifiedAt: this.entryModifiedAt,
            id: this.id,
            kind: this.kind,
            path: this.path,
            tags: this.tags,
            belongsTo: this.belongsTo,
            references: this.references,
            entryVersion: this.entryVersion
        }
    }
}