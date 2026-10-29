import { Pill } from "../atoms/pill";
import { HStack } from "../atoms/stack";

type MultiSelectStackProps = {
    values: readonly string[];
    onChange: (values: string[]) => void;
    isAccent?: (value: string) => boolean;
};

export function MultiSelectStack({
    values,
    onChange,
    isAccent,
}: MultiSelectStackProps) {
    if (values.length === 0) return <></>
    return (
        <HStack gap={0.5} wrap>
            {values.map((value) => (
                <Pill
                    key={value}
                    label={value}
                    onRemove={() => onChange(values.filter((v) => v !== value))}
                    variant={isAccent?.(value) ? "accent" : "default"}
                />
            ))}
        </HStack>
    );
}