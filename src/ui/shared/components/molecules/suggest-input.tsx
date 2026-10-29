import React, { Fragment, useEffect, useState } from "react";
import { MenuItem } from "../atoms/menu-item";
import { Popover } from "../atoms/popover";
import { TextInput } from "../atoms/text-input";

export type SuggestInputProps = {
    suggests: readonly string[];
    value?: string,
    onChange?: (value: string) => void;
    onSelect?: (value: string) => void;
    onMatch?: (value: string) => void,
    isError?: boolean;
    disabled?: boolean;
    placeholder?: string;
    iconMap?: Map<string, React.ReactNode>;
    descriptionMap?: Map<string, string>;
    hintMap?: Map<string, string>;
    className?: string;
};

export const SuggestInput = ({
    suggests,
    value,
    onChange,
    onSelect,
    onMatch,
    placeholder,
    isError,
    disabled,
    iconMap,
    descriptionMap,
    hintMap,
    className,
}: SuggestInputProps) => {
    const [privateValue, setPrivateValue] = useState('');
    const currentValue = value !== undefined ? value : privateValue;

    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    // const containerRef = useRef<HTMLDivElement>(null);

    // 一致判定
    const isMatched = suggests.some(value => value === currentValue);

    const filtered = suggests.filter(value => value.toLocaleLowerCase().includes(currentValue.toLocaleLowerCase()));

    const handleValueChange = (newValue: string) => {
        if (value === undefined) {
            setPrivateValue(newValue.trim());
        }
        onChange?.(newValue.trim());
        setIsOpen(true);
        setActiveIndex(0);
    };

    const selectValue = (value: string) => {
        handleValueChange(value.trim());
        onSelect?.(value.trim());
        setIsOpen(false);
    };

    useEffect(() => {
        if (onMatch && isMatched) {
            onMatch?.(currentValue.trim());
        }
    }, [isMatched])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || filtered.length === 0) return;

        const actions: Record<string, (e: React.KeyboardEvent) => void> = {
            ArrowDown: () => setActiveIndex((prev) => (prev + 1) % filtered.length),
            ArrowUp: () => setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length),
            Enter: (e: React.KeyboardEvent) => {
                if (filtered[activeIndex] && !e.nativeEvent.isComposing) {
                    selectValue(filtered[activeIndex]);
                }
            },
            Escape: () => setIsOpen(false),
        };

        if (actions[e.key]) {
            e.preventDefault();
            actions[e.key]?.(e);
        }
    };

    const inputStyle: React.CSSProperties = React.useMemo(() => {
        if (isMatched) {
            return {
                borderColor: 'var(--interactive-accent)',
                boxShadow: '0 0 0 1px var(--interactive-accent)'
            };
        } else {
            return {};
        }
    }, [isMatched]);

    return (
        <div
            style={{
                position: 'relative',
                // NOTE: width: '100%' こいつのせいで要素を横並びにできなくなっていた。
            }}
            className={`suggest-input-molecule ${className}`}
            onKeyDown={handleKeyDown}
            onBlur={() => window.setTimeout(() => setIsOpen(false), 150)}
        >
            <TextInput
                value={currentValue}
                placeholder={placeholder}
                onChange={handleValueChange}
                isError={isError}
                disabled={disabled}
                style={inputStyle}
                onFocus={() => setIsOpen(true)}
            // onKeyDown={handleKeyDown}
            />
            {isOpen && filtered.length > 0 && (
                <Popover>
                    {filtered.map((value, index) => (
                        <Fragment key={value}>
                            <MenuItem
                                label={value}
                                description={descriptionMap?.get(value)}
                                icon={iconMap?.get(value)}
                                hint={hintMap?.get(value)}
                                isActive={index === activeIndex}
                                onClick={() => selectValue(value)}
                            />
                        </Fragment>
                    ))}
                </Popover>
            )}
        </div>
    );
}