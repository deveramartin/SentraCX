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
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col py-lg border-r border-zinc-800 bg-zinc-950 text-zinc-50 z-[60] hidden md:flex" id="sidebar">
      {/* Brand Header */}
      <div className="px-lg mb-xl">
        <h1 className="font-headline-md text-headline-md font-bold text-zinc-50">Bren Raphael's</h1>
        <p className="font-label-md text-label-md text-zinc-400">Enterprise Portal</p>
      </div>
      
      {/* Navigation Links */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-zinc-950 to-transparent z-10 pointer-events-none" />

        <nav className="flex-1 px-md overflow-y-auto py-2">
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
                      ? "bg-zinc-900 text-zinc-50 font-semibold"
                      : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900"
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-zinc-50" : "group-hover:text-zinc-50 text-zinc-400"}`} />
                  <span className="font-label-md text-label-md">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-zinc-950 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Sidebar Footer/Avatar with shadcn/ui DropdownMenu */}
      <div className="px-md mt-auto pt-lg border-t border-zinc-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-md p-sm rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer outline-none">
              <Avatar className="w-10 h-10 bg-zinc-900">
                <AvatarImage 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmN3cisO6-__3amuuQs9HUIpCz4TETRbyjrnu6EVNy2ZR5yYtQH2H1K4r--KKrPb2XfLrYtuNnfV6VwnXGG_ypUNFqWjm8EIzXq34nPGsMFNniMF6D0O4IeXnEpLuhpSqO1kEoYwFIPtY49IzTbJ6E6af-bEr_rrvZDB6_DPRpobOCqDHjwT-QItw70F98rUOwgt-ocSgDmReBZ57Oi3D4YhaostxGM1OkePOcgArmsDcEPH9VzaSpEw" 
                  alt="Bren Raphael"
                  className="object-cover"
                />
                <AvatarFallback className="text-zinc-50 bg-zinc-900 font-bold text-xs">BR</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="font-label-md text-label-md font-bold truncate text-zinc-50">Bren Raphael</p>
                <p className="text-[11px] text-zinc-400 truncate font-sans">Administrator</p>
              </div>
              <MoreVertical className="w-5 h-5 text-zinc-400" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800 text-zinc-50" align="end" side="top">
            <DropdownMenuLabel className="text-zinc-100 font-bold text-label-md">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800 text-zinc-300 text-body-sm font-medium">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800 text-zinc-300 text-body-sm font-medium">Security Options</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800 text-zinc-300 text-body-sm font-medium">Activity Logs</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="cursor-pointer hover:bg-destructive/10 text-destructive hover:text-destructive text-body-sm font-medium">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
