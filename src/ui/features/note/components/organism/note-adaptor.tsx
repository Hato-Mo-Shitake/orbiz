import { useState } from "react";
import { Path } from "../../../../../_shared/path.vo";
import { AnyNote } from "../../../../../domain/note";
import { useAdaptFileToNote } from "../../../../app-hooks/command/use-adapt-file-to-note";
import { Header } from "../../../../shared/components/atoms/header";
import { Text } from "../../../../shared/components/atoms/text";
import { CreateNoteForm } from "./create-note-form";
import { DefaultNoteCreatorParams } from "./note-creator.types";

type Props = {
    filePath: Path,
    defaultParams?: DefaultNoteCreatorParams,
    onAdapted?: (note: AnyNote) => unknown;
}

export function NoteAdaptor({
    filePath,
    defaultParams,
    onAdapted
}: Props) {
    const [isProcessing, setIsProcessing] = useState(false);
    const adapt = useAdaptFileToNote({ onAdapted, setIsProcessing });

    return <>
        <Text>
            file path to adapt: {filePath.value}
        </Text>
        <Header level={2}>Create Note</Header>
        <CreateNoteForm
            onCreate={async (request) => {
                await adapt({
                    filePath,
                    createNoteRequest: request,
                });
            }}
            isProcessing={isProcessing}
            defaultParams={defaultParams}
        />
    </>

}