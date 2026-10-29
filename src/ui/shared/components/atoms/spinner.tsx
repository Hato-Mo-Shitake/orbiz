import { CSSProperties } from "react";
import { VStack } from "./stack";

type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerProps = {
    size?: SpinnerSize,
    message?: string,
    centered?: boolean,
    className?: string,
};

export const Spinner = ({
    size = 'md',
    message,
    centered = false,
    className = '',
}: SpinnerProps) => {
    const sizeMap: Record<SpinnerSize, string> = {
        sm: 'var(--size-4-2)',
        md: 'var(--size-4-4)',
        lg: 'var(--size-4-8)',
    };

    const spinnerElement = (
        <div
            className={`spinner-atom ${className}`}
            style={{
                width: sizeMap[size],
                height: sizeMap[size],
                border: '3px solid var(--background-modifier-border)',
                borderTop: '3px solid var(--interactive-accent)',
                borderRadius: '50%',
                animation: 'spinner-atom-spin 0.8s linear infinite',
                display: 'inline-block',
            }}
        />
    );

    const containerStyle: CSSProperties = centered ? {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: 'var(--size-4-8)',
        flexGrow: 1,
    } : {};

    return (
        <div style={containerStyle}>
            <VStack align="center" gap={1}>
                {spinnerElement}
                {message && <span style={{ fontSize: 'var(--font-ui-smaller)', color: 'var(--text-muted)' }}>{message}</span>}
            </VStack>
        </div>
    );
};