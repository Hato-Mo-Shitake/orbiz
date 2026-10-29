import React from "react";

type StackProps = {
    children: React.ReactNode;
    direction?: 'horizon' | 'vertical';
    gap?: 0 | 0.5 | 1 | 2 | 3 | 4 | 6 | 8;
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between';
    fullWidth?: boolean;
    wrap?: boolean;
    className?: string;
    style?: React.CSSProperties,
};

export const Stack = ({
    children,
    direction = "vertical",
    gap = 2,
    align = 'start',
    justify = 'start',
    fullWidth = false,
    wrap = true,
    className = '',
    style
}: StackProps) => {
    const gapStyle = gap == 0
        ? '0px'
        : (
            gap == 0.5
                ? `var(--size-2-1)`
                : `var(--size-4-${gap})`
        )

    if (direction === "horizon") {
        align = "center";
    }
    const mergedStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: gapStyle,
        alignItems: align === 'start' || align === 'end' ? `flex-${align} ` : align,
        justifyContent: justify === 'between' ? 'space-between' : (justify === 'start' || justify === 'end' ? `flex-${justify} ` : justify),
        width: fullWidth ? '100%' : 'auto',
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style
    }

    return <div style={mergedStyle} className={`stack-atom ${className}`}>{children}</div>
}

export const VStack = (props: Omit<StackProps, 'direction'>) => <Stack {...props} direction='vertical'></Stack>;
export const HStack = (props: Omit<StackProps, 'direction'>) => <Stack {...props} direction='horizon'></Stack>;