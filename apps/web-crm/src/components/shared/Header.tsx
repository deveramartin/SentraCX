"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, HelpCircle, PanelLeft, CheckCheck, UserPlus, Ticket, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const rawPathname = usePathname();
  const pathname = rawPathname || "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleSidebar } = useSidebar();

  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Customers", href: "/customers" },
    { name: "Conversations", href: "/conversations" },
    { name: "Tickets", href: "/tickets" },
    { name: "Campaigns", href: "/campaigns" },
    { name: "Settings", href: "/settings" },
  ];

  const notifications = [
    {
      id: "1",
      title: "New Customer Registered",
      description: "Olivia Vance created a new regular account.",
      time: "10m ago",
      icon: UserPlus,
      unread: true,
    },
    {
      id: "2",
      title: "Ticket Resolved",
      description: "Ticket #108 (Billing discrepancy) was marked resolved.",
      time: "1h ago",
      icon: Ticket,
      unread: true,
    },
    {
      id: "3",
      title: "Campaign Scheduled",
      description: "'Summer Sale 2026' email broadcast scheduled.",
      time: "3h ago",
      icon: Megaphone,
      unread: false,
    },
  ];

  // Helper to build breadcrumb items from current path
  const getBreadcrumbItems = () => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
      return [
        { label: "CRM", href: "/" },
        { label: "Dashboard", isCurrent: true },
      ];
    }

    const items: Array<{ label: string; href?: string; isCurrent?: boolean }> = [
      { label: "CRM", href: "/customers" },
    ];

    if (segments[0] === "customers") {
      if (segments.length === 1) {
        items.push({ label: "Customers", isCurrent: true });
      } else {
        items.push({ label: "Customers", href: "/customers" });
        items.push({ label: "Detail", isCurrent: true });
      }
    } else {
      const pageName = segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
      items.push({ label: pageName, isCurrent: true });
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center w-full px-4 sm:px-6 h-16 bg-background border-b border-border">
      {/* Left: Sidebar Toggle Button & Larger Route Breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 overflow-hidden">
        {/* Sidebar Toggle Button (outside sidebar) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-muted-foreground hover:text-foreground h-9 w-9 cursor-pointer shrink-0"
          title="Toggle Sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </Button>

        {/* Mobile menu trigger */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-foreground h-9 w-9 shrink-0">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-card border-border w-64 flex flex-col pt-8">
            <h2 className="text-lg font-bold text-foreground mb-6 px-4">
              Bren Raphael's
            </h2>
            <nav className="flex-1 flex flex-col gap-1 px-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-muted text-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Larger Route Breadcrumb */}
        <Breadcrumb className="overflow-hidden">
          <BreadcrumbList className="flex-nowrap whitespace-nowrap text-sm sm:text-base font-semibold">
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator className="text-muted-foreground [&>svg]:w-4 [&>svg]:h-4" />}
                <BreadcrumbItem>
                  {item.isCurrent ? (
                    <BreadcrumbPage className="font-bold text-foreground">
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild className="text-muted-foreground hover:text-foreground font-semibold">
                      <Link href={item.href || "#"}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right: Notification Dropdown & Help */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Notification Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground relative w-8 h-8 cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <Badge className="absolute top-1.5 right-1.5 w-2 h-2 p-0 bg-destructive rounded-full" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-80 bg-popover border-border text-popover-foreground z-[999]" align="end">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <DropdownMenuLabel className="p-0 text-sm font-bold text-foreground">
                Notifications
              </DropdownMenuLabel>
              <Button variant="ghost" size="sm" className="h-auto p-0 text-[11px] text-muted-foreground hover:text-foreground gap-1">
                <CheckCheck className="w-3 h-3" /> Mark all read
              </Button>
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-border">
              {notifications.map((n) => {
                const Icon = n.icon;
                return (
                  <DropdownMenuItem
                    key={n.id}
                    className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-accent ${
                      n.unread ? "bg-accent/40 font-medium" : ""
                    }`}
                  >
                    <div className="p-1.5 rounded-full bg-muted border border-border mt-0.5 shrink-0">
                      <Icon className="w-3.5 h-3.5 text-foreground" />
                    </div>
                    <div className="flex-1 space-y-0.5 overflow-hidden">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-foreground truncate">{n.title}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">{n.description}</p>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </div>

            <DropdownMenuSeparator className="bg-border m-0" />
            <div className="p-2 text-center">
              <Button variant="ghost" size="sm" className="w-full h-8 text-xs font-semibold text-foreground hover:bg-accent">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground w-8 h-8">
          <HelpCircle className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
