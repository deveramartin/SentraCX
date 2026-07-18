"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsUpDown, Check, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navItems, systems } from "./SidebarNav";
import { SidebarProfileFooter } from "./SidebarProfileFooter";

export function Sidebar() {
  const pathname = usePathname();
  const { open, openMobile, setOpenMobile, toggleSidebar, isMobile } = useSidebar();
  const [activeAccount, setActiveAccount] = useState("admin");

  const isOpen = isMobile ? openMobile : open;

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="fixed top-3.5 left-4 z-[70] bg-card border border-border shadow-md h-9 w-9 rounded-lg flex items-center justify-center cursor-pointer text-foreground hover:bg-accent transition-transform duration-200 hover:scale-105"
        title="Toggle Sidebar"
      >
        <Menu className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <>
      {isMobile && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[55] animate-in fade-in duration-200"
        />
      )}
      <aside className="fixed left-0 top-0 h-full w-64 flex flex-col py-6 border-r border-border bg-sidebar text-sidebar-foreground z-[60] transition-all duration-300 shadow-xl md:shadow-none animate-in slide-in-from-left duration-300">
        {/* Logo & System Switcher Header + Close Button */}
        <div className="px-4 mb-6 flex items-center justify-between gap-1">
          <div className="flex-1 min-w-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors group">
                  <div className="flex flex-col min-w-0 pr-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-sidebar-foreground truncate">
                      Bren Raphael&apos;s
                    </h1>
                    <p className="text-xs font-semibold text-muted-foreground truncate mt-0.5">
                      Customer Relationship Management
                    </p>
                  </div>
                  <ChevronsUpDown className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-sidebar-foreground transition-colors" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-popover border-border text-popover-foreground z-[999]" align="start" side="bottom">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold">
                  Select Enterprise Module
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                {systems.map((sys) => {
                  const SysIcon = sys.icon;
                  return (
                    <DropdownMenuItem
                      key={sys.fullName}
                      className="cursor-pointer text-xs flex items-center justify-between py-2.5 px-3 hover:bg-accent font-medium"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <SysIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex flex-col overflow-hidden">
                          <span className={`font-semibold truncate ${sys.active ? "text-foreground font-bold" : ""}`}>
                            {sys.fullName}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate">{sys.desc}</span>
                        </div>
                      </div>
                      {sys.active && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-sidebar-foreground h-8 w-8 rounded-lg shrink-0 cursor-pointer"
            title="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 overflow-y-auto space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground font-medium"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile Footer */}
        <SidebarProfileFooter activeAccount={activeAccount} onSelectAccount={setActiveAccount} />
      </aside>
    </>
  );
}
