import { useState } from "react";
import { UiUtilsFacades } from "../../_shared/ui-utils-facades";
import { ResultModalProps } from "../../app/modal.types";
import { NoteName } from "../../domain/note";
import { Button } from "../shared/components/atoms/button";
import { Header } from "../shared/components/atoms/header";
import { VStack } from "../shared/components/atoms/stack";
import { Text } from "../shared/components/atoms/text";
import { TextInput } from "../shared/components/atoms/text-input";

type Props = {
    onSubmit: (name: NoteName) => void,
    title?: string,
    prohibitedName?: string
}

function NoteNameInputModal({ title, prohibitedName, onSubmit }: Props) {
    const [name, setName] = useState("");

    const handleSubmit = (name: string) => {
        const noteName = NoteName.tryFrom(name);
        if (!noteName) {
            UiUtilsFacades.alert("Invalid Note Name");
            return;
        }

        if (prohibitedName === noteName.value) {
            UiUtilsFacades.alert("Prohibit Note Name");
            return;
        }

        onSubmit(noteName);
    }
    return (<>
        <VStack>
            <Header level={2}>{title ? title : "Input Note Name"}</Header>
            <TextInput value={name} onChange={setName} />
            {prohibitedName && <Text variant="error">prohibitedName: {prohibitedName}</Text>}
            <Button onClick={() => handleSubmit(name)}>Submit!</Button>
        </VStack>
    </>)
}

type BaseProps = {
    title?: string,
    prohibitedName?: string,
}
type Result = NoteName;

export function renderNoteNameInputModal({
    title,
    prohibitedName,
    onSubmit,
    onClose
}: ResultModalProps<BaseProps, Result>) {
    return <NoteNameInputModal
        title={title}
        prohibitedName={prohibitedName}
        onSubmit={onSubmit}
    />
}