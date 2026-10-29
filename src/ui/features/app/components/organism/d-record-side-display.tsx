
import { DRecordSrc } from "../../../../../app/orbiz-resolver.types"
import { VStack } from "../../../../shared/components/atoms/stack"
import { Text } from "../../../../shared/components/atoms/text"
import { Field } from "../../../../shared/components/molecules/field"
import { DRecordLink } from "../../../note-sub/d-record/components/molecules/d-record-link"
import { DRecordNotesField } from "../../../note-sub/d-record/components/molecules/d-record-notes-field"
import { useGetDRecord } from "../../../note-sub/d-record/hooks/get/use-get-d-record"

type Props = {
    src: DRecordSrc
}

export const DRecordSideDisplay = ({
    src
}: Props) => {
    const get = useGetDRecord();
    const dRecord = get(src)

    // eslint-disable-next-line @typescript-eslint/no-base-to-string -- この値を文字列化する意図があるため
    if (!dRecord) return <Text variant="error">Not found d-record: {src.toString()}</Text>
    // eslint-enable @typescript-eslint/no-base-to-string

    return (
        <VStack>
            <DRecordLink src={dRecord.path} format="yyyy-MM-dd_EEE" />

            <Field label="d-record notes" labelSize="lg">
                <VStack gap={3}>
                    <DRecordNotesField dRecord={dRecord} dateKey="createdAt" />
                    <DRecordNotesField dRecord={dRecord} dateKey="modifiedAt" />
                    <DRecordNotesField dRecord={dRecord} dateKey="entryModifiedAt" />
                    <DRecordNotesField dRecord={dRecord} dateKey="startedAt" />
                    <DRecordNotesField dRecord={dRecord} dateKey="dueAt" />
                    <DRecordNotesField dRecord={dRecord} dateKey="resolvedAt" />
                </VStack>
            </Field>
        </VStack>
    )
}