import { AnyNote } from "../../../../../../domain/note";
import { Text } from "../../../../../shared/components/atoms/text";
import { InlineField } from "../../../../../shared/components/molecules/inline-field";
import { useNoteStartedAt } from "../../../../note/hooks/reactive/use-note-started-at";
import { DRecordLink } from "./d-record-link";

type Props = {
    note: AnyNote
}

export function NoteStartedAtField({ note }: Props) {
    const date = useNoteStartedAt(note);

    if (date === undefined) return null;

    return <InlineField label="startedAt: ">
        {date !== null ? <DRecordLink src={date} /> : <Text>null</Text>}
    </InlineField>
}