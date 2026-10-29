import { DateTime } from "../../../../../_shared/date-time.vo"
import { AnyNoteDateKey, noteDatesKeysMap, NoteKind } from "../../../../../domain/note"
import { DatetimeInput } from "../../../../shared/components/atoms/datetime-input"
import { Pill } from "../../../../shared/components/atoms/pill"
import { HStack, VStack } from "../../../../shared/components/atoms/stack"
import { Text } from "../../../../shared/components/atoms/text"
import { Field } from "../../../../shared/components/molecules/field"
import { AnyNoteSemanticDateRecord } from "../note.types"

type Props = {
    kind: NoteKind,
    dates: AnyNoteSemanticDateRecord,
    onChange: (dates: AnyNoteSemanticDateRecord) => void,
    originalDates?: AnyNoteSemanticDateRecord
}

export const NoteSemanticDatesInput = ({
    kind,
    dates,
    onChange,
    originalDates
}: Props) => {
    const datesKeys = noteDatesKeysMap[kind];

    const updateDate = (dateKey: AnyNoteDateKey, value: DateTime | null) => {
        onChange({
            ...dates,
            [dateKey]: value,
        });
    };

    return (<>
        <VStack>

            {datesKeys.map((dateKey) => {
                if (dateKey === "createdAt" || dateKey === "entryModifiedAt") return null;
                return <Field key={dateKey} label={
                    originalDates
                        ? getLabelWithChanged(
                            dateKey,
                            !equalsDates(originalDates?.[dateKey], dates[dateKey])
                        )
                        : dateKey
                }>
                    <DatetimeInput
                        value={dates[dateKey]}
                        onChange={(value) => updateDate(dateKey, value)}
                        enableModeSwitch
                        defaultMode="date"
                    />
                </Field>
            })}
        </VStack>
    </>)
}

function equalsDates(d1: DateTime | null | undefined, d2: DateTime | null | undefined) {
    if (d1 instanceof DateTime && d2 instanceof DateTime) return d1.equals(d2);
    return d1 === d2;
}

function getLabelWithChanged(label: string, changed: boolean | undefined) {
    return <HStack>
        <Text weight="bold">{label}</Text>
        {changed && <Pill label="changed" variant="accent" />}
    </HStack>
}