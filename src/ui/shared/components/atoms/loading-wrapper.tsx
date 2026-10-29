import { Spinner } from "./spinner"

export const LoadingWrapper = ({
    label,
    isLoading
}: { label: string, isLoading: boolean }) => {
    return (
        <span
            className="loading-wrapper-atom"
            style={{
                display: 'inline-grid',
                placeItems: 'center',
                verticalAlign: 'middle'
            }}
        >
            <span style={{
                gridArea: '1 / 1',
                visibility: isLoading ? 'hidden' : 'visible',
                whiteSpace: 'nowrap'
            }}>
                {label}
            </span>
            {isLoading && (
                <span style={{ gridArea: '1 / 1' }}>
                    <Spinner />
                </span>
            )}
        </span>
    )
}