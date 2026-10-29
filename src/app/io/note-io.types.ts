import { Path } from "../../_shared/path.vo";
import { AsyncCommit } from "../../_shared/types";
import { AnyNote, NotePath } from "../../domain/note";

export type NoteIo = NoteWriter & NoteReader;

export interface NoteWriter {
    save(note: AnyNote): Promise<{
        oldNote?: AnyNote,
        commit: AsyncCommit,
    }>;
    adapt(path: Path, note: AnyNote): Promise<AsyncCommit>;
}
export interface NoteReader {
    get(path: NotePath): Promise<AnyNote | undefined>;
}