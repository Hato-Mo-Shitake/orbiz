import { FrontMatterCache } from "obsidian";
import { IssueError } from "../../../../_shared/error";
import { isIntegerLike, isStringArray } from "../../../../_shared/utils";

export function validateInteger(fm: FrontMatterCache, key: string): number {
    const value = fm[key] as unknown;
    if (typeof value !== "number" || !isIntegerLike(value)) {
        throw new IssueError({
            title: "Invalid Frontmatter value",
            layer: "infra",
            location: "constructDRecordFromFm()",
            message: `${key} is not integer in fm, value: ${String(value)}`,
        });
    }
    return value;
}

export function validateStringOrNull(fm: FrontMatterCache, key: string): string | null {
    const value = fm[key] as unknown;
    if (value === null) return null;

    if (typeof value !== "string") {
        throw new IssueError({
            title: "Invalid Frontmatter value",
            layer: "infra",
            location: "validateString() in validate-fm-value.ts",
            message: `${key} is undefined or not string in fm`,
        });
    }
    return value;
}

export function validateString(fm: FrontMatterCache, key: string): string {
    const value = fm[key] as unknown;
    if (typeof value !== "string") {
        throw new IssueError({
            title: "Invalid Frontmatter value",
            layer: "infra",
            location: "validateString() in validate-fm-value.ts",
            message: `${key} is undefined or not string in fm, value: ${String(value)}`,
        });
    }
    return value;
}

export function validateStringArrayOrEmpty(fm: FrontMatterCache, key: string): string[] {
    const value = fm[key] as unknown;
    if (value === undefined || value === null) return [];

    if (!isStringArray(value)) {
        throw new IssueError({
            title: "Invalid Frontmatter value",
            layer: "infra",
            location: "validateStringArray() in validate-fm-value.ts",
            message: `${key} is not string array in fm`,
        });
    }
    return value;
}