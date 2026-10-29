import { AnyNote, NotePath } from "../domain/note";
import { DRecord, DRecordPath } from "../domain/note-sub/d-record";

export type OrbizFileType = "note" | "d-record";

export type OrbizFile = AnyNote | DRecord;

export type OrbizFilePath = NotePath | DRecordPath;
