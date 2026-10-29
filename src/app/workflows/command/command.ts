import { adaptFileToNote } from "./adapt-file-to-note";
import { addNoteOutlink } from "./add-note-outlink";
import { assignModifiedNotesToDRecord } from "./assign-modified-notes-to-d-record.ts.js";
import { createNote } from "./create-note.js";
import { trashNote } from "./trash-note.js";
import { updateNoteCoreData } from "./update-note-core-data.js";
import { updateNoteMetadata } from "./update-note-metadata.js";

export class CommandMap {
    static createNote = createNote;
    static adaptFileToNote = adaptFileToNote;

    static updateNoteCoreData = updateNoteCoreData;
    static updateNoteMetadata = updateNoteMetadata;
    static trashNote = trashNote;

    static addNoteOutlink = addNoteOutlink;

    static assignModifiedNotesToDRecord = assignModifiedNotesToDRecord;
}