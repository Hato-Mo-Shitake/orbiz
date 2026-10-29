import { ModalProps } from "../../app/modal.types";
import { Button } from "../shared/components/atoms/button";
import { VStack } from "../shared/components/atoms/stack";

type AlertModalProps = { message: string }

function AlertModal({
    message, onClose
}: AlertModalProps & { onClose: () => void }) {
    return <VStack>
        {message}
        <Button onClick={onClose}>
            Close
        </Button>
    </VStack>
}

export function renderAlertModal({
    message,
    onClose
}: ModalProps<AlertModalProps>) {
    return <AlertModal
        message={message}
        onClose={onClose}
    />
}