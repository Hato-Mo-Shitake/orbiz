import { HStack } from "./stack";
import { Text } from "./text";

type RadioProps = {
    label: string;
    name: string;
    value: string;
    checked: boolean;
    onChange: (value: string) => void;
    disabled?: boolean;
    className?: string;
};

export const Radio = ({
    label,
    name,
    value,
    checked,
    onChange,
    disabled = false,
    className = '',
}: RadioProps) => {
    const id = `radio-${name}-${value}`;

    return (
        <HStack gap={0.5} align="center" fullWidth={false} className={`radio-atom ${className}`}>
            <input
                type="radio"
                id={id}
                name={name}
                value={value}
                checked={checked}
                disabled={disabled}
                onChange={() => onChange(value)}
                style={{
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    accentColor: 'var(--interactive-accent)',
                    width: 'var(--size-4-4)',
                    height: 'var(--size-4-4)'
                }}
            />
            <label
                htmlFor={id}
                style={{
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    userSelect: 'none',
                }}
            >
                <Text variant={disabled ? 'faint' : 'normal'} >
                    {label}
                </Text>
            </label>
        </HStack>
    )
}