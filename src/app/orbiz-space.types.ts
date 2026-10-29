import { Path } from "../_shared/path.vo";
import { ModalService } from "./modal.types";
import { viewTypeList } from "./orbiz.const";
import { OrbizFilePath } from "./orbiz.types";

export type ViewType = typeof viewTypeList[number];

export interface OrbizSpace {
    modal: ModalService;
    openSideView(type: ViewType, position: "right" | "left"): Promise<void>;
    openMainView(type: ViewType): Promise<void>;

    openFile(
        path: string | Path | OrbizFilePath,
        newLeaf?: "tab" | "window" | "split"
    ): Promise<boolean>;
}