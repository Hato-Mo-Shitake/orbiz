import { ReactNode } from "react";
import { Header } from "../atoms/header";
import { VStack } from "../atoms/stack";
import { Text } from "../atoms/text";

type SectionProps = {
    title: string;
    description?: string;
    children: ReactNode;
};

export const Section = ({
    title,
    description,
    children
}: SectionProps) => (
    <VStack gap={2} fullWidth className="section-layout" style={{ margin: 'var(--size-4-1)' }}>
        <VStack gap={0.5}>
            <Header level={3}>{title}</Header>
            {description && <Text size="sm">{description}</Text>}
        </VStack>
        <VStack gap={1} fullWidth>
            {children}
        </VStack>
    </VStack>
);