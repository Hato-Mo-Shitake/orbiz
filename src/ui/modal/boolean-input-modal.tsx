import { ResultModalProps } from "../../app/modal.types";
import { Button } from "../shared/components/atoms/button";
import { Header } from "../shared/components/atoms/header";
import { HStack, VStack } from "../shared/components/atoms/stack";


type BaseProps = {
    title?: string,
}


function BooleanInputModal({
    title,
    onSubmit
}: BaseProps & { onSubmit: (value: boolean) => void }) {

    const handleClick = (value: boolean) => {
        onSubmit(value);
    }

    return (
        <VStack>
            {title && <Header level={5}>{title}</Header>}
            <HStack>
                <Button onClick={() => handleClick(true)}>Yes</Button>
                <Button onClick={() => handleClick(false)}>No</Button>
            </HStack>
        </VStack>
    )
}

export function renderBooleanInputModal({
    title,
    onSubmit,
    onClose
}: ResultModalProps<BaseProps, boolean>) {
    return <BooleanInputModal
        title={title}
        onSubmit={onSubmit}
    />
}