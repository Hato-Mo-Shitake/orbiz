import { AnyNote } from "../../../../../../domain/note";
import { Text } from "../../../../../shared/components/atoms/text";
import { InlineField } from "../../../../../shared/components/molecules/inline-field";
import { useNoteResolvedAt } from "../../../../note/hooks/reactive/use-resolved-at";
import { DRecordLink } from "./d-record-link";

type Props = {
    note: AnyNote
}

export function NoteResolvedAtField({ note }: Props) {
    const date = useNoteResolvedAt(note);

    if (date === undefined) return null;

    return <InlineField label="resolvedAt: ">
        {date !== null ? <DRecordLink src={date} /> : <Text>null</Text>}
    </InlineField>
}