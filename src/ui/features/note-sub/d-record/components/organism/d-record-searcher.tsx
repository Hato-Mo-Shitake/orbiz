import { useState } from "react";
import { DRecord } from "../../../../../../domain/note-sub/d-record";
import { Divider } from "../../../../../shared/components/atoms/divider";
import { MonthInput } from "../../../../../shared/components/atoms/month-input";
import { VStack } from "../../../../../shared/components/atoms/stack";
import { List } from "../../../../../shared/components/molecules/list";
import { useGetDRecordsByYM } from "../../hooks/get/use-get-d-record";
import { DRecordLink } from "../molecules/d-record-link";


type Props = {
    onDRecordOpened?: (path: string) => void,
}
export function DRecordSearcher({ onDRecordOpened }: Props) {
    const getDRecords = useGetDRecordsByYM();
    const [dList, setDList] = useState<DRecord[]>([]);
    const [ym, setYm] = useState<string | null>(null);
    const handleChange = (ym: string | null) => {
        setYm(ym);
        if (ym) {
            setDList(getDRecords(ym))
        }
    }

    return (<VStack>
        <MonthInput
            value={ym}
            onChange={handleChange}
        />

        <Divider />

        <List
            list={dList}
            renderNode={d => <DRecordLink src={d.path} onOpened={onDRecordOpened} />}
        />
    </VStack>)
} 