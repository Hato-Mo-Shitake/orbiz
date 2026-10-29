/* eslint-disable no-restricted-imports -- bootstrap内は許可 */

import { Plugin } from "obsidian";
import { IoMap } from "../app/io/io.types";
import { OrbizResolver } from "../app/orbiz-resolver.types";
import { OrbizSpace } from "../app/orbiz-space.types";
import { StoreMap } from "../app/stores/store.types";
import { IssueView } from "../infra/internal/obsidian/views/issue-view";
import { LatestActiveOrbizFileSideView } from "../infra/internal/obsidian/views/latest-active-orbiz-file-side-view";
import { LogView } from "../infra/internal/obsidian/views/log-view";
import { OrbizHomeView } from "../infra/internal/obsidian/views/orbiz-home";

export const registerUi = (
    plugin: Plugin,
    storeMap: StoreMap,
    ioMap: IoMap,
    orbizResolver: OrbizResolver,
    orbizSpace: OrbizSpace,
) => {

    plugin.registerView(
        "VIEW_TYPE_Orbiz_Home",
        (leaf) => new OrbizHomeView(leaf,
            storeMap,
            orbizResolver,
            orbizSpace
        )
    );

    plugin.registerView(
        "VIEW_TYPE_Latest_Active_OrbizFile_Side",
        (leaf) => new LatestActiveOrbizFileSideView(leaf,
            storeMap,
            ioMap,
            orbizResolver,
            orbizSpace
        )
    );

    plugin.registerView(
        "VIEW_TYPE_Issue",
        (leaf) => new IssueView(leaf,
            storeMap,
            orbizResolver,
            orbizSpace
        )
    );

    plugin.registerView(
        "VIEW_TYPE_Log",
        (leaf) => new LogView(leaf,
            storeMap,
            orbizResolver,
            orbizSpace
        )
    );
}

/* eslint-enable -- 終了 */