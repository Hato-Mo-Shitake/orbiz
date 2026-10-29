import { ReactNode } from "react";
import { Fragment } from "react/jsx-runtime";
import { MenuItem } from "../atoms/menu-item";
import { Popover } from "../atoms/popover";
import { VStack } from "../atoms/stack";

type Item = {
    label: string,
    description?: string, // 補足説明
    icon?: ReactNode,
    hint?: string, // ショートカットキーやステータス
    disabled?: boolean,
    onClick: () => void;
};

type MenuListProps = {
    items: Item[];
};

export const MenuList = ({ items }: MenuListProps) => (
    <Popover>
        <VStack gap={0}>
            {items.map(item => (
                <Fragment key={item.label}>
                    <MenuItem
                        {...item}
                    >
                    </MenuItem>
                </Fragment>
            ))}
        </VStack>
    </Popover>
);