import { CSSProperties } from "react";

type SelectOption = {
    value: string;
    label: string;
};

type SelectGroup = {
    label: string,
    options: SelectOption[];
}

type SelectProps = {
    options: (SelectOption | SelectGroup)[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    className?: string
};

const isGroup = (opt: SelectOption | SelectGroup): opt is SelectGroup => {
    return (opt as SelectGroup).options !== undefined;
}

export const Select = ({
    options,
    value,
    onChange,
    disabled = false,
    className = '',
}: SelectProps) => {
    const style: CSSProperties = {
        height: 'var(--input-height)',
        backgroundColor: 'var(--background-modifier-form-field)',
        color: 'var(--text-normal)',
        border: '1px solid var(--background-modifier-border)',
        borderRadius: 'var(--input-radius)',
        padding: '0 var(--size-4-6) 0 var(--size-4-2)',
        fontSize: 'var(--font-ui-medium)',
        cursor: disabled ? 'not-allowed' : 'pointer',
    };

    return (
        <div
            className="select-atom"
            style={{ position: 'relative', display: 'inline-block' }}
        >
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`dropdown ${className}`}
                style={style}
            >
                {options.map((opt, index) => {
                    if (isGroup(opt)) {
                        return (
                            <optgroup key={`group-${index}`} label={opt.label}>
                                {opt.options.map((subOpt) => (
                                    <option key={subOpt.value} value={subOpt.value}>
                                        {subOpt.label}
                                    </option>
                                ))}
                            </optgroup>
                        );
                    }
                    return (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}