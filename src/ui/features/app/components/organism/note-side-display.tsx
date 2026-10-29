
import { useState } from "react"
import { NoteSrc } from "../../../../../app/orbiz-resolver.types"
import { AnyNoteSemanticOutlinksKey, anyNoteSemanticOutlinksKeys, NoteId, NoteIdList, noteSemanticOutlinkKeysMap } from "../../../../../domain/note"
import { useAddNoteOutlink } from "../../../../app-hooks/command/use-add-note-outlink"
import { useIo, useOrbizResolver, useOrbizSpace, useStore } from "../../../../context/use-context"
import { renderNoteCreatorModal } from "../../../../modal/note-creator-modal"
import { renderSelectInputModal } from "../../../../modal/select-input-modal"
import { Button } from "../../../../shared/components/atoms/button"
import { Divider } from "../../../../shared/components/atoms/divider"
import { Pill } from "../../../../shared/components/atoms/pill"
import { HStack, VStack } from "../../../../shared/components/atoms/stack"
import { Text } from "../../../../shared/components/atoms/text"
import { Field } from "../../../../shared/components/molecules/field"
import { InlineField } from "../../../../shared/components/molecules/inline-field"
import { SegmentedControl } from "../../../../shared/components/molecules/segmented-control"
import { DRecordLink } from "../../../note-sub/d-record/components/molecules/d-record-link"
import { NoteDueAtField } from "../../../note-sub/d-record/components/molecules/note-due-at-field"
import { NoteEntryModifiedAtField } from "../../../note-sub/d-record/components/molecules/note-entry-modified-at-field"
import { NoteResolvedAtField } from "../../../note-sub/d-record/components/molecules/note-resolved-at-field"
import { NoteStartedAtField } from "../../../note-sub/d-record/components/molecules/note-started-at-field"
import { NoteKindField } from "../../../note/components/molecules/note-kind-field"
import { NoteLink } from "../../../note/components/molecules/note-link"
import { NotePriorityField } from "../../../note/components/molecules/note-priority-field"
import { NoteSemanticLinkTreeField } from "../../../note/components/molecules/note-semantic-link-tree-field"
import { NoteSemanticLinksField } from "../../../note/components/molecules/note-semantic-links-field"
import { NoteTagsField } from "../../../note/components/molecules/note-tags-field"
import { NoteWeightField } from "../../../note/components/molecules/note-weight-field"
import { useGetNote } from "../../../note/hooks/get/use-get-note"
import { useGetNoteNamesWithId } from "../../../note/hooks/get/use-get-note-name"
import { useNoteUnsemanticOutlinks } from "../../../note/hooks/reactive/use-note-unsemantic-outlinks"

type Props = {
    src: NoteSrc,
}

export const NoteSideDisplay = ({
    src,
}: Props) => {
    const orbizSpace = useOrbizSpace();
    const orbizResolver = useOrbizResolver();
    const storeMap = useStore();
    const ioMap = useIo();

    const getNamesWithId = useGetNoteNamesWithId();

    const getNote = useGetNote();
    const note = getNote(src);
    const unsemanticOutlinks = useNoteUnsemanticOutlinks(note?.id);
    const unsemanticOutlinkNamesWithId = unsemanticOutlinks ? getNamesWithId(unsemanticOutlinks) : unsemanticOutlinks;

    if (!note) return <Text variant="error">Not found note: {src.toString()}</Text>

    const [treeLinkKey, setTreeLinkKey] = useState("belongsTo");
    const [treeDirection, setTreeDirection] = useState("inlink");

    const addNoteOutlink = useAddNoteOutlink();

    const handleCreateInlinkNote = async () => {
        const linkKey = await orbizSpace.modal.openAndGetResult(renderSelectInputModal, {
            title: "Select inlink key",
            options: anyNoteSemanticOutlinksKeys.map(k => ({ label: k, value: k })),
        });
        if (linkKey === undefined) {
            return;
        }

        const semanticOutlinks = {
            [linkKey as AnyNoteSemanticOutlinksKey]: NoteIdList.fromNoteIdArray([note.id])
        }

        orbizSpace.modal.open(renderNoteCreatorModal, {
            orbizSpace,
            orbizResolver,
            storeMap,
            ioMap,
            defaultParams: {
                kind: note.kind,
                semanticOutlinks
            },
            onCreated: async (note) => {
                await orbizSpace.openFile(note.path);
            }
        });
    }

    const handleResolveUnsemanticLink = async (id: NoteId) => {
        const linkKey = await orbizSpace.modal.openAndGetResult(renderSelectInputModal, {
            title: "Select inlink key",
            options: noteSemanticOutlinkKeysMap[note.kind].map(k => ({ label: k, value: k })),
        });
        if (linkKey === undefined) {
            return;
        }

        await addNoteOutlink({
            noteId: note.id,
            key: (linkKey as AnyNoteSemanticOutlinksKey),
            addId: id,
        });
    }

    return (
        <VStack gap={4}>
            <Field label="name" labelSize="lg">
                <NoteLink noteId={note.id} />
            </Field>

            <Button onClick={handleCreateInlinkNote}>create inlink-note</Button>

            {
                unsemanticOutlinkNamesWithId && <Field label="unsemantic outlinks">
                    <HStack gap={0.5} wrap>
                        {unsemanticOutlinkNamesWithId.map((v) => (
                            <Pill
                                key={v.id.toString()}
                                label={v.name}
                                onClick={() => handleResolveUnsemanticLink(v.id)}
                                variant="accent"
                            />
                        ))}
                    </HStack>
                </Field>
            }


            <Divider />

            <NoteKindField
                noteId={note.id}
                initialKind={note.kind}
            />

            <NoteTagsField note={note} />

            <NoteWeightField note={note} />
            <NotePriorityField note={note} />

            <Divider />

            <Field label="dates" labelSize="lg">
                <InlineField label="createdAt:">
                    <DRecordLink src={note.createdAt} />
                </InlineField>

                <NoteEntryModifiedAtField note={note} />
                <NoteStartedAtField note={note} />
                <NoteDueAtField note={note} />
                <NoteResolvedAtField note={note} />
            </Field>

            <Field label="semantic outlinks" labelSize="lg">
                <VStack gap={3}>
                    <NoteSemanticLinksField
                        noteId={note.id}
                        linkKey="belongsTo"
                        direction="outlink"
                    />
                    <NoteSemanticLinksField
                        noteId={note.id}
                        linkKey="references"
                        direction="outlink"
                    />
                    <NoteSemanticLinksField
                        noteId={note.id}
                        linkKey="creators"
                        direction="outlink"
                    />
                </VStack>
            </Field>

            <Field label="semantic inlinks" labelSize="lg">
                <VStack gap={3}>
                    <NoteSemanticLinksField
                        noteId={note.id}
                        linkKey="belongsTo"
                        direction="inlink"
                    />
                    <NoteSemanticLinksField
                        noteId={note.id}
                        linkKey="references"
                        direction="inlink"
                    />
                    <NoteSemanticLinksField
                        noteId={note.id}
                        linkKey="creators"
                        direction="inlink"
                    />
                </VStack>
            </Field>

            <Field label="semantic link tree" labelSize="lg">
                <SegmentedControl
                    options={anyNoteSemanticOutlinksKeys.map(key => ({ label: key, value: key }))}
                    value={treeLinkKey}
                    onChange={setTreeLinkKey}
                />
                <SegmentedControl
                    options={["inlink", "outlink"].map(key => ({ label: key, value: key }))}
                    value={treeDirection}
                    onChange={setTreeDirection}
                />

                <NoteSemanticLinkTreeField
                    noteId={note.id}
                    linkKey={treeLinkKey as AnyNoteSemanticOutlinksKey}
                    direction={treeDirection as "inlink" | "outlink"}
                />
            </Field>
        </VStack>
    )
}