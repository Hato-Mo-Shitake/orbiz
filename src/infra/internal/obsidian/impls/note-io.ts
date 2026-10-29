import { App, FrontMatterCache } from "obsidian";
import { IssueError } from "../../../../_shared/error";
import { Path } from "../../../../_shared/path.vo";
import { AsyncCommit, Commit } from "../../../../_shared/types";
import { NoteIo } from "../../../../app/io/note-io.types";
import { AnyNote, AnyNoteDS, NotePath } from "../../../../domain/note";
import { ObsidianOrbizFileCache } from "../orbiz-file-cache";
import { createFile } from "../utils/command-utils";
import { constructNoteByFm } from "../utils/construct-note-by-fm";
import { getFile } from "../utils/get";
import { stringifyFrontmatter } from "../utils/stringify";

export class ObsidianNoteIo implements NoteIo {
    constructor(
        private readonly _app: App,
        private readonly _orbizFileCache: ObsidianOrbizFileCache,
    ) {
    }

    async get(path: NotePath): Promise<AnyNote | undefined> {
        const file = this._app.vault.getFileByPath(path.value);
        if (file?.extension !== "md") return undefined;

        const fm = this._app.metadataCache.getFileCache(file)?.frontmatter;
        if (!fm) return undefined;
        return constructNoteByFm(path, fm);
    }

    async save(note: AnyNote): Promise<{ oldNote?: AnyNote; commit: AsyncCommit; }> {
        const commitStack: (Commit | AsyncCommit)[] = [];

        commitStack.push(() => {
            this._orbizFileCache.setNote(note.path, note);
        });

        const oldNote = await this.get(note.path);
        if (oldNote) {
            const file = getFile(oldNote.path.value, this._app.vault);
            const newFm = this._getFrontmatterOfNote(note);
            commitStack.push(async () => {
                await this._app.fileManager.processFrontMatter(file, currentFm => {
                    Object.assign(currentFm, newFm);
                })
            });

            if (!note.path.equals(oldNote.path)) {
                // NoteIoでのpath更新は禁止にするか別メソッドに分けても良い。
                // 現状の設計だとCoreData変更時に無駄にFmの同値の上書きが走ってる。
                commitStack.push(async () => {
                    await this._app.fileManager.renameFile(file, note.path.value);
                    // await this._app.vault.rename(file, note.path.value);
                });
            }

        } else {
            const fm = this._getFrontmatterOfNote(note);
            const content = stringifyFrontmatter(fm);
            commitStack.push(async () => {
                await createFile(note.path.toPath(), content, this._app.vault);
            });
        }

        const commit = async () => {
            for (const c of commitStack) {
                await c();
            }
        }

        return {
            commit,
            oldNote,
        }
    }

    async adapt(path: Path, note: AnyNote): Promise<AsyncCommit> {
        const commitStack: (Commit | AsyncCommit)[] = [];

        const oldNotePath = NotePath.tryFrom(path);
        if (oldNotePath) {
            throw new IssueError({
                title: "Already this is note",
                message: `already this is note, path: ${path.value}`,
                layer: "infra",
                location: "ObsidianNoteIo"
            });
        }

        commitStack.push(() => {
            this._orbizFileCache.setNote(note.path, note);
        });

        const file = getFile(path.value, this._app.vault);
        const newFm = this._getFrontmatterOfNote(note);
        commitStack.push(async () => {
            await this._app.fileManager.processFrontMatter(file, currentFm => {
                Object.assign(currentFm, newFm);
            })
        });

        commitStack.push(async () => {
            await this._app.fileManager.renameFile(file, note.path.value);
            // await this._app.vault.rename(file, note.path.value);
        });

        const commit = async () => {
            for (const c of commitStack) {
                await c();
            }
        }

        return commit;

    }

    private _getFrontmatterOfNote(note: AnyNote): FrontMatterCache {
        const primitiveEntry = AnyNoteDS.toAllAnyEntryDto(note.getEntry()) as FrontMatterCache;
        delete primitiveEntry.path;
        return primitiveEntry;
    }
}