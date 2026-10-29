import { HStack, VStack } from "../atoms/stack";
import { Text } from "../atoms/text";

type ProgressBarProps = {
    value: number; // 0 ~ 100
    labelMin?: string;
    labelMax?: string;
    color?: string;
};

export const ProgressBar = ({
    value,
    labelMin,
    labelMax,
    color,
}: ProgressBarProps) => {
    const percent = Math.min(Math.max(value, 0), 100);

    return (
        <VStack gap={1} fullWidth>
            {(labelMin || labelMax) && (
                <HStack gap={0.5} justify="between" align="end">
                    {labelMin && <Text weight="bold">{labelMin}</Text>}
                    {labelMax && <Text weight="bold">{labelMax}</Text>}
                </HStack>
            )}
            <div style={{
                width: '100%',
                height: 'var(--size-4-2)',
                backgroundColor: 'var(--background-modifier-border)',
                borderRadius: 'var(--radius-s)',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${percent}%`,
                    height: '100%',
                    backgroundColor: color || 'var(--interactive-accent)',
                    transition: 'width 0.3s ease-out'
                }}>
                </div>
            </div>
        </VStack>
    );
}