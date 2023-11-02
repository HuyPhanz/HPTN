import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import Content from "./Content/Content";
import Main from "./Main/Main";
import ContentHeader from "@app/components/Layout/ContentHeader/ContentHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps): JSX.Element {
  return (
    <div className="wrapper">
      <Sidebar />
      <Main>
        <Content>
          <ContentHeader />
          {children}
        </Content>
      </Main>
    </div>
  );
}
