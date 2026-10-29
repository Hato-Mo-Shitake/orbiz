import { Checkbox } from "../atoms/checkbox";
import { Stack } from "../atoms/stack";
import { Text } from "../atoms/text";
import { Toggle } from "../atoms/toggle";

type Option = { label: string; value: string; description?: string };

type SwitchGroupProps = {
    // label?: string;
    options: Option[];
    values: string[],
    onChange: (values: string[]) => void;
    type?: 'toggle' | 'checkbox';
    direction?: 'vertical' | 'horizon';
};

export const SwitchGroup = ({
    // label,
    options,
    values,
    onChange,
    type = 'toggle',
    direction = 'vertical',
}: SwitchGroupProps) => {
    const handleSwitch = (val: string) => {
        if (values.includes(val)) {
            onChange(values.filter(v => v !== val));
        } else {
            onChange([...values, val]);
        }
    }

    const SwitchTag = type === 'toggle' ? Toggle : Checkbox;

    return (
        <Stack direction={direction} gap={direction === 'vertical' ? 1 : 3} wrap className="switch-group-molecule">
            {options.map((opt) => (
                <div key={opt.value}>
                    <SwitchTag
                        label={opt.label}
                        checked={values.includes(opt.value)}
                        onChange={() => handleSwitch(opt.value)}
                    />
                    {opt.description && (
                        <Text size='sm' variant='normal'>
                            {opt.description}
                        </Text>
                    )}
                </div>
            ))}
        </Stack>
    );
}