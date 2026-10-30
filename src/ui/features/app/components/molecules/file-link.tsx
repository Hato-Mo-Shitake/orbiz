import { MouseEvent } from "react";
import { UiUtilsFacades } from "../../../../../_shared/ui-utils-facades";
import { useOrbizResolver, useOrbizSpace } from "../../../../context/use-context";
import { Text } from "../../../../shared/components/atoms/text";

type Props = {
    label: string,
    path: string,
    onOpened?: (path: string) => void,
}

export const FileLink = ({ label, path, onOpened }: Props) => {
    const resolver = useOrbizResolver();
    const space = useOrbizSpace();

    const existsFile = resolver.existsFile(path);

    const handleLinkClick = async (evt: MouseEvent) => {

        let opened = false;
        if (evt.metaKey) {
            // コマンドキーを押しながらの時
            opened = await space.openFile(path, "tab");
        } else if (evt.shiftKey) {
            opened = await space.openFile(path, "window");
        } else {
            opened = await space.openFile(path);
        }
        if (opened) {
            onOpened?.(path);
        } else {
            UiUtilsFacades.alert(`Not found file, path: ${path.toString()}`);
        }
    }

    return (
        <Text variant={existsFile ? "link" : "normal"} onClick={handleLinkClick}>
            {label}
        </Text>
    )
}