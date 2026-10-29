import { useState } from "react";
import { Path } from "../../../../../_shared/path.vo";
import { NoteId } from "../../../../../domain/note";
import { useTrashNote } from "../../../../app-hooks/command/use-trash-note";
import { useOrbizSpace } from "../../../../context/use-context";

import { UiUtilsFacades } from "../../../../../_shared/ui-utils-facades";
import { renderBooleanInputModal } from "../../../../modal/boolean-input-modal";
import { Button } from "../../../../shared/components/atoms/button";
import { Divider } from "../../../../shared/components/atoms/divider";
import { VStack } from "../../../../shared/components/atoms/stack";
import { Text } from "../../../../shared/components/atoms/text";
import { Field } from "../../../../shared/components/molecules/field";
import { NoteNameSuggestInput } from "../../../note/components/molecules/note-name-suggest-input";
import { useGetLatestActiveNoteId } from "../../../note/hooks/get/use-get-latest-active-note-id";
import { useGetNote } from "../../../note/hooks/get/use-get-note";
import { useGetNoteIdByName } from "../../../note/hooks/get/use-get-note-id-by-name";


type Props = {
    defaultNoteId?: NoteId,
    onTrashed?: (path: Path) => void;
}

export function NoteTrasher({ defaultNoteId, onTrashed }: Props) {
    const getLatestActiveNoteId = useGetLatestActiveNoteId();
    const getNoteIdByName = useGetNoteIdByName();

    const orbizSpace = useOrbizSpace();

    const [trashNoteId, setTrashNoteId] = useState<NoteId | undefined>(
        defaultNoteId || getLatestActiveNoteId()
    );

    // const originalNote = trashNoteId ? useNote(trashNoteId) : undefined;
    // const originalNote = useNote(trashNoteId);
    const getNote = useGetNote();
    const originalNote = trashNoteId ? getNote(trashNoteId) : undefined;



    const [isProcessing, setIsProcessing] = useState(false);

    const trashNote = useTrashNote(
        onTrashed,
        setIsProcessing
    );
    const handleTrash = async () => {
        if (!trashNoteId) {
            UiUtilsFacades.alert("undefined trash note.");
            return;
        }

        const ok = await orbizSpace.modal.openAndGetResult(renderBooleanInputModal, {
            title: "「Trash」を実行しますか？ この操作は取り消せません。"
        })

        if (ok) {
            await trashNote(trashNoteId);
        } else {
            UiUtilsFacades.alert("実行を中止しました。");
        }
    }

    return (<>
        <VStack gap={8}>
            <Field label="update note" labelSize="lg">
                <NoteNameSuggestInput
                    onSelect={(name) => {
                        const id = getNoteIdByName(name);
                        setTrashNoteId(id);
                    }}
                />
                <VStack>
                    <Text weight="bold" variant="accent">trash to </Text>
                    <Text variant="error">path: {originalNote?.path.value || "null"}</Text>
                    <Text variant="error">id: {originalNote?.id.value || "null"}</Text>
                </VStack>

            </Field>
            <Divider />

            <Button
                variant="danger"
                onClick={handleTrash}
                loading={isProcessing}
            >
                Trash
            </Button>
        </VStack>
    </>)

}