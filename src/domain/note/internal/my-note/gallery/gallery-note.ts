import { Note } from "../../note";
import { NoteIdList } from "../../note-id-list.vo";
import { MyNote } from "../my-note";
import { MyNoteEntry } from "../my-note.types";
import { GalleryNoteEntry } from "./gallery-note.types";

export class GalleryNote extends MyNote {
    readonly kind = "gallery" as const;
    readonly creators: NoteIdList;

    protected constructor(entry: GalleryNoteEntry) {
        super(entry);
        this.creators = entry.creators;
        Note._validateKind(entry, this.kind);
        Note._validateSemanticOutlinks(entry.id, entry.creators);
    }

    static construct(props: GalleryNoteEntry): GalleryNote {
        return new GalleryNote(props);
    }

    withCreators(creators: NoteIdList): this {
        if (creators.equals(this.creators)) return this;

        return GalleryNote.construct({
            ...this.getEntry(),
            creators
        }) as this;
    }

    protected _withMyNoteEntry(entry: MyNoteEntry): this {
        return GalleryNote.construct({
            ...entry,
            kind: this.kind,
            creators: this.creators
        }) as this;
    }

    getEntry(): GalleryNoteEntry {
        return {
            ...super.getEntry(),
            kind: this.kind,
            creators: this.creators
        }
    }
}