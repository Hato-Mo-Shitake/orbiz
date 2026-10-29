import { BoardNoteKind, boardNoteKindList, MyNoteKind, myNoteKindList, NoteKind } from "../../../../../domain/note"
import { Select } from "../../../../shared/components/atoms/select"
import { VStack } from "../../../../shared/components/atoms/stack"
import { SegmentedControl } from "../../../../shared/components/molecules/segmented-control"

type Props = {
    kind: NoteKind,
    onChange: (kind: NoteKind) => void,
    type?: "select" | "segmented-control"
}

export const NoteKindSelect = ({
    kind,
    onChange,
    type = "segmented-control",
}: Props) => {
    return (<>
        {type === "select" && <Select
            options={[
                { label: "my", options: myNoteKindList.map(kind => ({ label: kind, value: kind })) },
                { label: "board", options: boardNoteKindList.map(kind => ({ label: kind, value: kind })) },
            ]}
            value={kind}
            onChange={(kind: string) => onChange(kind as NoteKind)}
        />}
        {type === "segmented-control" &&
            <VStack>
                <SegmentedControl
                    options={myNoteKindList.map(kind => ({ label: kind, value: kind }))}
                    value={kind}
                    onChange={(kind: string) => onChange(kind as MyNoteKind)}
                />
                <SegmentedControl
                    options={boardNoteKindList.map(kind => ({ label: kind, value: kind }))}
                    value={kind}
                    onChange={(kind: string) => onChange(kind as BoardNoteKind)}
                />
            </VStack>
        }
    </>)
}