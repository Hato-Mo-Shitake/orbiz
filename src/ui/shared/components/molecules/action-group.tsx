import { Button } from "../atoms/button";
import { LoadingWrapper } from "../atoms/loading-wrapper";
import { HStack } from "../atoms/stack";

type ActionGroupProps = {
    primaryLabel: string;
    onPrimary: () => void;
    secondaryLabel?: string;
    onSecondary: () => void;
    isProcessing?: boolean;
    isDanger?: boolean;
};

export const ActionGroup = ({
    primaryLabel,
    onPrimary,
    secondaryLabel,
    onSecondary,
    isProcessing = false,
    isDanger
}: ActionGroupProps) => (
    <HStack justify="end" gap={2} fullWidth className="action-group-molecule">
        <Button
            variant={isDanger ? 'danger' : 'primary'}
            onClick={onPrimary}
            disabled={isProcessing}
        >
            <LoadingWrapper
                isLoading={isProcessing}
                label={primaryLabel}
            />
            {/* {isProcessing && (
                <div style={{ position: 'absolute' }}>
                    <Spinner />
                </div>
            )}
            <span style={{
                visibility: isProcessing ? 'hidden' : 'visible'
            }}>
                {primaryLabel}
            </span> */}
        </Button>
        <Button onClick={onSecondary} disabled={isProcessing}>
            {secondaryLabel}
        </Button>
    </HStack>
)