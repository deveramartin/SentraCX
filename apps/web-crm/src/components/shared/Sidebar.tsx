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
  MoreVertical
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
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

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
    <ShadcnSidebar className="border-r border-sidebar-border bg-sidebar">
      {/* Brand Header */}
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex flex-col gap-xs px-2">
          <h2 className="text-sm font-bold tracking-tight text-sidebar-foreground">Bren Raphael's</h2>
          <p className="text-[11px] text-muted-foreground">Enterprise Portal</p>
        </div>
      </SidebarHeader>
      
      {/* Navigation Links */}
      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                      className="cursor-pointer font-medium text-xs h-9"
                    >
                      <Link href={item.href} className="flex items-center gap-sm">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer/Avatar */}
      <SidebarFooter className="p-4 border-t border-sidebar-border mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="h-12 w-full justify-start gap-md cursor-pointer hover:bg-sidebar-accent p-1">
              <Avatar className="w-8 h-8">
                <AvatarImage 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmN3cisO6-__3amuuQs9HUIpCz4TETRbyjrnu6EVNy2ZR5yYtQH2H1K4r--KKrPb2XfLrYtuNnfV6VwnXGG_ypUNFqWjm8EIzXq34nPGsMFNniMF6D0O4IeXnEpLuhpSqO1kEoYwFIPtY49IzTbJ6E6af-bEr_rrvZDB6_DPRpobOCqDHjwT-QItw70F98rUOwgt-ocSgDmReBZ57Oi3D4YhaostxGM1OkePOcgArmsDcEPH9VzaSpEw" 
                  alt="Bren Raphael"
                  className="object-cover"
                />
                <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground font-bold">BR</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-xs font-semibold truncate text-sidebar-foreground leading-none">Bren Raphael</p>
                <p className="text-[10px] text-muted-foreground truncate mt-1">Administrator</p>
              </div>
              <MoreVertical className="w-4 h-4 text-muted-foreground shrink-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-popover border-border text-popover-foreground" align="end" side="top">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="cursor-pointer text-xs hover:bg-accent font-medium">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-xs hover:bg-accent font-medium">Security Options</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-xs hover:bg-accent font-medium">Activity Logs</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="cursor-pointer text-xs hover:bg-destructive/10 text-destructive hover:text-destructive font-medium">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
