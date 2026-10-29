import { DRecordSrc } from "../../../../../../app/orbiz-resolver.types";
import { useOrbizResolver } from "../../../../../context/use-context";

export function useGetDRecord() {
    const resolver = useOrbizResolver();

    return (src: DRecordSrc) => {
        return resolver.findDRecord(src)
    }
}

export function useGetDRecordsByYM() {
    const resolver = useOrbizResolver();

    return (src: string | { y: number, m: number }) => {
        return resolver.getDRecordsByYM(src);
    }
}