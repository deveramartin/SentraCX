"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Ticket,
  Megaphone,
  Settings,
  MoreVertical,
  ChevronsUpDown,
  Check,
  Building2,
  ShoppingCart,
  Users2,
  CreditCard,
  Truck,
  User,
  Shield,
  Activity,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function Sidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  const [activeAccount, setActiveAccount] = useState("admin");

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Conversations", href: "/conversations", icon: MessageSquare },
    { name: "Tickets", href: "/tickets", icon: Ticket },
    { name: "Campaigns", href: "/campaigns", icon: Megaphone },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const systems = [
    {
      fullName: "Customer Relationship Management",
      desc: "Customer profiles, tickets & marketing",
      icon: Building2,
      active: true,
    },
    {
      fullName: "E-Commerce Storefront",
      desc: "Online orders & products",
      icon: ShoppingCart,
      active: false,
    },
    {
      fullName: "Human Resource Management",
      desc: "Staff directory & payroll",
      icon: Users2,
      active: false,
    },
    {
      fullName: "Point of Sale",
      desc: "Retail & register checkout",
      icon: CreditCard,
      active: false,
    },
    {
      fullName: "Supply Chain Management",
      desc: "Inventory & logistics",
      icon: Truck,
      active: false,
    },
  ];

  const accounts = [
    {
      id: "admin",
      name: "Bren Raphael",
      role: "Administrator",
      email: "bren@sentracx.com",
    },
    {
      id: "support",
      name: "Support Lead Account",
      role: "Support Manager",
      email: "support.lead@sentracx.com",
    },
    {
      id: "sales",
      name: "Sales Ops Account",
      role: "Sales Lead",
      email: "sales.ops@sentracx.com",
    },
  ];

  const currentAccount = accounts.find((a) => a.id === activeAccount) || accounts[0];

  if (!open) return null;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col py-6 border-r border-border bg-sidebar text-sidebar-foreground z-[60] transition-all duration-300 shadow-lg md:shadow-none">
      {/* Borderless Large Logo & Version Switcher Header */}
      <div className="px-4 mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors group">
              <div className="flex flex-col min-w-0 pr-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-sidebar-foreground truncate">
                  Bren Raphael's
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

      {/* Navigation Links */}
      <nav className="flex-1 px-4 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
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

      {/* Sidebar Footer / Prettier Interactive Profile Switcher */}
      <div className="px-4 mt-auto pt-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer group">
              <Avatar className="w-9 h-9 border border-border shrink-0">
                <AvatarImage
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmN3cisO6-__3amuuQs9HUIpCz4TETRbyjrnu6EVNy2ZR5yYtQH2H1K4r--KKrPb2XfLrYtuNnfV6VwnXGG_ypUNFqWjm8EIzXq34nPGsMFNniMF6D0O4IeXnEpLuhpSqO1kEoYwFIPtY49IzTbJ6E6af-bEr_rrvZDB6_DPRpobOCqDHjwT-QItw70F98rUOwgt-ocSgDmReBZ57Oi3D4YhaostxGM1OkePOcgArmsDcEPH9VzaSpEw"
                  alt={currentAccount.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground font-bold">
                  BR
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold truncate text-sidebar-foreground">{currentAccount.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{currentAccount.role}</p>
              </div>
              <MoreVertical className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-sidebar-foreground transition-colors" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-64 bg-popover border-border text-popover-foreground z-[999] shadow-xl p-2" side="top" align="start">
            {/* User Details Box */}
            <div className="p-3 bg-muted/40 rounded-lg border border-border mb-2 flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-border shrink-0">
                <AvatarImage
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmN3cisO6-__3amuuQs9HUIpCz4TETRbyjrnu6EVNy2ZR5yYtQH2H1K4r--KKrPb2XfLrYtuNnfV6VwnXGG_ypUNFqWjm8EIzXq34nPGsMFNniMF6D0O4IeXnEpLuhpSqO1kEoYwFIPtY49IzTbJ6E6af-bEr_rrvZDB6_DPRpobOCqDHjwT-QItw70F98rUOwgt-ocSgDmReBZ57Oi3D4YhaostxGM1OkePOcgArmsDcEPH9VzaSpEw"
                  alt={currentAccount.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground font-bold">
                  BR
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 overflow-hidden">
                <span className="text-xs font-bold text-foreground truncate">{currentAccount.name}</span>
                <span className="text-[11px] text-muted-foreground truncate">{currentAccount.email}</span>
                <Badge variant="outline" className="text-[9px] w-fit mt-1 px-1.5 py-0 font-semibold">
                  {currentAccount.role}
                </Badge>
              </div>
            </div>

            {/* Account / Role Switcher Section */}
            <DropdownMenuLabel className="text-[11px] text-muted-foreground font-semibold px-2 py-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Switch Role / Account
            </DropdownMenuLabel>
            <div className="space-y-0.5 mb-2">
              {accounts.map((acc) => (
                <DropdownMenuItem
                  key={acc.id}
                  onClick={() => {
                    setActiveAccount(acc.id);
                    toast.success(`Switched role to ${acc.name} (${acc.role})`);
                  }}
                  className={`cursor-pointer text-xs flex items-center justify-between p-2 rounded-md transition-colors ${
                    activeAccount === acc.id ? "bg-accent font-bold text-foreground" : "hover:bg-accent/60"
                  }`}
                >
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate">{acc.name}</span>
                    <span className="text-[10px] text-muted-foreground">{acc.role}</span>
                  </div>
                  {activeAccount === acc.id && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
                </DropdownMenuItem>
              ))}
            </div>

            <DropdownMenuSeparator className="bg-border" />

            {/* Profile Action Items */}
            <DropdownMenuItem className="cursor-pointer text-xs font-medium gap-2 p-2 hover:bg-accent">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-xs font-medium gap-2 p-2 hover:bg-accent">
              <Shield className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Security Options</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-xs font-medium gap-2 p-2 hover:bg-accent">
              <Activity className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Activity Logs</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border" />

            <DropdownMenuItem
              onClick={() => toast.info("Sign out triggered")}
              className="cursor-pointer text-xs font-medium gap-2 p-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
