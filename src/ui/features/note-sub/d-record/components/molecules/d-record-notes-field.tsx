import { DRecord, DRecordNoteIdsKey } from "../../../../../../domain/note-sub/d-record";
import { Button } from "../../../../../shared/components/atoms/button";
import { HStack } from "../../../../../shared/components/atoms/stack";
import { Field } from "../../../../../shared/components/molecules/field";
import { List } from "../../../../../shared/components/molecules/list";
import { FileLink } from "../../../../app/components/molecules/file-link";
import { useFilterNotes } from "../../../../note/hooks/use-filter-notes";
import { useDRecordNotes } from "../../hooks/reactive/use-d-record-notes";

type Props = {
    dRecord: DRecord,
    dateKey: DRecordNoteIdsKey
}

export function DRecordNotesField({ dRecord, dateKey }: Props) {
    const originalNotes = useDRecordNotes(dRecord, dateKey);
    const { filteredNotes, openModalAndHandleFilter } = useFilterNotes(originalNotes);


    if (!filteredNotes) return null;

    return <Field label={<>
        <HStack>{dateKey} <Button onClick={openModalAndHandleFilter}>filter</Button></HStack>
    </>}>
        <List
            list={filteredNotes.value}
            renderNode={note => <FileLink
                label={note.name.value}
                path={note.path.value}
            />}
        />
    </Field>
}