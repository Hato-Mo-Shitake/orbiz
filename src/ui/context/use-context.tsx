import { useContext } from "react";
import { IssueError } from "../../_shared/error";
import { IoMap } from "../../app/io/io.types";
import { OrbizResolver } from "../../app/orbiz-resolver.types";
import { OrbizSpace } from "../../app/orbiz-space.types";
import { StoreMap } from "../../app/stores/store.types";
import { IoContext, OrbizResolverContext, OrbizSpaceContext, StoreContext } from "./context";

// TODO: これ、StoreReaderMapにしないと。
export const useStore = (): StoreMap => {
    const store = useContext(StoreContext);
    if (store === undefined) {
        throw new IssueError({
            title: "Uninitialized StoreContext",
            message: "Uninitialized StoreContext in useStore()",
            location: "useStore()",
            layer: "ui",
        });
    }
    return store;
}
export const useIo = (): IoMap => {
    const repo = useContext(IoContext);
    if (repo === undefined) {
        throw new IssueError({
            title: "Uninitialized RepositoryContext",
            message: "Uninitialized RepositoryContext in useIo()",
            location: "useIo()",
            layer: "ui",
        });
    }
    return repo;
}
export const useOrbizSpace = (): OrbizSpace => {
    const ws = useContext(OrbizSpaceContext);
    if (ws === undefined) {
        throw new IssueError({
            title: "Uninitialized OrbizSpace",
            message: "Uninitialized OrbizSpace in useOrbizSpace()",
            location: "useOrbizSpace()",
            layer: "ui",
        });
    }
    return ws;
}
export const useOrbizResolver = (): OrbizResolver => {
    const ws = useContext(OrbizResolverContext);
    if (ws === undefined) {
        throw new IssueError({
            title: "Uninitialized OrbizResolverContext",
            message: "Uninitialized OrbizResolverContext in useOrbizResolver()",
            location: "useOrbizResolver()",
            layer: "ui",
        });
    }
    return ws;
}