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
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col py-lg border-r border-black bg-primary text-on-primary z-[60] hidden md:flex" id="sidebar">
      {/* Brand Header */}
      <div className="px-lg mb-xl">
        <h1 className="font-headline-md text-headline-md font-bold text-on-primary">Bren Raphael's</h1>
        <p className="font-label-md text-label-md text-on-primary-container">Enterprise Portal</p>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 px-md overflow-y-auto">
        <div className="space-y-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-md px-md py-sm mb-xs transition-all rounded-lg group ${
                  isActive
                    ? "bg-primary-container text-on-primary font-semibold"
                    : "text-on-primary-container hover:bg-primary-container"
                }`}
              >
                <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-on-primary" : "group-hover:text-on-primary text-on-primary-container"}`} />
                <span className="font-label-md text-label-md">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Footer/Avatar with shadcn/ui DropdownMenu */}
      <div className="px-md mt-auto pt-lg border-t border-outline-variant">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-md p-sm rounded-lg hover:bg-primary-container transition-colors cursor-pointer outline-none">
              <Avatar className="w-10 h-10 bg-primary-container">
                <AvatarImage 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmN3cisO6-__3amuuQs9HUIpCz4TETRbyjrnu6EVNy2ZR5yYtQH2H1K4r--KKrPb2XfLrYtuNnfV6VwnXGG_ypUNFqWjm8EIzXq34nPGsMFNniMF6D0O4IeXnEpLuhpSqO1kEoYwFIPtY49IzTbJ6E6af-bEr_rrvZDB6_DPRpobOCqDHjwT-QItw70F98rUOwgt-ocSgDmReBZ57Oi3D4YhaostxGM1OkePOcgArmsDcEPH9VzaSpEw" 
                  alt="Bren Raphael"
                  className="object-cover"
                />
                <AvatarFallback className="text-on-primary bg-primary-container font-bold text-xs">BR</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="font-label-md text-label-md font-bold truncate text-on-primary">Bren Raphael</p>
                <p className="text-[11px] text-on-primary-container truncate font-sans">Administrator</p>
              </div>
              <MoreVertical className="w-5 h-5 text-on-primary-container" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-surface border-outline-variant" align="end" side="top">
            <DropdownMenuLabel className="text-primary font-bold text-label-md">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-outline-variant" />
            <DropdownMenuItem className="cursor-pointer hover:bg-surface-container text-on-surface text-body-sm font-medium">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-surface-container text-on-surface text-body-sm font-medium">Security Options</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-surface-container text-on-surface text-body-sm font-medium">Activity Logs</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-outline-variant" />
            <DropdownMenuItem className="cursor-pointer hover:bg-red-50 text-red-600 hover:text-red-700 text-body-sm font-medium">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
