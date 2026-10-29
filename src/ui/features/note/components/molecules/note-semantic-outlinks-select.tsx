import { useState } from "react";
import { AnyNoteSemanticOutlinksKey, NoteKind, NoteName, NoteNameList, noteSemanticOutlinkKeysMap } from "../../../../../domain/note";
import { Button } from "../../../../shared/components/atoms/button";
import { Pill } from "../../../../shared/components/atoms/pill";
import { HStack, VStack } from "../../../../shared/components/atoms/stack";
import { Text } from "../../../../shared/components/atoms/text";
import { Field } from "../../../../shared/components/molecules/field";
import { MultiSelectStack } from "../../../../shared/components/molecules/multi-select-stack";
import { AnyNoteSemanticOutlinkNamesRecord } from "../note.types";
import { NoteNameSuggestInput } from "./note-name-suggest-input";


type Props = {
    kind: NoteKind,
    inputKind?: NoteKind,
    outlinks: AnyNoteSemanticOutlinkNamesRecord,
    onChange: (outlinks: AnyNoteSemanticOutlinkNamesRecord) => void,
    originalOutlinks?: AnyNoteSemanticOutlinkNamesRecord;
}

export const NoteSemanticOutlinksSelect = ({
    kind,
    inputKind = "knowledge",
    outlinks,
    onChange,
    originalOutlinks
}: Props) => {
    const outlinksKeys = noteSemanticOutlinkKeysMap[kind]

    const [outlinkInput, setOutlinkInput] = useState("");
    const [outlinkName, setOutlinkName] = useState<NoteName | undefined>();

    const addOutlink = (key: AnyNoteSemanticOutlinksKey) => {
        if (!outlinkName) return;

        onChange({
            ...outlinks,
            [key]: outlinks[key]?.add(outlinkName),
        });
        setOutlinkInput("");
    };

    const updateOutlink = (key: AnyNoteSemanticOutlinksKey, values: string[]) => {
        onChange({
            ...outlinks,
            [key]: NoteNameList.from(values),
        });
    };

    return (<>
        <VStack>
            <NoteNameSuggestInput
                defaultKind={inputKind}
                value={outlinkInput}
                onChange={setOutlinkInput}
                onSelect={setOutlinkName}
                onMatch={setOutlinkName}
            />

            <HStack>
                <Text weight="bold" size="lg">Add:</Text>
                {outlinksKeys.map((key) => {
                    return <Button key={key} variant="primary" onClick={() => addOutlink(key)}>
                        {key}
                    </Button>
                })}
            </HStack>

            {outlinksKeys.map((key) => {
                return <Field key={key} label={
                    originalOutlinks
                        ? getLabelWithChanged(
                            key,
                            !originalOutlinks?.[key].equals(outlinks[key])
                        )
                        : key}
                >
                    <MultiSelectStack
                        values={outlinks[key].toStringArray()}
                        onChange={(values) => updateOutlink(key, values)}
                    />
                </Field>
            })}
        </VStack>
    </>)
}

function getLabelWithChanged(label: string, changed: boolean | undefined) {
    return <HStack>
        <Text weight="bold">{label}</Text>
        {changed && <Pill label="changed" variant="accent" />}
    </HStack>
}