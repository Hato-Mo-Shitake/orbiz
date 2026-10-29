import React, { useRef } from "react";
import { TooltipOptions } from "../../../../_shared/ui-utils-facades.types";
import { useTooltip } from "../../hooks/useTooltip";

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'minimal';
type ButtonProps = {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => unknown;
    variant?: ButtonVariant;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
    tooltip?: {
        content: string
    } & TooltipOptions
};

export const Button = ({
    children,
    onClick,
    variant = 'secondary',
    loading = false,
    disabled = false,
    fullWidth = false,
    className = '',
    tooltip
}: ButtonProps) => {
    const backColorMap: Record<ButtonVariant, string> = {
        primary: 'var(--interactive-accent)',
        secondary: 'var(--interactive-normal)',
        ghost: 'rgba(var(--mono-rgb-100), 0.2)',
        danger: 'rgba(var(--color-red-rgb), 0.9)',
        minimal: 'none'
    }

    const colorMap: Record<ButtonVariant, string> = {
        primary: 'var(--text-on-accent, white)',
        secondary: 'var(--text-normal)',
        danger: 'var(--text-on-accent, white)',
        ghost: 'var(--text-normal)',
        minimal: 'inherit'
    }

    // const isPrimary = variant === 'primary';

    const style: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        backgroundColor: backColorMap[variant],
        color: colorMap[variant],
        width: fullWidth ? '100%' : 'auto',
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        opacity: (disabled || loading) ? 0.5 : 1,
        height: 'var(--input-height)',
        boxSizing: 'border-box',
        padding: '0 var(--size-4-4)',
        borderRadius: 'var(--button-radius)',
        border: 'none',
        fontWeight: 'var(--font-medium)',
        transition: 'background-color 0.1s ease-in-out'
    }

    const ref = useRef<HTMLButtonElement>(null);
    useTooltip(ref, tooltip?.content, tooltip)
    // const ref = useTooltip(tooltip?.content, tooltip);
    if (variant === 'minimal') {
        return <button
            ref={ref}
            className={`btn-atom ${variant} ${className}`}
            style={{
                background: backColorMap[variant],
                color: backColorMap[variant],
                border: 'none',
                boxShadow: 'none',
                padding: 0,
                margin: 0,
                height: 'auto',
                cursor: 'inherit',
                transition: 'opacity 0.1s ease',
            }}
            disabled={disabled || loading}
            onClick={onClick}
        >
            {children}
        </button>
    }

    return (
        <button
            ref={ref}
            className={`btn-atom ${variant} ${className}`}
            style={style}
            disabled={disabled || loading}
            onClick={onClick}
        >
            {children}
        </button>
    );
};