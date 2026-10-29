import React from "react";
import { Button } from "./button";
import { HStack } from "./stack";

type Props = {
    value: string | null;
    onChange: (value: string | null) => void;
};

export const MonthInput = ({
    value,
    onChange
}: Props) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!value) {
            onChange(null);
            return;
        }

        onChange(value);
    }

    return (
        <HStack>
            <input
                type="month"
                value={value || ""}
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
                onClick={() => onChange(null)}
            >Clear</Button>
        </HStack>
    )
}