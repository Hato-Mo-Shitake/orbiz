import { useState } from "react";
import { AnyNoteSemanticOutlinksKey, NoteId } from "../../../../../domain/note";
import { Button } from "../../../../shared/components/atoms/button";
import { HStack } from "../../../../shared/components/atoms/stack";
import { Field } from "../../../../shared/components/molecules/field";
import { List } from "../../../../shared/components/molecules/list";
import { SegmentedControl } from "../../../../shared/components/molecules/segmented-control";
import { TreeList } from "../../../../shared/components/molecules/tree-list";
import { FileLink } from "../../../app/components/molecules/file-link";
import { useNoteSemanticLinkTree } from "../../hooks/reactive/use-note-semantic-link-tree";
import { useFilterNoteTree } from "../../hooks/use-filter-note-tree";
import { useFilterNotes } from "../../hooks/use-filter-notes";

type Props = {
    noteId: NoteId,
    linkKey: AnyNoteSemanticOutlinksKey,
    direction: "outlink" | "inlink"
}

export function NoteSemanticLinkTreeField({
    noteId, linkKey, direction
}: Props) {
    const [displayType, setDisplayType] = useState<string>("tree");

    const originalNoteTree = useNoteSemanticLinkTree(noteId, linkKey, direction);

    const filterTree = useFilterNoteTree(originalNoteTree);
    const filteredTree = filterTree.filteredNoteTree;
    const handleTree = filterTree.openModalAndHandleFilter;

    const originalNotes = originalNoteTree?.getReachableNeighbors();
    const filterList = useFilterNotes(originalNotes);
    const filteredList = filterList.filteredNotes;
    const handleList = filterList.openModalAndHandleFilter;

    const handleFilter = async () => {
        if (displayType === "tree") {
            await handleTree();
        } else if (displayType === "list") {
            await handleList();
        }
    }

    const tree = () => {
        if (!filteredTree) return null;
        return filteredTree.value.neighbors?.map(node => {
            return <TreeList
                key={node.node.id.value}
                root={node}
                renderNode={note => {
                    return <FileLink
                        label={note.name.value}
                        path={note.path.value}
                    />
                }}
            />
        })
    }
    const list = () => {
        if (!filteredList) return null;
        return <List
            list={filteredList.value}
            renderNode={note => <FileLink
                label={note.name.value}
                path={note.path.value}
            />}
        />
    }

    return <>
        <Field label={
            <HStack>
                {linkKey}
                <Button onClick={handleFilter}>filter</Button>
                <SegmentedControl
                    options={["tree", "list"].map(v => ({ label: v, value: v }))}
                    value={displayType}
                    onChange={setDisplayType}
                />
            </HStack>
        }>
            {displayType === "tree" && tree()}
            {displayType === "list" && list()}
        </Field>
    </>
}