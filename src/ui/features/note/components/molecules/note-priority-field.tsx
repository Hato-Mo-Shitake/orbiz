import { UiUtilsFacades } from "../../../../../_shared/ui-utils-facades";
import { AnyNote } from "../../../../../domain/note";
import { Text } from "../../../../shared/components/atoms/text";
import { InlineField } from "../../../../shared/components/molecules/inline-field";
import { useNotePriority } from "../../hooks/reactive/use-note-priority";

type Props = {
    note: AnyNote;
}

export function NotePriorityField({
    note
}: Props) {
    const Priority = useNotePriority(note);

    if (!Priority) return null;

    return <InlineField label="Priority:">
        <Text variant="link" onClick={() => {
            // TODO: 数が多いがSearcherに飛ぶ？
            UiUtilsFacades.alert("未実装");
        }}>
            {Priority.toString()}
        </Text>
    </InlineField >
}


