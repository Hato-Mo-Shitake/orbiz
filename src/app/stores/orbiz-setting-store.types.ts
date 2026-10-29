import { Listener, Unsubscribe } from "../../_shared/types";

export type OrbizSetting = {
    spaceName: string
}

export interface OrbizSettingStore extends OrbizSettingStoreReader {
    initialize(): Promise<void>;
    saveSpaceName(spaceName: string): Promise<void>;
}

export interface OrbizSettingStoreReader {
    get(): OrbizSetting;
    subscribe(listener: Listener): Unsubscribe;
}