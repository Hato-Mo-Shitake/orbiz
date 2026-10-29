import { UiUtilsFacades } from "../../../../../_shared/ui-utils-facades";
import { NoteId, NoteKind } from "../../../../../domain/note";
import { Text } from "../../../../shared/components/atoms/text";
import { InlineField } from "../../../../shared/components/molecules/inline-field";
import { useNoteKind } from "../../hooks/reactive/use-note-kind";


type Props = {
    noteId: NoteId,
    initialKind: NoteKind
}

export function NoteKindField({ noteId, initialKind }: Props) {
    const kind = useNoteKind(noteId, initialKind);

    return <InlineField label="kind:">
        <Text variant="link" onClick={() => {
            // TODO: kind検索のモーダルを出す想定
            UiUtilsFacades.alert("未実装");
        }}>
            {kind}
        </Text>
    </InlineField>
}