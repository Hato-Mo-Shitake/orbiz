import { AnyNote, NoteCollection, NoteFilter, NoteIdList } from "../..";
import { DateTime } from "../../../../_shared/date-time.vo";
import { ReadonlyTreeNode, TreeNode } from "../../../../_shared/types";
import { collectTreeNodes, filterTree } from "../../../../_shared/utils";
import { filterNote } from "./filter-note.service";


export class NoteTreeCollection {
    private _tree: TreeNode<AnyNote>;

    private _lazyCollection: NoteCollection | undefined = undefined;
    private _lazyReachableNeighbors: NoteCollection | undefined = undefined;

    private constructor(noteTree: TreeNode<AnyNote>) {
        this._tree = noteTree;
    }

    static from(tree: TreeNode<AnyNote>): NoteTreeCollection {
        return new NoteTreeCollection(tree);
    }

    get value(): ReadonlyTreeNode<AnyNote> {
        return this._tree;
    }

    get root(): AnyNote {
        return this._tree.node;
    }

    get neighbors(): ReadonlyTreeNode<AnyNote>[] | undefined {
        return this._tree.neighbors;
    }

    get ids(): NoteIdList {
        return this.toCollection().ids
    }

    getReachableNeighbors(): NoteCollection {
        if (!this._lazyReachableNeighbors) {
            this._lazyReachableNeighbors = NoteCollection.from(collectTreeNodes(this._tree, false));
        }

        return this._lazyReachableNeighbors;
    }

    toCollection(): NoteCollection {
        if (!this._lazyCollection) {
            this._lazyCollection = NoteCollection.from(collectTreeNodes(this._tree));
        }

        return this._lazyCollection;
    }

    filter(filter: NoteFilter, now: DateTime): NoteTreeCollection | undefined {
        const filteredTree = filterTree(this._tree, (note) => filterNote(note, filter, now));
        return filteredTree ? NoteTreeCollection.from(filteredTree) : undefined;
    }
}