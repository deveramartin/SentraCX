"use client";

import React from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

function MainContent({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();

  return (
    <div
      className={`flex-1 flex flex-col min-w-0 pb-16 md:pb-0 transition-[margin] duration-300 ${
        open ? "md:ml-64" : "md:ml-0"
      }`}
    >
      {/* Top Header Shell */}
      <Header />

      {/* Main Canvas */}
      <main className="flex-1 w-full bg-background relative overflow-hidden animate-in fade-in duration-300">
        {children}
      </main>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background text-foreground relative">
        {/* Sidebar Shell */}
        <Sidebar />

        {/* Content Area Container */}
        <MainContent>{children}</MainContent>

        {/* Mobile Navigation Shell */}
        <MobileNav />
      </div>
    </SidebarProvider>
  );
}
