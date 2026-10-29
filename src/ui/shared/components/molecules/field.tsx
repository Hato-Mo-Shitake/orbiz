import { ReactNode } from "react";
import { VStack } from "../atoms/stack";
import { Text } from "../atoms/text";

type LabelSize = 'md' | 'sm' | 'lg';
type FieldProps = {
    label: ReactNode;
    labelSize?: LabelSize;
    description?: string;
    children: ReactNode;
    error?: string;
};

export const Field = ({
    label,
    labelSize = "md",
    description,
    children,
    error
}: FieldProps) => (
    <VStack gap={0.5} className="field-molecule">
        {typeof label === "string"
            ? <Text weight="bold" size={labelSize}>
                {label}
            </Text>
            : label
        }

        {/* <Text weight="bold" size={labelSize}>
            {label}
        </Text> */}


        {description && (
            <Text size="sm">
                {description}
            </Text>
        )}
        {children}
        {error && (
            <Text size="sm" variant="error">
                {error}
            </Text>
        )}
    </VStack>
)