import { useEffect, useState } from "react";
import { UiUtilsFacades } from "../../../../../_shared/ui-utils-facades";
import { AnyNote, NoteId, NoteKind, NoteName } from "../../../../../domain/note";
import { useUpdateNoteCoreData } from "../../../../app-hooks/command/use-update-note-core-data";
import { Button } from "../../../../shared/components/atoms/button";
import { Divider } from "../../../../shared/components/atoms/divider";
import { Pill } from "../../../../shared/components/atoms/pill";
import { HStack, VStack } from "../../../../shared/components/atoms/stack";
import { Text } from "../../../../shared/components/atoms/text";
import { TextInput } from "../../../../shared/components/atoms/text-input";
import { Field } from "../../../../shared/components/molecules/field";
import { useGetLatestActiveNoteId } from "../../hooks/get/use-get-latest-active-note-id";
import { useGetNote } from "../../hooks/get/use-get-note";
import { useGetNoteIdByName } from "../../hooks/get/use-get-note-id-by-name";
import { NoteKindSelect } from "../molecules/note-kind-select";
import { NoteNameSuggestInput } from "../molecules/note-name-suggest-input";

type Props = {
    defaultNoteId?: NoteId,
    onUpdated?: (note: AnyNote) => unknown;
}

export function NoteCoreDataUpdater({
    defaultNoteId,
    onUpdated,
}: Props) {
    const getNoteIdByName = useGetNoteIdByName();
    const getLatestActiveNoteId = useGetLatestActiveNoteId();
    const getNote = useGetNote();

    const [updateNoteId, setUpdateNoteId] = useState<NoteId | undefined>(
        defaultNoteId ?? getLatestActiveNoteId()
    );
    const originalNote = getNote(updateNoteId);

    const [name, setName] = useState(originalNote?.name.value ?? "");
    const [kind, setKind] = useState<NoteKind>(originalNote?.kind ?? "knowledge");

    // useStateの初期値セットは初回レンダリング時のみ評価されるため
    useEffect(() => {
        if (originalNote) {
            setName(originalNote.name.value);
            setKind(originalNote.kind);
        }
    }, [originalNote]);

    const [isProcessing, setIsProcessing] = useState(false);

    const updateNote = useUpdateNoteCoreData(
        onUpdated,
        setIsProcessing
    );

    const handleUpdate = async () => {
        if (!originalNote) {
            UiUtilsFacades.alert("note to update is empty.");
            return;
        }

        const noteName = NoteName.tryFrom(name);
        if (!noteName) {
            UiUtilsFacades.alert(`invalid note name, name: ${name}`);
            return;
        }

        await updateNote(originalNote.id, originalNote.entryVersion,
            noteName,
            kind
        );
    }

    return (<VStack gap={6}>
        <Field label="update note" labelSize="lg">
            <NoteNameSuggestInput
                onSelect={(name) => {
                    const id = getNoteIdByName(name);
                    setUpdateNoteId(id);
                }}
            />
            <Text weight="bold" variant="accent">update to 【{originalNote?.name.value || "null"}】</Text>
        </Field>

        <Divider />

        {originalNote && <>
            <Field label={getLabelWithChanged("new name", originalNote.name.value !== name)}>
                <TextInput
                    value={name}
                    onChange={setName}
                />
            </Field>
            <Field label={getLabelWithChanged("new kind", originalNote.kind !== kind)}>
                <NoteKindSelect kind={kind} onChange={setKind} />
            </Field>

            <Divider />

            <Button
                variant="primary"
                onClick={handleUpdate}
                loading={isProcessing}
            >
                Update!!
            </Button>
        </>}
    </VStack>)
}

function getLabelWithChanged(label: string, changed: boolean) {
    return <HStack>
        <Text weight="bold" size="lg">{label}</Text>
        {changed && <Pill label="changed" variant="accent" />}
    </HStack>
}