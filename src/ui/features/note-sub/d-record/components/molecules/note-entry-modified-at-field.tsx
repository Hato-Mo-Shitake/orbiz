import { AnyNote } from "../../../../../../domain/note";
import { InlineField } from "../../../../../shared/components/molecules/inline-field";
import { useNoteEntryModifiedAt } from "../../../../note/hooks/reactive/use-note-entry-modified-at";
import { DRecordLink } from "./d-record-link";

type Props = {
    note: AnyNote,
}

export function NoteEntryModifiedAtField({ note }: Props) {
    const date = useNoteEntryModifiedAt(note.id, note.entryModifiedAt);

    return <InlineField label="entryModifiedAt: ">
        <DRecordLink src={date} />
    </InlineField>
}