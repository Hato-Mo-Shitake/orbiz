import React, { useRef } from "react";
import { TooltipOptions } from "../../../../_shared/ui-utils-facades.types";
import { useTooltip } from "../../hooks/useTooltip";

type TextSize = 'md' | 'sm' | 'lg';
type TextVariant = 'normal' | 'muted' | 'faint' | 'accent' | 'error' | 'warning' | 'success' | 'link';
type TextWeight = 'normal' | 'bold';

type TextProps = {
    children: React.ReactNode;
    variant?: TextVariant;
    size?: TextSize;
    weight?: TextWeight;
    truncate?: boolean;
    onClick?: (evt: React.MouseEvent) => unknown;
    className?: string;
    tooltip?: {
        content: string
    } & TooltipOptions
};

export const Text = ({
    children,
    variant = 'normal',
    size = 'md',
    weight = 'normal',
    onClick,
    truncate = false,
    className = '',
    tooltip,
}: TextProps) => {
    const ref = useRef<HTMLAnchorElement>(null);
    useTooltip(ref, tooltip?.content, tooltip);
    // const ref = useTooltip(tooltip?.content, tooltip);
    const sizeMap: Record<TextSize, string> = {
        md: 'var(--font-ui-medium)',
        sm: 'var(--font-ui-smaller)',
        lg: 'var(--font-ui-large)',
    }

    const colorMap: Record<TextVariant, string> = {
        normal: 'var(--text-normal)',
        muted: 'var(--text-muted)',
        faint: 'var(--text-faint)',
        accent: 'var(--text-accent)',
        error: 'var(--text-error)',
        warning: 'var(--text-warning)',
        success: 'var(--text-success)',
        link: '',
    };

    const weightMap: Record<TextWeight, string> = {
        normal: 'var(--font-normal)',
        bold: 'var(--font-bold)',
    }

    const style: React.CSSProperties = {
        fontSize: sizeMap[size],
        color: colorMap[variant],
        fontWeight: weightMap[weight],
        lineHeight: 'var(--line-height-normal)',
        ...(truncate && {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block'
        }),
    };

    if (variant === 'link') {
        return (
            <a
                ref={ref}
                onClick={onClick}
                style={style}
                className={`text-atom ${className}`}
            >
                {children}
            </a>
        )
    } else {
        return (
            <span
                ref={ref}
                onClick={onClick}
                style={style}
                className={`text-atom ${className}`}
            >
                {children}
            </span>
        );
    }
}