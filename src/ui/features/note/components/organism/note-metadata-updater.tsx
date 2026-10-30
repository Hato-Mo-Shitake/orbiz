import { useState } from "react";
import { AnyNote, AnyNoteSemanticDateRecord, noteDatesKeysMap, NoteId, NotePriority, NoteWeight } from "../../../../../domain/note";
import { useUpdateNoteMetadata } from "../../../../app-hooks/command/use-update-note-metadata";
import { Button } from "../../../../shared/components/atoms/button";
import { Divider } from "../../../../shared/components/atoms/divider";
import { Pill } from "../../../../shared/components/atoms/pill";
import { HStack, VStack } from "../../../../shared/components/atoms/stack";
import { Text } from "../../../../shared/components/atoms/text";
import { Field } from "../../../../shared/components/molecules/field";
import { useGetLatestActiveNoteId } from "../../hooks/get/use-get-latest-active-note-id";
import { useGetNote } from "../../hooks/get/use-get-note";
import { useGetNoteIdByName, useGetNoteIdsByName } from "../../hooks/get/use-get-note-id-by-name";
import { useExtractNoteSemanticDateRecord, useExtractNoteSemanticOutlinkNamesRecord } from "../../hooks/use-extract-from-note";
import { NoteNameSuggestInput } from "../molecules/note-name-suggest-input";
import { NotePrioritySelect } from "../molecules/note-priority-select";
import { NoteSemanticDatesInput } from "../molecules/note-semantic-dates-input";
import { NoteSemanticOutlinksSelect } from "../molecules/note-semantic-outlinks-select";
import { NoteTagMultiSelect } from "../molecules/note-tag-multi-select";
import { NoteWightSelect } from "../molecules/note-weight-select";
import { AnyNoteSemanticOutlinkNamesRecord } from "../note.types";


type Props = {
    defaultNoteId?: NoteId,
    onUpdated?: (note: AnyNote) => unknown;
}

export function NoteMetadataUpdater({
    defaultNoteId,
    onUpdated
}: Props) {
    const getLatestActiveNoteId = useGetLatestActiveNoteId();
    const getNoteIdByName = useGetNoteIdByName();
    const getNote = useGetNote();

    const [noteId, setNoteId] = useState(
        () => defaultNoteId ?? getLatestActiveNoteId(),
    );

    const note = noteId ? getNote(noteId) : undefined;

    const extractOutlinks = useExtractNoteSemanticOutlinkNamesRecord();
    const extractDates = useExtractNoteSemanticDateRecord();

    const originalOutlinks = extractOutlinks(note);
    const originalDates = extractDates(note);

    return (
        <VStack gap={8}>
            <Field label="update note" labelSize="lg">
                <NoteNameSuggestInput
                    onSelect={name => setNoteId(getNoteIdByName(name))}
                />
                <Text weight="bold" variant="accent">
                    update to 【{note?.name.value ?? "null"}】
                </Text>
            </Field>

            <Divider />

            {note && (
                <NoteMetadataForm
                    key={`${note.id.toString()}:${note.entryVersion}`}
                    note={note}
                    originalOutlinks={originalOutlinks}
                    originalDates={originalDates}
                    onUpdated={onUpdated}
                />
            )}
        </VStack>
    );
}

function getLabelWithChanged(label: string, changed: boolean) {
    return <HStack>
        <Text weight="bold" size="lg">{label}</Text>
        {changed && <Pill label="changed" variant="accent" />}
    </HStack>
}


type NoteMetadataFormProps = {
    note: AnyNote;
    originalOutlinks: AnyNoteSemanticOutlinkNamesRecord;
    originalDates: AnyNoteSemanticDateRecord;
    onUpdated?: (note: AnyNote) => void;
};

function NoteMetadataForm({
    note,
    originalOutlinks,
    originalDates,
    onUpdated,
}: NoteMetadataFormProps) {
    const getIdsByName = useGetNoteIdsByName();

    const [tags, setTags] = useState(() => note.tags);
    const [outlinks, setOutlinks] = useState(() => originalOutlinks);
    const [dates, setDates] = useState(() => originalDates);

    const [weight, setWeight] = useState(() =>
        "weight" in note ? note.weight : NoteWeight.from("standard"),
    );
    const [priority, setPriority] = useState(() =>
        "priority" in note ? note.priority : NotePriority.from("normal"),
    );

    const [isProcessing, setIsProcessing] = useState(false);
    const updateNote = useUpdateNoteMetadata(onUpdated, setIsProcessing);

    const update = async () => {
        await updateNote(note.id, note.entryVersion, {
            tags,

            belongsTo: getIdsByName(outlinks.belongsTo),
            references: getIdsByName(outlinks.references),
            creators: getIdsByName(outlinks.creators),

            resolvedAt: dates.resolvedAt,
            startedAt: dates.startedAt,
            dueAt: dates.dueAt,

            weight,
            priority,
        });
    };

    return <>
        <Field label={getLabelWithChanged(
            "tags",
            !tags.equals(note.tags)
        )}>
            <NoteTagMultiSelect
                tags={tags}
                onChange={setTags}
            />
        </Field>
        {("weight" in note) && <>
            <Field label={getLabelWithChanged(
                "weight",
                !weight.equals(note.weight)
            )} labelSize="lg">
                <NoteWightSelect
                    weight={weight}
                    onChange={setWeight}
                />
            </Field>
        </>}

        {("priority" in note) && <>
            <Field label={getLabelWithChanged(
                "priority",
                !priority.equals(note.priority)
            )} labelSize="lg">
                <NotePrioritySelect
                    priority={priority}
                    onChange={setPriority}
                />
            </Field>
        </>}

        <Divider />

        {noteDatesKeysMap[note.kind].length > 2 &&
            <Field label="dates" labelSize="lg">
                <NoteSemanticDatesInput
                    kind={note.kind}
                    dates={dates}
                    onChange={setDates}
                    originalDates={originalDates}
                />
            </Field>
        }

        <Field label="semantic outlinks" labelSize="lg">
            <NoteSemanticOutlinksSelect
                kind={note.kind}
                inputKind={note.kind}
                outlinks={outlinks}
                onChange={setOutlinks}
                originalOutlinks={originalOutlinks}
            />
        </Field>

        <Divider />

        <Button
            variant="primary"
            onClick={update}
            loading={isProcessing}
        >
            Update!!
        </Button>
    </>
}