import React, { useEffect, useRef } from "react";
import { UiUtilsFacades } from "../../../../_shared/ui-utils-facades";

type IconSize = 'sm' | 'md' | 'lg';

type Props = {
    name: string
    size?: IconSize
}

export const Icon: React.FC<Props> = ({ name, size = "md" }) => {
    const sizeMap: Record<IconSize, string> = {
        sm: 'var(--size-4-4)',
        md: 'var(--size-4-6)',
        lg: 'var(--size-4-9)',
    };

    const ref = useRef<HTMLSpanElement | null>(null)

    useEffect(() => {
        if (ref.current) {
            UiUtilsFacades.setIcon(ref.current, name);
            ref.current.style.setProperty("--icon-size", sizeMap[size]);
        }
    }, [name])


    return (
        <span
            ref={ref}
            className="icon-atom"
            style={{
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                // width: size,
                // height: size,
            }}
        />
    )
}