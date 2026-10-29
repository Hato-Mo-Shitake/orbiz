import { PlainDateList } from "../../../../../_shared/plain-date-list.vo";
import { Header } from "../../../../shared/components/atoms/header";
import { VStack } from "../../../../shared/components/atoms/stack";
import { Field } from "../../../../shared/components/molecules/field";
import { List } from "../../../../shared/components/molecules/list";
import { DRecordLink } from "../../../note-sub/d-record/components/molecules/d-record-link";
import { NoteLink } from "../../../note/components/molecules/note-link";
import { useTopNoteIdList } from "../../../note/hooks/reactive/use-top-note-id-list";
import { useToday } from "../../hooks/use-today";

export function OrbizHome() {
    const topNoteIdList = useTopNoteIdList();
    const today = useToday();
    const thisWeek = PlainDateList.fromBetween({
        from: today.addWeeks(-1),
        to: today,
        operator: "<=_x_<"
    });

    return <VStack>
        <Header level={1}>Orbiz Home</Header>
        <Field label="Top Notes" labelSize="lg">
            <List
                list={topNoteIdList.value}
                renderNode={id => <NoteLink noteId={id} />}
            />
        </Field>

        <Field label="This Week" labelSize="lg">
            <DRecordLink src={today} />
            <List
                list={thisWeek.toArray().reverse()}
                renderNode={pd => <DRecordLink src={pd} />}
            />
        </Field>
    </VStack>
}