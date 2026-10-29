import { AnyNote } from "../../../../../../domain/note";
import { Text } from "../../../../../shared/components/atoms/text";
import { InlineField } from "../../../../../shared/components/molecules/inline-field";
import { useNoteDueAt } from "../../../../note/hooks/reactive/use-note-due-at";
import { DRecordLink } from "./d-record-link";

type Props = {
    note: AnyNote
}

export function NoteDueAtField({ note }: Props) {
    const date = useNoteDueAt(note);

    if (date === undefined) return null;

    return <InlineField label="dueAt: ">
        {date !== null ? <DRecordLink src={date} /> : <Text>null</Text>}
    </InlineField>
}