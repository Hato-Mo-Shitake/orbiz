import { DateTime } from "../../../../_shared/date-time.vo";
import { NoteIdList } from "../note-id-list.vo";
import { AnyNote, NoteFilter } from "./any-note.types";
import { filterNote } from "./filter-note.service";

export class NoteCollection implements Iterable<AnyNote> {
    private _notes: AnyNote[];

    private _lazyIds: NoteIdList | undefined = undefined;

    private constructor(notes: AnyNote[]) {
        this._notes = notes;
    }

    static from(notes: AnyNote[]): NoteCollection {
        return new NoteCollection(notes);
    }

    get length(): number {
        return this._notes.length;
    }

    get value(): readonly AnyNote[] {
        return this._notes;
    }

    get ids(): NoteIdList {
        if (!this._lazyIds) {
            this._lazyIds = NoteIdList.fromNoteIdArray(this._notes.map(note => note.id));
        }

        return this._lazyIds;
    }

    isNotEmpty(): boolean {
        return !this.isEmpty();
    }
    isEmpty(): boolean {
        return this.length === 0;
    }

    add(notes: AnyNote | AnyNote[]) {
        if (Array.isArray(notes)) {
            return NoteCollection.from([
                ...this._notes,
                ...notes
            ])
        } else {
            return NoteCollection.from([
                ...this._notes,
                notes
            ])
        }
    }

    // toNoteIdList(): NoteIdList {

    // }

    toArray(): AnyNote[] {
        return [...this._notes];
    }

    filter(condition: NoteFilter, now: DateTime): NoteCollection {
        return NoteCollection.from(
            [...this._notes].filter(note => filterNote(note, condition, now))
        );
    }

    // sort(condition: SortNoteCondition) {

    // }

    *[Symbol.iterator](): IterableIterator<AnyNote> {
        for (const note of this._notes) {
            yield note;
        }
    }
}
