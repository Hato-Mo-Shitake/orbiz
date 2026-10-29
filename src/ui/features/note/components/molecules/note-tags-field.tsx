import { UiUtilsFacades } from "../../../../../_shared/ui-utils-facades";
import { AnyNote } from "../../../../../domain/note";
import { Pill } from "../../../../shared/components/atoms/pill";
import { HStack } from "../../../../shared/components/atoms/stack";
import { Field } from "../../../../shared/components/molecules/field";
import { useNoteTags } from "../../hooks/reactive/use-note-tags";

type Props = {
    note: AnyNote
}

export function NoteTagsField({ note }: Props) {
    const tags = useNoteTags(note);

    return <Field label="tags">
        <HStack gap={0.5} wrap>
            {tags.toStringArray().map((tag) => (
                <Pill
                    key={tag}
                    label={tag}
                    variant="accent"
                    onClick={() => {
                        // TODO: クリックしたタグのNoteSearcherModalを開く.
                        UiUtilsFacades.alert("未実装");
                    }}
                />
            ))}
        </HStack>
    </Field>
}