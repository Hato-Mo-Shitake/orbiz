import { anyNoteDateKeys } from "../../../note";

export const dRecordNoteIdsKeys = [
    ...anyNoteDateKeys,
    "modifiedAt"
] as const;