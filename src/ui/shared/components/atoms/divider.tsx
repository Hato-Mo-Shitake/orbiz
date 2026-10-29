import React from "react";

type DividerProps = {
    margin?: string | number;
    vertical?: boolean;
    className?: string;
};

export const Divider = ({
    margin = 'var(--size-4-4)',
    vertical = false,
    className = '',
}: DividerProps) => {
    const style: React.CSSProperties = {
        backgroundColor: 'var(--background-modifier-border)',
        flexShrink: 0,
        border: 'none',
    };

    if (vertical) {
        style.width = 'var(--border-width)';
        style.height = '100px';
        style.margin = `0 ${typeof margin === 'number' ? margin + 'px' : margin}`;
    } else {
        style.width = '100%';
        style.height = 'var(--border-width)';
        style.margin = `${typeof margin === 'number' ? margin + 'px' : margin} 0`
    }

    return <hr className={`divider-atom ${className}`} style={style} />
}