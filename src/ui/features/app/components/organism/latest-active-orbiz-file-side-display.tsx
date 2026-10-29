import { NotePath } from "../../../../../domain/note";
import { DRecordPath } from "../../../../../domain/note-sub/d-record";
import { Text } from "../../../../shared/components/atoms/text";
import { useLatestActiveOrbizFilePath } from "../../hooks/use-latest-active-orbiz-file-path";
import { DRecordSideDisplay } from "./d-record-side-display";
import { NoteSideDisplay } from "./note-side-display";

export const LatestActiveOrbizFileSideDisplay = () => {
    const orbizFilePath = useLatestActiveOrbizFilePath();

    const Display = () => {
        if (orbizFilePath === undefined) return <Text variant="error">
            Not found active orbiz-file
        </Text>

        if (orbizFilePath instanceof NotePath) {
            return <NoteSideDisplay
                src={orbizFilePath}
            />
        } else if (orbizFilePath instanceof DRecordPath) {
            return <DRecordSideDisplay
                src={orbizFilePath}
            />
        } else {
            throw new Error("Unexpected process in LatestActiveOrbizFileSideDisplay")
        }
    }

    return (
        <Display />
    )
}
