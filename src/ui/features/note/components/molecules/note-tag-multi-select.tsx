import { NoteTagList } from "../../../../../domain/note";
import { MultiSelect } from "../../../../shared/components/molecules/multi-select";
import { useAllNoteTagList } from "../../hooks/reactive/use-all-note-tag-list";

type Props = {
    tags: NoteTagList;
    onChange: (tags: NoteTagList) => void;
};

export const NoteTagMultiSelect = ({
    tags,
    onChange,
}: Props) => {
    const tagList = useAllNoteTagList();
    const tagOptions = tagList.toStringArray();

    return (
        <MultiSelect
            options={tagOptions}
            values={tags.toStringArray()}
            onChange={v => onChange(NoteTagList.from(v))}
            allowAddNew={true}
        />
    )
}