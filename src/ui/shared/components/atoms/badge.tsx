import { CSSProperties, useRef } from "react";
import { TooltipOptions } from "../../../../_shared/ui-utils-facades.types";
import { useTooltip } from "../../hooks/useTooltip";

type BadgeVariant = 'solid' | 'outline' | 'ghost';
type BadgeColor = 'tag' | 'accent' | 'success' | 'warning' | 'error' | 'alt';
type Size = "lg" | "md" | "sm";
type BadgeProps = {
    label: string | number;
    size?: Size,
    variant?: BadgeVariant;
    colorSchema?: BadgeColor;
    pill?: boolean;
    className?: string;
    onClick?: () => void;
    tooltip?: {
        content: string
    } & TooltipOptions
};

export const Badge = ({
    label,
    size = "sm",
    variant = 'solid',
    colorSchema = 'accent',
    pill = true,
    className = '',
    onClick,
    tooltip,
}: BadgeProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    useTooltip(ref, tooltip?.content, tooltip);
    // const ref = useTooltip(tooltip?.content, tooltip);

    const colorMap: Record<BadgeColor, string> = {
        tag: 'rgba(var(--color-purple-rgb), 0.5)',
        accent: 'var(--text-accent)',
        success: 'var(--text-success)',
        warning: 'var(--text-warning)',
        error: 'var(--text-error)',
        alt: 'var(--color-blue)',
    }

    const sizeMap: Record<Size, CSSProperties> = {
        sm: {
            lineHeight: '1.2',
            fontSize: 'var(--font-ui-smaller)',
        },
        md: {
            lineHeight: '1.6',
            fontSize: 'var(--font-ui-medium)',
        },
        lg: {
            lineHeight: '1.8',
            fontSize: 'var(--font-ui-large)',
        }
    }


    // lineHeightとfontSizeを指定して大きさ調整を
    // シンプルなサイズ指定で住むように heightとfontSizeを個別に指定し出すと多分地獄
    const style: CSSProperties = {
        display: 'inline-flex',
        color: colorMap[colorSchema],
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--size-2-1) var(--size-4-2)',
        fontSize: sizeMap[size]["fontSize"],
        fontWeight: 'var(--font-bold)',
        lineHeight: sizeMap[size]["lineHeight"],
        borderRadius: pill ? 'var(--radius-xl)' : 'var(--radius-s)',
        cursor: onClick ? 'pointer' : 'default',
        whiteSpace: 'nowrap'
    };

    if (variant === 'solid') {
        style.backgroundColor = colorSchema === 'tag' ? 'rgba(var(--color-purple-rgb), 0.2)' : colorMap[colorSchema];
        style.color = colorSchema === 'tag' ? 'var(--text-accent)' : 'white';
        style.border = 'none'
    } else if (variant === 'outline') {
        style.backgroundColor = 'transparent';
        style.color = colorMap[colorSchema];
        style.border = `1px solid ${colorMap[colorSchema]}`;
    }

    return (
        <span
            ref={ref}
            style={style}
            className={`badge-atom ${className}`}
            onClick={onClick}
        >
            {label}
        </span>
    )
}