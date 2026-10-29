import { ReactNode } from "react";
import { HStack, VStack } from "../atoms/stack";
import { Text } from "../atoms/text";

type LabelSize = 'md' | 'sm' | 'lg';
type FieldProps = {
    label: string;
    labelSize?: LabelSize;
    description?: string;
    children: ReactNode;
    error?: string;
};

export const InlineField = ({
    label,
    labelSize = "md",
    children,
    error
}: FieldProps) => (
    <VStack gap={0.5} className="inline-field-molecule">
        <HStack>
            <Text weight="bold" size={labelSize}>
                {label}
            </Text>
            {children}
        </HStack>
        {error && (
            <Text size="sm" variant="error">
                {error}
            </Text>
        )}
    </VStack>
)