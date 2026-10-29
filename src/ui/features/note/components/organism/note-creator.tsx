import { useState } from "react";
import { AnyNote } from "../../../../../domain/note";
import { useCreateNote } from "../../../../app-hooks/command/use-create-note";
import { CreateNoteForm } from "./create-note-form";
import { DefaultNoteCreatorParams } from "./note-creator.types";

type Props = {
    defaultParams?: DefaultNoteCreatorParams,
    onCreated?: (note: AnyNote) => unknown;
}

export const NoteCreator = ({
    defaultParams,
    onCreated,
}: Props) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const createNote = useCreateNote({ onCreated, setIsProcessing });

    return <CreateNoteForm
        onCreate={createNote}
        isProcessing={isProcessing}
        defaultParams={defaultParams}
    />



    // const getNoteNames = useGetNoteNames();

    // const [name, setName] = useState<string>(() => defaultParams?.name?.toString() || "")
    // const [kind, setKind] = useState<NoteKind>(() => defaultParams?.kind || "knowledge");
    // const [tags, setTags] = useState<NoteTagList>(() => defaultParams?.tags || NoteTagList.empty());
    // const [outlinks, setOutlinks] = useState<AnyNoteSemanticOutlinkNamesRecord>(() => ({
    //     belongsTo: getNoteNames(defaultParams?.semanticOutlinks?.belongsTo || NoteIdList.empty()),
    //     references: getNoteNames(defaultParams?.semanticOutlinks?.references || NoteIdList.empty()),
    //     creators: getNoteNames(defaultParams?.semanticOutlinks?.creators || NoteIdList.empty()),
    // }));
    // const [dates, setDates] = useState<Record<AnyNoteSemanticDateKey, DateTime | null>>(() => ({
    //     resolvedAt: defaultParams?.semanticDates?.resolvedAt || null,
    //     startedAt: defaultParams?.semanticDates?.startedAt || null,
    //     dueAt: defaultParams?.semanticDates?.dueAt || null
    // }));
    // const [weight, setWeight] = useState<NoteWeight>(() => defaultParams?.wight || NoteWeight.from("standard"))
    // const [priority, setPriority] = useState<NotePriority>(() => defaultParams?.priority || NotePriority.from("normal"))

    // const [isProcessing, setIsProcessing] = useState(false);

    // const [contextName, setContextName] = useState("");

    // const createNote = useCreateNote(
    //     onCreated,
    //     setIsProcessing
    // );
    // const create = async () => {
    //     let newName = `${name}`;
    //     if (contextName !== "") {
    //         newName += `@${contextName}`;
    //     }
    //     const noteName = NoteName.tryFrom(newName);
    //     if (!noteName) {
    //         alert(`invalid note name: ${newName}`);
    //         return;
    //     }

    //     await createNote({
    //         name: noteName,
    //         kind,
    //         tags,
    //         semanticOutlinkNames: outlinks,
    //         semanticDates: dates,
    //         weight,
    //         priority
    //     });
    // }

    // return (
    //     <VStack gap={8}>
    //         <Field label="name" labelSize="lg">
    //             <HStack>
    //                 <TextInput
    //                     value={name}
    //                     onChange={setName}
    //                 />
    //                 {" @ "}
    //                 <Select
    //                     options={["", ...outlinks.belongsTo.value].map(name => ({ label: name, value: name }))}
    //                     value={contextName}
    //                     onChange={setContextName}
    //                 />
    //             </HStack>

    //         </Field>

    //         <Field label="kind" labelSize="lg">
    //             <NoteKindSelect kind={kind} onChange={setKind} />
    //         </Field>

    //         <Field label="tags" labelSize="lg">
    //             <NoteTagMultiSelect
    //                 tags={tags}
    //                 onChange={setTags}
    //             />
    //         </Field>

    //         <Field label="semantic outlinks" labelSize="lg">
    //             <NoteSemanticOutlinksSelect
    //                 kind={kind}
    //                 inputKind={kind}
    //                 outlinks={outlinks}
    //                 onChange={setOutlinks}
    //             />
    //         </Field>

    //         {/* やっぱり noteSemanticDatesKeyオンリーで扱いたい機会そこそこあるな */}
    //         {noteDatesKeysMap[kind].length > 2 &&
    //             <Field label="dates" labelSize="lg">
    //                 <NoteSemanticDatesInput
    //                     kind={kind}
    //                     dates={dates}
    //                     onChange={setDates}
    //                 />
    //             </Field>
    //         }

    //         {isMyNoteKind(kind) && <>
    //             <Field label="wight" labelSize="lg">
    //                 <NoteWightSelect
    //                     weight={weight}
    //                     onChange={setWeight}
    //                 />
    //             </Field>
    //         </>}

    //         {isBoardNoteKind(kind) && <>
    //             <Field label="priority" labelSize="lg">
    //                 <NotePrioritySelect
    //                     priority={priority}
    //                     onChange={setPriority}
    //                 />
    //             </Field>
    //         </>}

    //         <Divider />

    //         <Button
    //             variant="primary"
    //             onClick={create}
    //             loading={isProcessing}
    //         >
    //             Create New!!
    //         </Button>
    //     </VStack>
    // );
};