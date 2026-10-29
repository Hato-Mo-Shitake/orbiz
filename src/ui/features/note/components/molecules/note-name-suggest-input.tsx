import { useState } from "react";
import { NoteKind, NoteName } from "../../../../../domain/note";
import { HStack } from "../../../../shared/components/atoms/stack";
import { SuggestInput } from "../../../../shared/components/molecules/suggest-input";
import { useNoteNameListByKind } from "../../hooks/reactive/use-note-name-list-by-kind";
import { NoteKindSelect } from "./note-kind-select";

type Props = {
    defaultKind?: NoteKind;
    value?: string,
    onChange?: (value: string) => void;
    onSelect?: (name: NoteName) => void;
    onMatch?: (name: NoteName) => void,
};

export const NoteNameSuggestInput = ({
    defaultKind = "knowledge",
    value,
    onChange,
    onSelect,
    onMatch
}: Props) => {
    const [kind, setKind] = useState(defaultKind);
    const nameSuggests = useNoteNameListByKind(kind);
    // if (!nameSuggests) return <NotFoundError target="useNoteNameListByKind" />
    const suggests = nameSuggests.toStringArray();

    return (<>
        <HStack wrap={false}>
            <NoteKindSelect
                kind={kind}
                onChange={setKind}
                type="select"
            />
            <SuggestInput
                suggests={suggests}
                value={value}
                onChange={onChange}
                onSelect={(value: string) => {
                    onSelect?.(NoteName.from(value));
                }}
                onMatch={(value: string) => {
                    onMatch?.(NoteName.from(value));
                }}
            />
        </HStack>
    </>)
}