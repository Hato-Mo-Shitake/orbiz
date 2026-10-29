import { CSSProperties } from "react";
import { Icon } from "./icon";
import { HStack } from "./stack";

type PillVariant = "default" | "accent";
type PillProps = {
    label: string,
    onRemove?: () => unknown;
    onClick?: () => unknown;
    variant?: PillVariant;
    className?: string;
};

export const Pill = ({
    label,
    onRemove,
    onClick,
    variant = "default",
    className = ''
}: PillProps) => {

    const colorMap: Record<PillVariant, string> = {
        default: 'var(--pill-color)',
        accent: 'var(--text-accent)',
    }
    const backColorMap: Record<PillVariant, string> = {
        default: 'var(--pill-background)',
        accent: 'var(--pill-background)',
    }

    const weightMap: Record<PillVariant, string> = {
        default: 'var(--pill-weight)',
        accent: 'var(--font-bold)',
    }

    const style: CSSProperties = {

        color: colorMap[variant],
        backgroundColor: backColorMap[variant],
        border: 'var(--pill-border-width) solid var(--pill-border-color)',
        borderRadius: 'var(--pill-radius)',
        padding: 'var(--pill-padding-y) var(--pill-padding-x)',
        fontWeight: weightMap[variant],
        textDecoration: 'var(--pill-decoration)',
        display: 'inline-flex',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.1s ease-in-out',
    };

    // const removeButtonStyle: React.CSSProperties =
    //     variant === "accent"
    //         ? {
    //             backgroundColor: "white",
    //             // color: "var(--interactive-accent)",
    //             // borderRadius: "50%",
    //             // padding: "2px",
    //             // lineHeight: 0,
    //         }
    //         : {};

    return (
        <div
            style={style}
            className={`pill-atom ${className}`}
            onClick={onClick}
        >
            <HStack gap={1} align="center" fullWidth={false}>
                <span>{label}</span>
                {onRemove && (
                    <span
                        className="pill-atom-remove-button"
                        // style={removeButtonStyle}
                        onClick={(e) => {
                            e.preventDefault();
                            onRemove();
                        }}
                    >
                        <Icon name="circle-x" />
                    </span>
                )}
            </HStack>
        </div >
    );
}