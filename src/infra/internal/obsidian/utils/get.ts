import { FrontMatterCache, MetadataCache, TFile, Vault } from "obsidian";
import { IssueError } from "../../../../_shared/error";

export function getFile(path: string, vault: Vault): TFile {
    const file = vault.getFileByPath(path);
    if (!file) {
        throw new IssueError({
            title: "Not found file",
            message: `Not found file, path: ${path}`,
            layer: "infra",
            location: "getFile()"
        });
    }
    return file;
}

export function getFrontmatter(file: TFile, metadataCache: MetadataCache): FrontMatterCache {
    const cache = metadataCache.getFileCache(file);
    const fm = cache?.frontmatter;
    if (!fm) {
        throw new IssueError({
            title: "Not found frontmatter",
            message: `Not found frontmatter, path: ${file.path}`,
            layer: "infra",
            location: "getFrontmatter()"
        });
    }
    return fm;
}