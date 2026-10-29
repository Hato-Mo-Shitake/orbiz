import { FrontMatterCache, stringifyYaml } from "obsidian";

export function stringifyFrontmatter(
    frontmatter: FrontMatterCache
): string {
    // const yaml = stringifyYaml(frontmatter).trimEnd();
    const yaml = stringifyYaml(frontmatter).replace(/\s+$/, "");

    return `---\n${yaml}\n---`;
}