import { AnyNoteSemanticOutlinksKey, NoteId } from "../../../../../domain/note";
import { Button } from "../../../../shared/components/atoms/button";
import { HStack } from "../../../../shared/components/atoms/stack";
import { Field } from "../../../../shared/components/molecules/field";
import { List } from "../../../../shared/components/molecules/list";
import { FileLink } from "../../../app/components/molecules/file-link";
import { useNoteSemanticLinks } from "../../hooks/reactive/use-note-semantic-links";
import { useFilterNotes } from "../../hooks/use-filter-notes";

type Props = {
    noteId: NoteId,
    linkKey: AnyNoteSemanticOutlinksKey,
    direction: "outlink" | "inlink"
}

export function NoteSemanticLinksField({
    noteId, linkKey, direction
}: Props) {
    const originalNotes = useNoteSemanticLinks(noteId, linkKey, direction);
    const { filteredNotes, openModalAndHandleFilter } = useFilterNotes(originalNotes);

    if (originalNotes?.isEmpty()) return null;

    return <Field label={<HStack>
        {linkKey} <Button onClick={openModalAndHandleFilter}>filter</Button>
    </HStack>
    }>{
            filteredNotes && <List
                list={filteredNotes.value}
                renderNode={note => <FileLink
                    label={note.name.value}
                    path={note.path.value}
                />}
            />
        }
    </Field>
}