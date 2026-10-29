import { useState } from "react";
import { Button } from "../atoms/button";
import { HStack, VStack } from "../atoms/stack";
import { MultiSelectStack } from "./multi-select-stack";
import { SuggestInput } from "./suggest-input";

type MultiSelectProps = {
    options: readonly string[];
    values: readonly string[]; // 選択済みの配列
    onChange: (values: string[]) => void;
    placeholder?: string;
    allowAddNew?: boolean;
};

export const MultiSelect = ({
    options,
    values,
    onChange,
    placeholder = '',
    allowAddNew = false,
}: MultiSelectProps) => {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = (val: string) => {
        const target = val.trim();
        if (target && !values.includes(target)) {
            onChange([...values, target]);
            setInputValue('');
        }
    }

    const handleAddNew = () => {
        const target = inputValue.trim();

        if (
            target &&
            !options.includes(target) &&
            !values.includes(target)
        ) {
            onChange([...values, target]);
            setInputValue("");
        }
    };

    return (
        <VStack gap={1} className="multi-select-molecule">
            <HStack gap={1}>
                <SuggestInput
                    suggests={options}
                    value={inputValue}
                    onChange={setInputValue}
                    onSelect={handleAdd}
                    placeholder={placeholder}
                />
                {allowAddNew && (
                    <Button
                        variant="primary"
                        onClick={handleAddNew}
                        disabled={!inputValue.trim() || options.includes(inputValue.trim())}
                    >
                        Add New
                    </Button>
                )}
            </HStack>
            <MultiSelectStack
                values={values}
                onChange={onChange}
                isAccent={(value) => !options.includes(value)}
            />
        </VStack>
    )
}