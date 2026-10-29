import { UiUtilsFacades } from "../../../../../_shared/ui-utils-facades";
import { AnyNote } from "../../../../../domain/note";
import { Text } from "../../../../shared/components/atoms/text";
import { InlineField } from "../../../../shared/components/molecules/inline-field";
import { useNoteWeight } from "../../hooks/reactive/use-note-weight";

type Props = {
    note: AnyNote;
}

export function NoteWeightField({
    note
}: Props) {
    const weight = useNoteWeight(note);

    if (!weight) return null;

    return <InlineField label="weight:">
        <Text variant="link" onClick={() => {
            // TODO: "数が多いがSearcherに飛ぶ？
            UiUtilsFacades.alert("未実装");
        }}>
            {weight.toString()}
        </Text>
    </InlineField >
}


