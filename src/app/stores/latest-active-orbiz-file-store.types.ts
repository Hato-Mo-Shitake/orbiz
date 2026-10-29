import { Listener, Unsubscribe } from "../../_shared/types";
import { NotePath } from "../../domain/note";
import { DRecordPath } from "../../domain/note-sub/d-record";
import { OrbizFilePath } from "../orbiz.types";

export interface LatestActiveOrbizFileStoreReader {
    getPath(type: "d-record"): DRecordPath | undefined;
    getPath(type: "note"): NotePath | undefined;
    getPath(): OrbizFilePath | undefined;

    subscribe(listener: Listener): Unsubscribe;
}