import { ReactNode } from "react";

type ListProps<T> = {
    list: readonly T[];
    renderNode: (node: T) => ReactNode;
}

export function List<T>({ list, renderNode }: ListProps<T>) {
    return (
        <ul style={{ marginTop: "0.3rem" }}>
            {list.map((node, index) => (
                <li key={index}>
                    {renderNode(node)}
                </li>
            ))}
        </ul>
    )
}