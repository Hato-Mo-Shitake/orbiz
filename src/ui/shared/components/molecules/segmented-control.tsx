import { Stack } from "../atoms/stack";

type Option = {
    label: string,
    value: string,
};
type SegmentedControlProps = {
    options: Option[],
    value: string,
    onChange: (value: string) => void,
    direction?: 'vertical' | 'horizon'
};

export const SegmentedControl = ({
    options,
    value,
    onChange,
    direction = 'horizon'
}: SegmentedControlProps) => (
    <Stack
        gap={0}
        direction={direction}
        style={{
            border: 'var(--border-width) solid var(--background-modifier-border)',
            borderRadius: 'var(--radius-s)',
            overflow: 'hidden'
        }}
        className="segmented-control-molecule"
    // fullWidth={direction === 'horizon' ? true : false}
    >
        {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    style={{
                        flex: 1,
                        padding: 'var(--size-4-1) var(--size-4-3)',
                        fontSize: 'var(--font-ui-small)',
                        backgroundColor: isSelected ? 'var(--interactive-accent)' : 'transparent',
                        color: isSelected ? 'var(--text-on-accent)' : 'var(--text-muted)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.1s ease'
                    }}
                >
                    {opt.label}
                </button>
                // <Fragment key={opt.value}>
                //     <Button
                //         onClick={() => onChange(opt.value)}
                //         variant={ isSelected ? "primary" : "secondary"}
                //     >
                //         {opt.label}
                //     </Button>
                // </Fragment>
            )
        })}
    </Stack>
)