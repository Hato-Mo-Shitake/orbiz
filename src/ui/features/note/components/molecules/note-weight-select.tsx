import { NoteWeight, noteWeightList } from "../../../../../domain/note"
import { SegmentedControl } from "../../../../shared/components/molecules/segmented-control"

type Props = {
    weight: NoteWeight,
    onChange: (weight: NoteWeight) => void
}

export const NoteWightSelect = ({
    weight, onChange
}: Props) => {
    return (
        <SegmentedControl
            options={noteWeightList.map(w => ({ label: w, value: w }))}
            value={weight.toString()}
            onChange={v => onChange(NoteWeight.fromString(v))}
        />
    )
}