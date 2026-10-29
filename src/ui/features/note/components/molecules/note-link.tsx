import { extractBaseNameFromPath } from "../../../../../_shared/utils"
import { NoteId } from "../../../../../domain/note"
import { Text } from "../../../../shared/components/atoms/text"
import { FileLink } from "../../../app/components/molecules/file-link"
import { useNotePathString } from "../../hooks/reactive/use-note-path-string"

type Props = {
    noteId: NoteId | string,
}

export const NoteLink = ({ noteId }: Props) => {
    const path = useNotePathString(noteId);

    return (<>{
        path ?
            < FileLink
                label={extractBaseNameFromPath(path)}
                path={path}
            /> : <Text variant="error">Not found path by id: {noteId.toString()}</Text>
    }</>)
}