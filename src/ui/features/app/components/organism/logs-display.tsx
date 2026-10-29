import { Header } from "../../../../shared/components/atoms/header";
import { VStack } from "../../../../shared/components/atoms/stack";
import { List } from "../../../../shared/components/molecules/list";
import { useLogs } from "../../hooks/use-logs";
import { LogDisplay } from "../molecules/log-display";

export function LogsDisplay() {
    const logs = useLogs();

    return <VStack>
        <Header level={2}>logs</Header>
        <List list={logs}
            renderNode={log => <LogDisplay log={log} />}
        />
    </VStack>
}