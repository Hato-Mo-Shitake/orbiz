import { HStack } from "./stack";
import { Text } from "./text";

type ToggleProps = {
    label?: string,
    checked: boolean,
    size?: 'medium' | 'small';
    onChange: (checked: boolean) => void;
    disabled?: boolean,
    className?: string;
};

export const Toggle = ({
    label,
    checked,
    size = 'medium',
    onChange,
    disabled = false,
    className = '',
}: ToggleProps) => {
    const isSmall = size === 'small';

    // const containerStyle: React.CSSProperties = {
    //     width: isSmall ? 'var(--toggle-s-width)' : 'var(--toggle-width)',
    //     borderWidth: isSmall ? 'var(--toggle-s-border-width)' : 'var(--toggle-border-width)',
    //     backgroundColor: checked ? 'var(--interactive--accent)' : 'var(--background-modifier-border)',
    //     borderRadius: 'var(--toggle-radius)',
    //     transition: 'background-color 0.15s ease-in-out',

    //     // 意味あるのか検証
    //     // ['--toggle-thumb-color' as any]: 'var(--toggle-thumb-color)',

    //     cursor: disabled ? 'not-allowed' : 'pointer',
    //     opacity: disabled ? 0.5 : 1,
    //     position: 'relative',
    //     display: 'block'
    // }
    const padding = 3;
    const width = isSmall ? 'var(--toggle-s-width)' : 'var(--toggle-width)';
    const height = `calc(${isSmall ? 'var(--toggle-s-thumb-height)' : 'var(--toggle-thumb-height)'} + ${padding}px * 2)`;

    const thumbWidth = isSmall ? 'var(--toggle-s-thumb-width)' : 'var(--toggle-thumb-width)';
    const thumbHeight = isSmall ? 'var(--toggle-s-thumb-height)' : 'var(--toggle-thumb-height)';

    const checkedLeft = `calc(${width} - ${thumbWidth} - ${padding}px)`

    return (
        <HStack gap={2} align="center" fullWidth={false} className={className}>
            <div
                className={`toggle-atom ${checked ? 'is-enabled' : ''} ${disabled ? 'is-disabled' : ''}`}
                onClick={() => !disabled && onChange(!checked)}
                style={{
                    width: `${width}`,
                    height: `${height}`,
                    backgroundColor: checked ? 'var(--interactive-accent)' : 'var(--background-modifier-border)',
                    borderRadius: 'var(--toggle-radius)',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.5 : 1,
                    position: 'relative',
                    display: 'block',
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        width: `${thumbWidth}`,
                        height: `${thumbHeight}`,
                        backgroundColor: `var(--toggle-thumb-color)`,
                        borderRadius: 'var(--toggle-thumb-radius)',
                        position: "absolute",
                        top: `${padding}px`,
                        // left: checked ? `${width - thumbSize - padding}px` : `${padding}px`,
                        left: checked ? `${checkedLeft}` : `${padding}px`,
                        transition: "left 0.2s cubic-bezier(-.4, 0, 0.2, 1)",
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }}>
                </div>
                {/* <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => { }}
                    style={{ display: 'none' }}
                /> */}
            </div>
            {label && (
                <label
                    onClick={() => !disabled && onChange(!checked)}
                    style={{ cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none' }}
                >
                    <Text variant={disabled ? 'muted' : 'normal'}>
                        {label}
                    </Text>
                </label>
            )}
        </HStack>
    );
}