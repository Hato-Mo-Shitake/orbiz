import { CSSProperties, ReactNode } from "react";

type GridProps = {
    children: ReactNode;
    columns?: number;
    template?: string;
    gap?: 0 | 1 | 2 | 3 | 4 | 5;
    className?: string;
    style?: CSSProperties;
};

export const Grid = ({
    children,
    columns = 2,
    template,
    gap = 1,
    className = '',
    style
}: GridProps) => {
    const gridTemplateColumns = template ?? `repeat(${columns}, minmax(0, 1fr))`;

    return (
        <div
            className={`grid-layout ${className}`}
            style={{
                display: 'grid',
                gridTemplateColumns: gridTemplateColumns,
                gap: gap === 0 ? 0 : `var(--size-4-${gap}),
                width: '100%`,
                alignItems: 'start',
                ...style
            }}
        >
            {children}
        </div>
    );
}