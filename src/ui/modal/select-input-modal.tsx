import { ResultModalProps } from "../../app/modal.types";
import { Header } from "../shared/components/atoms/header";
import { VStack } from "../shared/components/atoms/stack";
import { SegmentedControl } from "../shared/components/molecules/segmented-control";

type Props = {
    title?: string,
    options: { label: string, value: string }[]
    onSubmit: (value: string) => void
}

export function SelectInputModal({
    title, options, onSubmit
}: Props) {
    return (
        <VStack>
            {title && <Header level={5}>{title}</Header>}
            <SegmentedControl
                options={options}
                value={""}
                onChange={onSubmit}
            />
        </VStack>
    )
}

type BaseProps = {
    title?: string,
    options: { label: string, value: string }[]
}
type Result = string;

export function renderSelectInputModal({
    title,
    options,
    onSubmit,
    onClose
}: ResultModalProps<BaseProps, Result>) {
    return <SelectInputModal
        title={title}
        options={options}
        onSubmit={onSubmit}
    />

}