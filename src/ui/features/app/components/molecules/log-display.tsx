import { Log } from "../../../../../app/stores/log-store.types"

type Props = {
    log: Log
}

export function LogDisplay({ log }: Props) {
    return <div>
        <div>kind: {log.kind}</div>
        <div>message: {log.message}</div>
        <div>occur: {log.createdAt.toString("yyyy-MM-dd'T'HH:mm:ss")}</div>
    </div>
}