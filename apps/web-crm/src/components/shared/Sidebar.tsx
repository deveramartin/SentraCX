"use client";

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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Conversations", href: "/conversations", icon: MessageSquare },
    { name: "Tickets", href: "/tickets", icon: Ticket },
    { name: "Campaigns", href: "/campaigns", icon: Megaphone },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col py-6 border-r border-border bg-sidebar text-sidebar-foreground z-[60] hidden md:flex">
      {/* Brand Header */}
      <div className="px-6 mb-6">
        <h1 className="text-xl font-bold tracking-tight text-sidebar-foreground">Bren Raphael's</h1>
        <p className="text-xs text-muted-foreground">Enterprise Portal</p>
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

      {/* Sidebar Footer/Avatar */}
      <div className="px-4 mt-auto pt-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer">
              <Avatar className="w-9 h-9 border border-border">
                <AvatarImage
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmN3cisO6-__3amuuQs9HUIpCz4TETRbyjrnu6EVNy2ZR5yYtQH2H1K4r--KKrPb2XfLrYtuNnfV6VwnXGG_ypUNFqWjm8EIzXq34nPGsMFNniMF6D0O4IeXnEpLuhpSqO1kEoYwFIPtY49IzTbJ6E6af-bEr_rrvZDB6_DPRpobOCqDHjwT-QItw70F98rUOwgt-ocSgDmReBZ57Oi3D4YhaostxGM1OkePOcgArmsDcEPH9VzaSpEw"
                  alt="Bren Raphael"
                  className="object-cover"
                />
                <AvatarFallback className="text-xs bg-secondary text-secondary-foreground font-bold">BR</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold truncate text-sidebar-foreground">Bren Raphael</p>
                <p className="text-[11px] text-muted-foreground truncate">Administrator</p>
              </div>
              <MoreVertical className="w-4 h-4 text-muted-foreground shrink-0" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-popover border-border text-popover-foreground" align="end" side="top">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="cursor-pointer text-xs font-medium">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-xs font-medium">Security Options</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-xs font-medium">Activity Logs</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="cursor-pointer text-xs text-destructive hover:text-destructive font-medium">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
