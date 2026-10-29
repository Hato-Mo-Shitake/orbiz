// import { useEffect, useRef } from "react";
// import { UiUtilsFacades } from "../../../_shared/ui-utils-facades";
// import { TooltipOptions } from "../../../_shared/ui-utils-facades.types";

// export const useTooltip = (content?: string, options?: TooltipOptions) => {
//     const ref = useRef<HTMLElement|null>(null);

//     useEffect(() => {
//         if (ref.current && content) {
//             UiUtilsFacades.setTooltip(ref.current, content, options)
//         }
//     }, [content, options])

//     return ref;
// }

import { useEffect } from "react";
import { UiUtilsFacades } from "../../../_shared/ui-utils-facades";
import { TooltipOptions } from "../../../_shared/ui-utils-facades.types";

export function useTooltip<T extends HTMLElement>(
    ref: { current: T | null },
    content?: string,
    options?: TooltipOptions,
): void {
    useEffect(() => {
        if (ref.current && content) {
            UiUtilsFacades.setTooltip(ref.current, content, options);
        }
    }, [ref, content, options]);
}