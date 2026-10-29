import { ReactNode } from "react";
import { Grid } from "./grid";

type WithSidebarProps = {
    sidebar: ReactNode,
    main: ReactNode,
    sidebarWidth?: string,
    height?: string;
    gap?: 0 | 1 | 2 | 3 | 4 | 5
};

export const WidthSidebar = ({
    sidebar,
    main,
    sidebarWidth = '20%',
    height = '100%',
    gap = 1
}: WithSidebarProps) => (
    <Grid
        template={`${sidebarWidth} 1fr`}
        gap={gap}
        style={{
            height: height,
            minHeight: 0,
            alignItems: 'stretch'
        }}
    >
        <aside style={{
            borderRight: gap === 0 ? `var(--border-width) solid var(--background-modifier-border)` : 'none',
            overflowY: 'auto',
            backgroundColor: `var'(--background-secondary)`
        }}>
            {sidebar}
        </aside>
        <main
            style={{
                overflowY: 'auto',
                backgroundColor: 'var(--background-primary)'
            }}
        >
            {main}
        </main>
    </Grid>
)