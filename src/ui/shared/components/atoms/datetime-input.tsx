import React, { useState } from "react";
import { DateTime } from "../../../../_shared/date-time.vo";
import { UtilsFacades } from "../../../../_shared/utils-facades";
import { Button } from "./button";
import { HStack } from "./stack";

type DatetimeInputProps = {
    value: DateTime | null;
    onChange: (value: DateTime | null) => void;
    enableModeSwitch?: boolean;
    defaultMode?: "date" | "datetime";
};

export const DatetimeInput = ({
    value,
    onChange,
    enableModeSwitch = false,
    defaultMode = "datetime",
}: DatetimeInputProps) => {
    const [mode, setMode] = useState<"date" | "datetime">(defaultMode);

    const inputValue =
        value === null
            ? ""
            : value.toString(
                mode === "date" ? "yyyy-MM-dd" : "yyyy-MM-dd'T'HH:mm:ss",
            );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        if (!inputValue) {
            onChange(null);
            return;
        }

        const dateTimeInput =
            mode === "datetime" ? `${inputValue}:00` : inputValue;

        onChange(DateTime.from(dateTimeInput));
    };

    return (
        <HStack align="center">
            <input
                type={mode === "date" ? "date" : "datetime-local"}
                step={mode === "datetime" ? 600 : undefined}
                value={inputValue}
                onChange={handleChange}
                style={{
                    padding: "var(--size-4-1) var(--size-4-2)",
                    paddingLeft: "1.5rem",
                    backgroundColor: "var(--background-modifier-form-field)",
                    border: "var(--border-width) solid var(--background-modifier-border)",
                    borderRadius: "var(--input-radius)",
                    color: "var(--text-normal)",
                    fontFamily: "inherit",
                }}
            />

            <Button onClick={() => onChange(UtilsFacades.clock.nowDateTime())}
            >now</Button>
            <Button onClick={() => onChange(null)}>clear</Button>

            {enableModeSwitch && (
                <>
                    <Button
                        variant={mode === "datetime" ? "primary" : "secondary"}
                        onClick={() => {
                            if (mode === "datetime") {
                                setMode("date")
                            } else {
                                setMode("datetime")
                            }
                        }}
                    >
                        DateTime
                    </Button>
                    {/* <label>
                        <input
                            type="radio"
                            checked={mode === "date"}
                            onChange={() => setMode("date")}
                        />
                        Date
                    </label>
                    <label>
                        <input
                            type="radio"
                            checked={mode === "datetime"}
                            onChange={() => setMode("datetime")}
                        />
                        Datetime
                    </label> */}
                </>
            )}
        </HStack>
    );
};