import { DRecordIo } from "./d-record-io.types"
import { NoteIo } from "./note-io.types"
import { OrbizFileIo } from "./orbiz-file-io.types"

export type IoMap = {
    noteIo: NoteIo,
    dRecordIo: DRecordIo,
    orbizFileIo: OrbizFileIo
} 