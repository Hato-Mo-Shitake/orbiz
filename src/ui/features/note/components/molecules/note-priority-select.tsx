import { NotePriority, notePriorityList } from "../../../../../domain/note"
import { SegmentedControl } from "../../../../shared/components/molecules/segmented-control"

type Props = {
    priority: NotePriority,
    onChange: (priority: NotePriority) => void
}

export const NotePrioritySelect = ({
    priority, onChange
}: Props) => {
    return (
        <SegmentedControl
            options={notePriorityList.map(w => ({ label: w, value: w }))}
            value={priority.toString()}
            onChange={v => onChange(NotePriority.fromString(v))}
        />
    )
}