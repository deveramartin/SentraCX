"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, HelpCircle, PanelLeft } from "lucide-react";
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

      {/* Right: Notifications & Help (Profile removed from Header) */}
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative w-8 h-8">
          <Bell className="w-4 h-4" />
          <Badge className="absolute top-1.5 right-1.5 w-2 h-2 p-0 bg-destructive rounded-full" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground w-8 h-8">
          <HelpCircle className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
