import { App } from "obsidian";
import { Path } from "../../../../_shared/path.vo";
import { AsyncCommit } from "../../../../_shared/types";
import { OrbizFileIo } from "../../../../app/io/orbiz-file-io.types";
import { OrbizFilePath } from "../../../../app/orbiz.types";
import { NoteIndexStore } from "../../../../app/stores/note-index-store";
import { NotePath } from "../../../../domain/note";
import { ObsidianOrbizFileCache } from "../orbiz-file-cache";
import { getFile } from "../utils/get";

export class ObsidianOrbizFileIo implements OrbizFileIo {


    constructor(
        private readonly _app: App,
        private readonly _noteIndexStore: NoteIndexStore,
        private readonly _orbizFileCache: ObsidianOrbizFileCache,
    ) { }

    // get(path: OrbizFilePath): OrbizFile | undefined {
    //     if (path instanceof NotePath) {

    //     } else if (path instanceof DRecordPath) {

    //     }
    // }

    async rename(oldPath: OrbizFilePath, newPath: Path): Promise<AsyncCommit> {
        const vault = this._app.vault;
        const file = getFile(oldPath.value, vault);

        if (oldPath instanceof NotePath) {
            const newNotePath = NotePath.tryFrom(newPath);
            if (newNotePath === undefined) {
                const id = this._noteIndexStore.findIdByPath(oldPath.value);
                if (id) this._orbizFileCache.deleteNote(id);
            }
        }

        const newPathDir = newPath.parent;
        if (newPathDir && !vault.getFolderByPath(newPathDir.value)) {
            await vault.createFolder(newPathDir.value);
        }

        return async () => {
            await this._app.fileManager.renameFile(file, newPath.toString());
            // await vault.rename(file, newPath.toString());
        }
    }

    async addMetadata(
        path: Path,
        values: Record<string, string | number | boolean | string[] | null>
    ): Promise<AsyncCommit> {
        const vault = this._app.vault;
        const file = getFile(path.value, vault);

        return async () => {
            await this._app.fileManager.processFrontMatter(file, currentFm => {
                Object.assign(currentFm, values);
            })
        }
    }
}