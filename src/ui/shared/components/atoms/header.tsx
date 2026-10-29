import React from "react";

type HeaderLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeaderProps = {
    children: React.ReactNode;
    level: HeaderLevel;
    color?: 'normal' | 'accent' | 'error';
    align?: 'left' | 'center' | 'right';
    noMargin?: boolean,
    className?: string;
};

export const Header = ({
    children,
    level,
    color,
    align = 'left',
    noMargin = false,
    className = '',
}: HeaderProps) => {
    const Tag = `h${level}` as const;

    const style: React.CSSProperties = {
        color: color ? `var(--text-${color})` : `var(--h${level}-color)`,
        fontSize: `var(--h${level}-size)`,
        fontFamily: `var(--h${level}-font)`,
        fontWeight: `var(--h${level}-weight)`,
        lineHeight: `var(--h${level}-line-height)`,
        fontStyle: `var(--h${level}-style)`,
        fontVariant: `var(--h${level}-variant)`,
        textAlign: align,
        marginTop: noMargin ? 0 : `var(--heading-spacing)`,
        marginBottom: noMargin ? 0 : `0.5rem`,
        display: 'block',
    }

    return (
        <Tag style={style} className={`header-atom ${className} h${level}`}>
            {children}
        </Tag>
    )
}