import React from "react";
import { PlainDate } from "../../../../_shared/plain-date.vo";
import { Button } from "./button";
import { HStack } from "./stack";

type DateInputProps = {
    value: PlainDate | null;
    onChange: (value: PlainDate | undefined) => void;
};

export const DateInput = ({
    value,
    onChange
}: DateInputProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!value) {
            onChange(undefined);
            return;
        }

        const pd = PlainDate.tryFrom(value);
        onChange(pd);
    }

    return (
        <HStack>
            <input
                type="date"
                value={value?.toString() || ""}
                onChange={handleChange}
                style={{
                    padding: 'var(--size-4-1) var(--size-4-2)',
                    paddingLeft: '1.5rem',
                    backgroundColor: 'var(--background-modifier-form-field)',
                    border: 'var(--border-width) solid var(--background-modifier-border)',
                    borderRadius: 'var(--input-radius)',
                    color: 'var(--text-normal)',
                    fontFamily: 'inherit'
                }}
            />
            <Button
                onClick={() => onChange(undefined)}
            >Clear</Button>
        </HStack>
    )
}