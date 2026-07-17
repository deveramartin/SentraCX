"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Landmark, BarChart3, Settings } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Accounts", href: "/accounts", icon: Landmark },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-outline-variant flex items-center justify-around px-md z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-xs ${
              isActive ? "text-primary" : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-label-sm">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
