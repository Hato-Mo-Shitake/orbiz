import { NoteSrc } from "../../../../../app/orbiz-resolver.types";
import { useOrbizResolver } from "../../../../context/use-context";

export function useGetNote() {
    const resolver = useOrbizResolver();

    return (src: NoteSrc | undefined) => {
        return src ? resolver.findNote(src) : undefined;
    }
}