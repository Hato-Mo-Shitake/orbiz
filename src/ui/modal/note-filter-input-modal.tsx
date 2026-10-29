import { ResultModalProps } from "../../app/modal.types";
import { OrbizResolver } from "../../app/orbiz-resolver.types";
import { OrbizSpace } from "../../app/orbiz-space.types";
import { StoreMap } from "../../app/stores/store.types";
import { NoteFilter } from "../../domain/note";
import { OrbizResolverContext, OrbizSpaceContext, StoreContext } from "../context/context";


import { useState } from "react";
import { NoteTagList } from "../../domain/note";
import { NoteKindMultiSelect } from "../features/note/components/molecules/note-kind-multi-select";
import { NoteTagMultiSelect } from "../features/note/components/molecules/note-tag-multi-select";
import { Button } from "../shared/components/atoms/button";
import { VStack } from "../shared/components/atoms/stack";
import { Field } from "../shared/components/molecules/field";
import { SegmentedControl } from "../shared/components/molecules/segmented-control";


type Props = {
    defaultFilter?: NoteFilter
    onSubmit: (filter: NoteFilter) => void,
}
function NoteFilterInputModal(
    { defaultFilter, onSubmit }: Props
) {
    const [filter, setFilter] = useState<NoteFilter>(defaultFilter || {});

    const setAttr = <K extends keyof NoteFilter>(
        key: K,
        value: NoteFilter[K]
    ) => {
        setFilter(prev => ({
            ...prev,
            [key]: value
        }));
    }

    return (<>
        <VStack>
            <Field label="in kinds">
                <NoteKindMultiSelect
                    kinds={filter["kind"]?.inKinds || []}
                    onChange={kinds => setAttr("kind", { inKinds: kinds })}
                />
            </Field>
            <Field label="tags">
                <SegmentedControl
                    options={["union", "intersect"].map(v => ({ value: v, label: v }))}
                    value={filter.tag?.type || "union"}
                    onChange={type => {
                        setAttr("tag", {
                            type: (type as "union" | "intersect"),
                            tags: filter.tag?.tags || NoteTagList.empty(),
                        })
                    }}
                />
                <NoteTagMultiSelect
                    tags={filter.tag?.tags || NoteTagList.empty()}
                    onChange={tags => {
                        setAttr("tag", {
                            type: filter.tag?.type || "union",
                            tags: tags,
                        })
                    }}
                />
            </Field>

            <Button onClick={() => {
                onSubmit(filter)
            }}>
                Filter
            </Button>
        </VStack>
    </>)
}

type BaseProps = {
    orbizSpace: OrbizSpace,
    orbizResolver: OrbizResolver,
    storeMap: StoreMap,
    filter?: NoteFilter,
}
type Result = NoteFilter;

export function renderNoteFilterInputModal({
    orbizSpace,
    orbizResolver,
    storeMap,
    filter,
    onSubmit,
    onClose
}: ResultModalProps<BaseProps, Result>) {
    return (
        <StoreContext.Provider value={storeMap}>
            <OrbizSpaceContext.Provider value={orbizSpace}>
                <OrbizResolverContext.Provider value={orbizResolver}>
                    <NoteFilterInputModal
                        defaultFilter={filter}
                        onSubmit={onSubmit}
                    />
                </OrbizResolverContext.Provider>
            </OrbizSpaceContext.Provider>
        </StoreContext.Provider>
    )

}