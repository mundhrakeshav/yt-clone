import { AppShell, Navbar } from "@mantine/core";
import React from "react";

function HomePageLayout({children}: {children : React.ReactNode}) {
    return <AppShell
        padding="md"
        navbar={<Navbar>{children}</Navbar>}
    >{children}</AppShell>
}

export default HomePageLayout