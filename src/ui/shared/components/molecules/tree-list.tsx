import { ReactNode } from "react";
import { TreeNode } from "../../../../_shared/types";

type TreeListProps<T> = {
    root: TreeNode<T>;
    renderNode: (node: T) => ReactNode;
};

export function TreeList<T>({ root, renderNode }: TreeListProps<T>) {
    return (
        <ul>
            <li>
                {renderNode(root.node)}
                {root.neighbors && root.neighbors.length > 0 && (
                    <ul>
                        {root.neighbors.map((neighbor, index) => (
                            <li key={index}>
                                {renderNode(neighbor.node)}
                                {neighbor.neighbors && neighbor.neighbors.length > 0 && (
                                    <TreeList
                                        root={neighbor}
                                        renderNode={renderNode}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        </ul>
    );
}