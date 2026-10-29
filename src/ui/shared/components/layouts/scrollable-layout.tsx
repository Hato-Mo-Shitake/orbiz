import { ReactNode } from "react";
import { Divider } from "../atoms/divider";
import { VStack } from "../atoms/stack";

type ScrollableLayoutProps = {
    header?: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
    maxHeight?: number | string;
    backgroundColor?: "none" | "alt";
    fullWidth?: boolean
};

export const ScrollableLayout = ({
    header,
    footer,
    children,
    maxHeight,
    backgroundColor = "none",
    fullWidth = false
}: ScrollableLayoutProps) => {

    const colorMap = {
        "none": undefined,
        "alt": "var(--background-secondary-alt)"
    }

    const style = {
        overflow: 'hidden',
        padding: 'var(--size-4-2)',
        backgroundColor: colorMap[backgroundColor]
    }
    return (<>
        <VStack
            gap={1}
            fullWidth={fullWidth}
            style={style}
            className="scrollable-layout"
        >
            {header && (
                <VStack gap={0} fullWidth={fullWidth}>
                    <div style={{ padding: 'var(--size-4-1)' }}>
                        {header}
                    </div>
                    <Divider />
                </VStack>
            )}
            <div style={{
                flex: 1,
                overflowY: 'scroll',
                maxHeight: maxHeight ? (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight) : '50dvh'
            }}>
                {children}
            </div>
            {footer && (
                <VStack gap={0} fullWidth={fullWidth}>
                    <Divider />
                    <div style={{ padding: 'var(--size-4-1)' }}>
                        {footer}
                    </div>
                </VStack>
            )}
        </VStack>
    </>)
}