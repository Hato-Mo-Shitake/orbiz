import { Radio } from "../atoms/radio";
import { Stack } from "../atoms/stack";
import { Text } from "../atoms/text";

type Option = { label: string; value: string; description?: string };

type RadioGroupProps = {
    name?: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    direction?: 'vertical' | 'horizon';
};

export const RadioGroup = ({
    name,
    options,
    value,
    onChange,
    direction = 'vertical'
}: RadioGroupProps) => {
    return (
        <Stack direction={direction} gap={direction === 'vertical' ? 1 : 3} wrap className="radio-group-molecule">
            {options.map((opt => (
                <div key={opt.value}>
                    <Radio
                        name={name || ""}
                        label={opt.label}
                        value={opt.value}
                        checked={value === opt.value}
                        onChange={() => onChange(opt.value)}
                    />
                    {opt.description && (
                        <Text size='sm'>
                            {opt.description}
                        </Text>
                    )}
                </div>
            )))}
        </Stack>
    )
}