import { Header } from "../../../../shared/components/atoms/header";
import { VStack } from "../../../../shared/components/atoms/stack";
import { List } from "../../../../shared/components/molecules/list";
import { useIssues } from "../../hooks/use-issues";
import { IssueDisplay } from "../molecules/issue-display";

export function IssuesDisplay() {
    const issues = useIssues();

    return <VStack>
        <Header level={2}>issues</Header>
        <List list={issues}
            renderNode={issue => <IssueDisplay issue={issue} />}
        />
    </VStack>
}