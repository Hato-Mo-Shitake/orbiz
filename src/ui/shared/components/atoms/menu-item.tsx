import { ReactNode } from "react";

type MenuItemProps = {
    label: string,
    description?: string, // 補足説明
    icon?: ReactNode,
    hint?: string, // ショートカットキーやステータス
    isActive?: boolean, // キーボード選択されている状態
    disabled?: boolean,
    onClick: () => void;
};

export const MenuItem = ({
    label,
    description,
    icon,
    hint,
    isActive,
    disabled,
    onClick
}: MenuItemProps) => {
    return (
        <div
            className={`menu-item-atom ${isActive ? 'is-active' : ''} ${disabled ? 'is-disabled' : ''}`}
            onClick={!disabled ? onClick : undefined}
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--size-4-2) var(--size-4-4)',
                cursor: disabled ? 'pointer' : 'pointer',
                backgroundColor: isActive ? 'var(--background-modifier-hover)' : 'transparent',
                opacity: disabled ? 0.5 : 1,
                userSelect: 'none',
                gap: 'var(--size-4-3)',
                border: 'var(--border-width) dashed var(--background-modifier-border)'
            }}
        >
            {icon && (
                <div style={{
                    display: 'flex',
                    color: isActive ? 'var(--text-accent)' : 'var(--text-muted)',
                    flexShrink: 0,
                }}>
                    {icon}
                </div>
            )}

            <div style={{ flexGrow: 1, minWidth: 0 }}>
                <div style={{
                    color: isActive ? 'var(--text-accent)' : 'var(--text-normal)',
                    fontSize: 'var(--font-ui-small)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {label}
                </div>
                {description && (
                    <div style={{
                        fontSize: 'var(--font-ui-smaller)',
                        color: 'var(--text-faint) ',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>
                        {description}
                    </div>
                )}
            </div>

            {hint && (
                <div style={{
                    fontSize: 'var(--font-ui-smaller)',
                    color: 'var(--text-faint)',
                    backgroundColor: isActive ? 'var(--background-modifier-border)' : 'transparent',
                    padding: '0 var(--size-4-1)',
                    borderRadius: 'var(--radius-s)',
                    flexShrink: 0,
                }}>
                    {hint}
                </div>
            )}
        </div>
    );
};