import { App, FrontMatterCache } from "obsidian";
import { IssueError } from "../../../../_shared/error";
import { AsyncCommit, Commit } from "../../../../_shared/types";
import { DRecordIo } from "../../../../app/io/d-record-io.types";
import { DRecord, dRecordNoteIdsKeys, DRecordPath } from "../../../../domain/note-sub/d-record";
import { ObsidianOrbizFileCache } from "../orbiz-file-cache";
import { createFile } from "../utils/command-utils";
import { constructDRecordByFm } from "../utils/construct-d-record-by-fm";
import { createDRecordNoteIdsKey } from "../utils/create-d-record-noteIds-key";
import { getFile } from "../utils/get";
import { stringifyFrontmatter } from "../utils/stringify";

export class ObsidianDRecordIo implements DRecordIo {
    constructor(
        private readonly _app: App,
        private readonly _orbizFileCache: ObsidianOrbizFileCache,
    ) {
    }

    async get(path: DRecordPath): Promise<DRecord | undefined> {
        const file = this._app.vault.getFileByPath(path.value);
        if (file?.extension !== "md") return undefined;

        const fm = this._app.metadataCache.getFileCache(file)?.frontmatter;
        if (!fm) return undefined;

        // DRecordPathがあるのにconstructできないのは構造が壊れているので
        // ここで失敗した時はIssueを発行。
        return constructDRecordByFm(path, fm);
    }

    async save(dRecord: DRecord): Promise<{ oldDRecord?: DRecord; commit: AsyncCommit; }> {
        const commitStack: (Commit | AsyncCommit)[] = [];

        commitStack.push(() => {
            this._orbizFileCache.setDRecord(dRecord.path, dRecord);
        });

        const oldDRecord = await this.get(dRecord.path);
        if (oldDRecord) {
            const file = getFile(oldDRecord.path.value, this._app.vault);

            const newFm = this._getFrontmatterOfDRecord(dRecord);
            commitStack.push(async () => {
                await this._app.fileManager.processFrontMatter(file, currentFm => {
                    Object.assign(currentFm, newFm);
                })
            })

            if (!dRecord.path.equals(oldDRecord.path)) {
                throw new IssueError({
                    title: "DRecordPath must not changed",
                    message: `DRecordPath must not changed, path: ${oldDRecord.path.value}`,
                    location: "ObsidianDRecordIo.save()",
                    layer: "infra"
                });
            }
        } else {
            const fm = this._getFrontmatterOfDRecord(dRecord);
            const content = stringifyFrontmatter(fm);

            commitStack.push(async () => {
                await createFile(dRecord.path.toPath(), content, this._app.vault);
            });
        }

        const commit = async () => {
            for (const c of commitStack) {
                await c();
            }
        }

        return {
            commit,
            oldDRecord,
        }
    }

    private _getFrontmatterOfDRecord(dRecord: DRecord): FrontMatterCache {
        const entry = dRecord.getEntry();

        const noteIdsFm: Record<string, string[] | undefined> = {};
        dRecordNoteIdsKeys.forEach(key => {
            const dRecordNoteIdsKey = createDRecordNoteIdsKey(key);
            noteIdsFm[dRecordNoteIdsKey] = entry.noteIdsMap[key]?.toStringArray();
        });

        // FrontMatterCacheはanyなので、誤って値オブジェクトをそのまま返してしまうケースが発生。
        return {
            entryVersion: entry.entryVersion,
            createdAt: entry.createdAt.toString(),
            entryModifiedAt: entry.entryModifiedAt.toString(),
            ...noteIdsFm,
        }
    }
}