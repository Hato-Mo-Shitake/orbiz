import React from "react";

type TextInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: 'text' | 'password' | 'number' | 'email';
    isSearch?: boolean;
    isError?: boolean;
    disabled?: boolean;
    onEnter?: () => void;
    className?: string;
    onFocus?: () => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    style?: React.CSSProperties;
};

export const TextInput = ({
    value,
    onChange,
    placeholder,
    type = 'text',
    isSearch = false,
    isError = false,
    disabled = false,
    onEnter,
    onKeyDown,
    onFocus,
    className = '',
    style,
}: TextInputProps) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(e);
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            if (onEnter) {
                onEnter();
            }
        }
    };

    const baseStyle: React.CSSProperties = {
        height: 'var(--input-height)',
        width: '100%',
        padding: '0 var(--size-4-2)',

        color: 'var(--text-normal)',

        fontWeight: 'var(--input-font-weight)',
        fontSize: 'var(--text-normal)',

        borderRadius: isSearch ? 'var(--radius-xl)' : 'var(--input-radius)',
        borderWidth: 'var(--input-font-weight)',
        borderStyle: 'solid',
        borderColor: isError ? 'var(--text-error)' : 'var(--background-modifier-border)',

        outline: 'none',
        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    };

    const mergedStyle = React.useMemo(() => {
        return {
            ...baseStyle,
            ...style
        }
    }, [style])

    return (
        <input
            type={type}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            className={`text-input-atom ${className}`}
            style={mergedStyle}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
        />
    );
}