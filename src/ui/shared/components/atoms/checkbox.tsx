import { HStack } from "./stack";
import { Text } from "./text";

type CheckboxProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    id?: string;
    className?: string;
};

export const Checkbox = ({
    checked,
    onChange,
    label,
    disabled = false,
    id,
    className = '',
}: CheckboxProps) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 11)}`;

    return (
        <HStack gap={0} align="center" fullWidth={false} className={className}>
            <input
                type="checkbox"
                id={checkboxId}
                checked={checked}
                disabled={disabled}
                onChange={(e) => onChange(e.target.checked)}
                className="checkbox-atom"
                style={{
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    accentColor: 'var(--checkbox-color)'
                }}
            />
            {label && (
                <label htmlFor={checkboxId} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
                    <Text variant={disabled ? 'faint' : 'normal'}>
                        {label}
                    </Text>
                </label>
            )}
        </HStack>
    );
};