import { Path } from "../../_shared/path.vo";
import { AsyncCommit } from "../../_shared/types";
import { OrbizFilePath } from "../orbiz.types";

export type OrbizFileIo = OrbizFileWriter;

export interface OrbizFileWriter {
    rename(oldPath: OrbizFilePath | Path, newPath: Path): Promise<AsyncCommit>;
    addMetadata(
        path: Path,
        values: Record<string, string | number | boolean | string[] | null>
    ): Promise<AsyncCommit>;
}