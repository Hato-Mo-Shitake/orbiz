import React from "react";

type PopoverProps = {
    children: React.ReactNode;
    width?: string | number;
    maxHeight?: string | number
    className?: string,
}

export const Popover = ({
    children,
    width,
    maxHeight,
    className = '',
}: PopoverProps) => {
    const style: React.CSSProperties = {
        position: 'absolute',
        zIndex: 'var(--layer-menu)',
        width: width || 'var(--popover-width, 300px)',
        height: 'var(--popover-height, auto)',
        maxHeight: maxHeight || 'var(--popover-max-height, 400px)',
        fontSize: 'var(--popover-font-size, inherit)',
        backgroundColor: 'var(--background-secondary)',
        border: '1px solid var(--background-modifier-border)',
        borderRadius: 'var(--radius-m)',
        boxShadow: 'var(--shadow-m, var(--bases-cards-shadow))',
        overflowY: 'auto',
        marginTop: '4px',
    };

    return (<div className={`popover-atom ${className}`} style={style}>
        {children}
    </div>)
}