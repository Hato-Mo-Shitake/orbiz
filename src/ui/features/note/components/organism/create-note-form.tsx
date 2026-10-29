import { useState } from "react";
import { DateTime } from "../../../../../_shared/date-time.vo";
import { UiUtilsFacades } from "../../../../../_shared/ui-utils-facades";
import { CreateAnyNoteRequest } from "../../../../../app/workflows/command/create-note.types";
import { AnyNoteSemanticDateKey, isBoardNoteKind, isMyNoteKind, noteDatesKeysMap, NoteIdList, NoteKind, NoteName, NotePriority, NoteTagList, NoteWeight } from "../../../../../domain/note";
import { useCreateCreateNoteRequest } from "../../../../app-hooks/command/use-create-create-note-request";
import { Button } from "../../../../shared/components/atoms/button";
import { Divider } from "../../../../shared/components/atoms/divider";
import { Select } from "../../../../shared/components/atoms/select";
import { HStack, VStack } from "../../../../shared/components/atoms/stack";
import { TextInput } from "../../../../shared/components/atoms/text-input";
import { Field } from "../../../../shared/components/molecules/field";
import { useGetNoteNames } from "../../hooks/get/use-get-note-name";
import { NoteKindSelect } from "../molecules/note-kind-select";
import { NotePrioritySelect } from "../molecules/note-priority-select";
import { NoteSemanticDatesInput } from "../molecules/note-semantic-dates-input";
import { NoteSemanticOutlinksSelect } from "../molecules/note-semantic-outlinks-select";
import { NoteTagMultiSelect } from "../molecules/note-tag-multi-select";
import { NoteWightSelect } from "../molecules/note-weight-select";
import { AnyNoteSemanticOutlinkNamesRecord } from "../note.types";
import { DefaultNoteCreatorParams } from "./note-creator.types";

type Props = {
    onCreate: (request: CreateAnyNoteRequest) => Promise<void>;
    isProcessing?: boolean,
    defaultParams?: DefaultNoteCreatorParams,
}

export const CreateNoteForm = ({
    onCreate,
    isProcessing,
    defaultParams,
}: Props) => {
    const getNoteNames = useGetNoteNames();

    const [name, setName] = useState<string>(() => defaultParams?.name?.toString() || "")
    const [kind, setKind] = useState<NoteKind>(() => defaultParams?.kind || "knowledge");
    const [tags, setTags] = useState<NoteTagList>(() => defaultParams?.tags || NoteTagList.empty());
    const [outlinks, setOutlinks] = useState<AnyNoteSemanticOutlinkNamesRecord>(() => ({
        belongsTo: getNoteNames(defaultParams?.semanticOutlinks?.belongsTo || NoteIdList.empty()),
        references: getNoteNames(defaultParams?.semanticOutlinks?.references || NoteIdList.empty()),
        creators: getNoteNames(defaultParams?.semanticOutlinks?.creators || NoteIdList.empty()),
    }));
    const [dates, setDates] = useState<Record<AnyNoteSemanticDateKey, DateTime | null>>(() => ({
        resolvedAt: defaultParams?.semanticDates?.resolvedAt || null,
        startedAt: defaultParams?.semanticDates?.startedAt || null,
        dueAt: defaultParams?.semanticDates?.dueAt || null
    }));
    const [weight, setWeight] = useState<NoteWeight>(() => defaultParams?.wight || NoteWeight.from("standard"))
    const [priority, setPriority] = useState<NotePriority>(() => defaultParams?.priority || NotePriority.from("normal"))

    // const [isProcessing, setIsProcessing] = useState(false);

    const [contextName, setContextName] = useState("");

    const createCreateNoteRequest = useCreateCreateNoteRequest();

    const handleCreate = async () => {
        try {
            let newName = `${name}`;
            if (contextName !== "") {
                newName += `@${contextName}`;
            }
            const noteName = NoteName.tryFrom(newName);
            if (!noteName) {
                throw new Error(`invalid note name: ${newName}`);
            }

            const request = createCreateNoteRequest({
                name: noteName,
                kind,
                tags,
                semanticOutlinkNames: outlinks,
                semanticDates: dates,
                weight,
                priority
            });

            await onCreate(request);
        } catch (e) {
            if (e instanceof Error) {
                UiUtilsFacades.alert(e.message);
            } else {
                UiUtilsFacades.alert("unknown error in handleCreate");
            }
        }
    }

    return (
        <VStack gap={8}>
            <Field label="name" labelSize="lg">
                <HStack>
                    <TextInput
                        value={name}
                        onChange={setName}
                    />
                    {" @ "}
                    <Select
                        options={["", ...outlinks.belongsTo.value].map(name => ({ label: name, value: name }))}
                        value={contextName}
                        onChange={setContextName}
                    />
                </HStack>

            </Field>

            <Field label="kind" labelSize="lg">
                <NoteKindSelect kind={kind} onChange={setKind} />
            </Field>

            <Field label="tags" labelSize="lg">
                <NoteTagMultiSelect
                    tags={tags}
                    onChange={setTags}
                />
            </Field>

            <Field label="semantic outlinks" labelSize="lg">
                <NoteSemanticOutlinksSelect
                    kind={kind}
                    inputKind={kind}
                    outlinks={outlinks}
                    onChange={setOutlinks}
                />
            </Field>

            {/* やっぱり noteSemanticDatesKeyオンリーで扱いたい機会そこそこあるな */}
            {noteDatesKeysMap[kind].length > 2 &&
                <Field label="dates" labelSize="lg">
                    <NoteSemanticDatesInput
                        kind={kind}
                        dates={dates}
                        onChange={setDates}
                    />
                </Field>
            }

            {isMyNoteKind(kind) && <>
                <Field label="wight" labelSize="lg">
                    <NoteWightSelect
                        weight={weight}
                        onChange={setWeight}
                    />
                </Field>
            </>}

            {isBoardNoteKind(kind) && <>
                <Field label="priority" labelSize="lg">
                    <NotePrioritySelect
                        priority={priority}
                        onChange={setPriority}
                    />
                </Field>
            </>}

            <Divider />

            <Button
                variant="primary"
                onClick={handleCreate}
                loading={isProcessing}
            >
                Create New!!
            </Button>
        </VStack>
    );
};