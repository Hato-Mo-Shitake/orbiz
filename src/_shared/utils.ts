import { PATH_SEPARATOR } from "./const";
import { IssueError } from "./error";
import { TreeNode } from "./types";


export function toYearMonthString(year: number, month: number): string | undefined {
    if (!Number.isInteger(year) || year < 0) return undefined;
    if (!Number.isInteger(month) || month < 1 || month > 12) return undefined;

    const yyyy = (`000${year}`).slice(-4);
    const MM = (`0${month}`).slice(-2);

    return `${yyyy}-${MM}`;
}

export function extractBaseNameFromPath(path: string): string {
    const fileName = path.split(PATH_SEPARATOR).pop() ?? "";
    const extensionIndex = fileName.lastIndexOf(".");

    // .env のようなドット始まりの名前は拡張子扱いしない
    return extensionIndex > 0
        ? fileName.slice(0, extensionIndex)
        : fileName;
}

export const isIntegerLike = (v: unknown): boolean => {
    if (typeof v === "number") return Number.isInteger(v);

    if (typeof v === "string" && v.trim() !== "") {
        return Number.isInteger(Number(v));
    }

    return false;
};

export function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export const trimFull = (value: string): string => {
    return value.replace(/^[\s\u3000]+|[\s\u3000]+$/g, "");
}

export function arrayEquals<T>(a: readonly T[], b: readonly T[]): boolean {
    return a.length === b.length && a.every((value, index) => value === b[index]);
}

export function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every(v => typeof v === "string");
}

const RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;
export function validateAndNormalizePathSegment(segment: string): string | undefined {
    const len = segment.length;

    if (len === 0) return undefined;
    if (len > 255) return undefined;

    // path traversal
    if (segment === "." || segment === "..") return undefined;

    // Windows reserved device names
    if (RESERVED.test(segment)) return undefined;

    if (segment.endsWith(".")) {
        return undefined;
    }

    if (segment.trim() !== segment) return undefined;

    for (let i = 0; i < len; i++) {
        const c = segment[i];

        switch (c) {
            case "/":
            case "\\":
            case ":":
            case "*":
            case "?":
            case "\"":
            case "<":
            case ">":
            case "|":
                return undefined;
        }

        // control characters
        if (segment.charCodeAt(i) < 32) {
            return undefined;
        }
    }

    segment = segment.normalize("NFC");

    return segment;
}

export function collectTreeNodes<T>(root: TreeNode<T>, includeRootNode = true): T[] {
    const result: T[] = [];
    const stack = [{ treeNode: root, isRoot: true }];

    while (stack.length > 0) {
        const current = stack.pop()!;

        if (includeRootNode || !current.isRoot) {
            result.push(current.treeNode.node);
        }

        const neighbors = current.treeNode.neighbors ?? [];

        // NOTE: index番号が0から順に割り振られている保証はないので、処理は重くなるが、reverse()を使って実装。重くて支障が出る場合は再検討
        // for (let i = neighbors.length - 1; i >= 0; i--) {
        //     stack.push({ treeNode: neighbors[i], isRoot: false });
        // }
        for (const neighbor of [...neighbors].reverse()) {
            stack.push({ treeNode: neighbor, isRoot: false });
        }
    }

    return result;
}

export function filterTree<T>(
    root: TreeNode<T>,
    predicate: (node: T) => boolean,
): TreeNode<T> | undefined {
    const neighbors = (root.neighbors ?? [])
        .map(neighbor => filterTree(neighbor, predicate))
        .filter((neighbor): neighbor is TreeNode<T> => neighbor !== undefined);

    if (!predicate(root.node)) {
        return undefined;
    }

    return {
        node: root.node,
        ...(neighbors.length > 0 ? { neighbors } : {}),
    };
}

export function buildTree<T, K>(
    rootSource: K,
    fromSource: (source: K) => T | undefined,
    getNeighbors: (source: K) => readonly K[] | undefined,
    getUniqueKey: (source: K) => string,
    depth: number | "infinity" = "infinity",
): TreeNode<T> | undefined {
    if (
        depth !== "infinity" &&
        (!Number.isInteger(depth) || depth < 0)
    ) {
        throw new IssueError({
            title: "Invalid Argument Error",
            location: "buildTree()",
            layer: "shared",
            message: "depth must be a non-negative integer or 'infinity'"
        });
    }

    const maxDepth = depth === "infinity" ? Infinity : depth;

    function build(
        source: K,
        currentDepth: number,
        route: ReadonlySet<string>,
    ): TreeNode<T> | undefined {
        const key = getUniqueKey(source);
        if (route.has(key)) {
            throw new IssueError({
                title: "Circular reference",
                layer: "shared",
                location: "buildTree",
                message: `Circular reference detected: ${key}`
            });
        }

        const node = fromSource(source);
        if (node === undefined) return undefined

        const neighborsCandidate = getNeighbors(source);

        // if (neighborsCandidate === undefined) return undefined;
        if (neighborsCandidate === undefined) return { node, neighbors: undefined };

        const nextRoute = new Set(route);
        nextRoute.add(key);

        const neighbors: TreeNode<T>[] = [];

        if (currentDepth < maxDepth) {
            for (const neighbor of neighborsCandidate) {
                const n = build(neighbor, currentDepth + 1, nextRoute);
                if (n !== undefined) {
                    neighbors.push(n);
                }
            }
        }

        return { node, neighbors };
    }

    return build(rootSource, 0, new Set());
}

export function buildReachableNodeList<T, K>(
    rootSource: K,
    fromSource: (source: K) => T | undefined,
    getNeighbors: (source: K) => readonly K[] | undefined,
    getUniqueKey: (source: K) => string,
    depth: number | "infinity" = "infinity",
): T[] | undefined {
    const rootNode = fromSource(rootSource);
    if (rootNode === undefined) return undefined;

    if (
        depth !== "infinity" &&
        (!Number.isInteger(depth) || depth < 0)
    ) {
        throw new IssueError({
            title: "Invalid Argument Error",
            location: "buildReachableNodeList()",
            layer: "shared",
            message: "depth must be a non-negative integer or 'infinity'",
        });
    }

    const maxDepth = depth === "infinity" ? Infinity : depth;
    const result: T[] = [];

    function visit(
        source: K,
        currentDepth: number,
        route: ReadonlySet<string>,
    ): void {
        const key = getUniqueKey(source);

        if (route.has(key)) {
            throw new IssueError({
                title: "Circular reference",
                layer: "shared",
                location: "buildReachableNodeList()",
                message: `Circular reference detected: ${key}`,
            });
        }

        const neighborsCandidate = getNeighbors(source);
        if (neighborsCandidate === undefined) return;

        const nextRoute = new Set(route);
        nextRoute.add(key);

        if (currentDepth >= maxDepth) return;

        for (const neighbor of neighborsCandidate) {
            const n = fromSource(neighbor);
            if (n === undefined) continue;
            result.push(n);
            visit(neighbor, currentDepth + 1, nextRoute);
        }
    }

    visit(rootSource, 0, new Set());
    return result;
}