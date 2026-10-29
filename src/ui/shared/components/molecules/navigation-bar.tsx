import { ReactNode } from "react";

type NavigationBarProps = {
    items: ReactNode[];
    direction?: 'horizon' | 'vertical';
    gap?: 0 | 0.5 | 1 | 2 | 3 | 4 | 5 | 6;
    wrap?: boolean;
    maxWidth?: string | number;
    className?: string;
};

export const NavigationBar = ({
    items,
    direction = 'horizon',
    gap = 1,
    wrap = false,
    maxWidth,
    className
}: NavigationBarProps) => {
    const isHorizon = direction === 'horizon';
    const flexDirection = isHorizon ? 'row' : 'column';

    return (
        <div
            className={`navigation-bar-molecule ${className}`}
            style={{
                display: "flex",
                flexDirection: flexDirection,
                width: isHorizon ? '100%' : 'auto',
                maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
                height: isHorizon ? (wrap ? 'auto' : 'var(--size-4-9)') : '100%',
                minHeight: isHorizon ? 'var(--size-4-9)' : 'auto',
                padding: 'var(--size-4-2)',
                backgroundColor: 'var(--background-secondary)',
                borderBottom: isHorizon ? 'var(--border-width) solid var(--background-modifier-border)' : 'none',
                borderRight: isHorizon ? 'none' : 'var(--border-width) solid var(--background-modifier-border)',
                gap: gap === 0 ? '0px'
                    : (gap === 0.5 ? 'var(--size-2-1)' : `var(--size-4-${gap})`),
                flexWrap: wrap ? 'wrap' : 'nowrap',
                overflowX: isHorizon && !wrap ? 'auto' : 'hidden',
                overflowY: !isHorizon && !wrap ? 'auto' : 'hidden',
                alignItems: isHorizon ? 'center' : 'stretch',
            }}
        >
            {items.map((item, index) => (
                <div
                    key={index}
                    style={{
                        flexShrink: 0,
                        maxWidth: '100%',
                        overflow: 'hidden',
                    }}
                >
                    {item}
                </div>
            ))}
        </div>
    );
}