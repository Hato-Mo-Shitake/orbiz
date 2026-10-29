import { useState } from "react";
import { UiUtilsFacades } from "../../_shared/ui-utils-facades";
import { ResultModalProps } from "../../app/modal.types";
import { OrbizResolver } from "../../app/orbiz-resolver.types";
import { StoreMap } from "../../app/stores/store.types";
import { AnyNoteSemanticOutlinksKey, isAnyNoteSemanticOutlinksKey, NoteId, noteSemanticOutlinkKeysMap } from "../../domain/note";
import { OrbizResolverContext, StoreContext } from "../context/context";
import { NoteNameSuggestInput } from "../features/note/components/molecules/note-name-suggest-input";
import { useGetNote } from "../features/note/hooks/get/use-get-note";
import { useGetNoteIdByName } from "../features/note/hooks/get/use-get-note-id-by-name";
import { Button } from "../shared/components/atoms/button";
import { Header } from "../shared/components/atoms/header";
import { VStack } from "../shared/components/atoms/stack";
import { Text } from "../shared/components/atoms/text";
import { Field } from "../shared/components/molecules/field";
import { SegmentedControl } from "../shared/components/molecules/segmented-control";



type Props = {
    onSubmit: (id: NoteId, linkKey: AnyNoteSemanticOutlinksKey) => void,
    title?: string,
    defaultNoteId?: NoteId,
}

function NoteIdWithLinkKeyInputModal({ onSubmit, title, defaultNoteId }: Props) {

    const getNoteIdByName = useGetNoteIdByName();
    const getNote = useGetNote();

    const [noteId, setNoteId] = useState(defaultNoteId);
    const note = noteId ? getNote(noteId) : undefined;

    const [linkKey, setLinkKey] = useState("belongsTo")

    const handleSubmit = () => {
        if (!isAnyNoteSemanticOutlinksKey(linkKey)) {
            UiUtilsFacades.alert(`Invalid link key: ${linkKey}`);
            return;
        }

        if (!noteId) {
            UiUtilsFacades.alert("note-id empty.")
            return;
        }

        onSubmit(noteId, linkKey)
    }
    return (
        <VStack>
            <Header level={2}>{title}</Header>
            <Field label="name" labelSize="lg">
                <NoteNameSuggestInput
                    onSelect={name => setNoteId(getNoteIdByName(name))}
                />
                <Text weight="bold" variant="accent">
                    target: 【{note?.name.value ?? "null"}】
                </Text>
            </Field>
            <Field label="link key" labelSize="lg">
                {note && <SegmentedControl
                    options={noteSemanticOutlinkKeysMap[note.kind].map(k => ({ label: k, value: k }))}
                    value={linkKey}
                    onChange={setLinkKey}
                />}
            </Field>
            <Button onClick={handleSubmit}>
                Submit!
            </Button>
        </VStack>
    )
}

type BaseProps = {
    title?: string,
    defaultNoteId?: NoteId,
    storeMap: StoreMap,
    orbizResolver: OrbizResolver,
}

type Result = { id: NoteId, linkKey: AnyNoteSemanticOutlinksKey };


export function renderNoteIdWithLinkKeyInputModal({
    title,
    defaultNoteId,
    onSubmit,
    storeMap,
    orbizResolver,
}: ResultModalProps<BaseProps, Result>) {
    return <StoreContext.Provider value={storeMap}>
        <OrbizResolverContext.Provider value={orbizResolver}>
            <NoteIdWithLinkKeyInputModal
                onSubmit={(id, linkKey) => {
                    onSubmit({
                        id,
                        linkKey
                    });
                }}
                title={title}
                defaultNoteId={defaultNoteId}
            />
        </OrbizResolverContext.Provider>

    </StoreContext.Provider>
}