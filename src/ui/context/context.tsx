import { createContext } from "react";
import { IoMap } from "../../app/io/io.types";
import { OrbizResolver } from "../../app/orbiz-resolver.types";
import { OrbizSpace } from "../../app/orbiz-space.types";
import { StoreMap } from "../../app/stores/store.types";

export const StoreContext = createContext<StoreMap | undefined>(undefined);

export const IoContext = createContext<IoMap | undefined>(undefined);

export const OrbizSpaceContext = createContext<OrbizSpace | undefined>(undefined);
export const OrbizResolverContext = createContext<OrbizResolver | undefined>(undefined);
// export const CommandContext = createContext<CommandMap | undefined>(undefined);
// export const QueryContext = createContext<QueryMap | undefined>(undefined);