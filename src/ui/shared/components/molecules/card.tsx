import { ReactNode } from "react";
import { Badge } from "../atoms/badge";
import { Divider } from "../atoms/divider";
import { HStack, VStack } from "../atoms/stack";
import { Text } from "../atoms/text";

type CardProps = {
    title: string,
    status: string,
    children: ReactNode,
};

export const Card = ({
    title,
    status,
    children
}: CardProps) => (
    <VStack
        fullWidth
        gap={0}
        style={{
            border: '1px solid var(--background-modifier-border)',
            borderRadius: 'var(--radius-m)',
            padding: 'var(--size-4-3)'
        }}
    >
        <HStack justify="center" align="center" fullWidth>
            <Text size="lg" weight="bold">{title}</Text>
            <Badge colorSchema="accent" label={status} />
        </HStack>
        <Divider />
        <div style={{ padding: 'var(--size-4-3)' }}>{children}</div>
    </VStack>
);