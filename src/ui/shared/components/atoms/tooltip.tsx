import React, { useEffect, useRef } from "react";
import { UiUtilsFacades } from "../../../../_shared/ui-utils-facades";

type TooltipProps = {
    content: string;
    children: React.ReactElement;
    classes?: string[],
    gap?: number,
    delay?: number,
    position?: 'top' | 'bottom' | 'left' | 'right';
};

export const Tooltip = ({
    content,
    children,
    classes,
    gap,
    delay,
    position = 'top'
}: TooltipProps) => {
    const targetRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (targetRef.current) {
            UiUtilsFacades.setTooltip(targetRef.current, content, {
                delay: delay,
                classes: classes,
                gap: gap,
                placement: position
            });
        }
        return () => {
            // クリーンナップ処理をしたいときはここに
        };
    }, [content, classes, gap, delay, position])

    return (
        <span className="tooltip-atom" ref={targetRef} style={{ display: 'inline-block' }}>
            {children}
        </span>
    );
};