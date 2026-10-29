import { NoteKind, noteKindList } from "../../../../../domain/note";
import { MultiSelect } from "../../../../shared/components/molecules/multi-select";

type Props = {
    kinds: NoteKind[];
    onChange: (kinds: NoteKind[]) => void;
};

export const NoteKindMultiSelect = ({
    kinds,
    onChange,
}: Props) => {
    const kindOptions = [...noteKindList];

    return (
        <MultiSelect
            options={kindOptions}
            values={kinds}
            onChange={v => onChange(v as NoteKind[])}
        />
    )
}