"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell, HelpCircle, User, LogOut, Settings, ChevronsUpDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Customers", href: "/customers" },
    { name: "Conversations", href: "/conversations" },
    { name: "Tickets", href: "/tickets" },
    { name: "Campaigns", href: "/campaigns" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center w-full px-lg h-16 bg-background border-b border-border">
      {/* Left: Switcher and Nav Links */}
      <div className="flex items-center gap-md flex-1">
        {/* Mobile menu trigger */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden -ml-md text-muted-foreground hover:text-foreground">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-card border-border w-64 flex flex-col pt-xl">
            <h2 className="text-title-lg font-bold text-foreground mb-lg px-md flex items-center gap-sm">
              <span className="w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">S</span>
              SentraCX
            </h2>
            <nav className="flex-1 flex flex-col gap-sm px-sm">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-md px-md py-sm rounded-lg text-body-sm font-semibold transition-all ${
                      isActive 
                        ? "bg-muted text-foreground" 
                        : "text-muted-foreground hover:bg-muted/55 hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Workspace Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-xs font-semibold text-foreground px-sm border border-border h-9 rounded-md cursor-pointer mr-md shrink-0">
              <span className="w-4 h-4 rounded-sm bg-primary text-primary-foreground flex items-center justify-center font-bold text-[10px]">S</span>
              <span className="text-xs font-bold">SentraCX</span>
              <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 bg-popover border-border text-popover-foreground" align="start">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold">Select Tenant</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="cursor-pointer text-xs font-semibold flex items-center justify-between hover:bg-accent hover:text-accent-foreground">
              <div className="flex items-center gap-sm">
                <span className="w-4 h-4 rounded-sm bg-primary text-primary-foreground flex items-center justify-center font-bold text-[10px]">S</span>
                <span>SentraCX (CRM)</span>
              </div>
              <Check className="w-3.5 h-3.5" />
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-xs font-semibold flex items-center gap-sm hover:bg-accent hover:text-accent-foreground">
              <span className="w-4 h-4 rounded-sm bg-muted text-foreground flex items-center justify-center border border-border font-bold text-[10px]">A</span>
              <span>AI Analytics</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-md">
        <div className="hidden sm:flex items-center bg-muted rounded-full px-md w-full max-w-[200px] border border-input focus-within:border-ring transition-all relative mr-sm">
          <Search className="text-muted-foreground w-3.5 h-3.5 mr-sm shrink-0" />
          <Input 
            className="bg-transparent border-none shadow-none outline-none focus:outline-none focus-visible:ring-0 text-xs w-full font-body-sm placeholder:text-muted-foreground text-foreground h-8 px-0 py-0" 
            placeholder="Search..." 
            type="text" 
          />
        </div>

        <div className="flex items-center gap-xs">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative w-9 h-9">
            <Bell className="w-5 h-5" />
            <Badge className="absolute top-1 right-1 w-2.5 h-2.5 p-0 bg-destructive hover:bg-destructive rounded-full" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground w-9 h-9">
            <HelpCircle className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="h-8 w-[1px] bg-border mx-xs hidden sm:block"></div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmN3cisO6-__3amuuQs9HUIpCz4TETRbyjrnu6EVNy2ZR5yYtQH2H1K4r--KKrPb2XfLrYtuNnfV6VwnXGG_ypUNFqWjm8EIzXq34nPGsMFNniMF6D0O4IeXnEpLuhpSqO1kEoYwFIPtY49IzTbJ6E6af-bEr_rrvZDB6_DPRpobOCqDHjwT-QItw70F98rUOwgt-ocSgDmReBZ57Oi3D4YhaostxGM1OkePOcgArmsDcEPH9VzaSpEw"
                  alt="Bren Raphael"
                  className="object-cover"
                />
                <AvatarFallback className="text-xs bg-secondary text-secondary-foreground font-bold">BR</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-popover border-border text-popover-foreground" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-foreground leading-none">Bren Raphael</p>
                <p className="text-xs text-muted-foreground leading-none">bren@sentracx.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-accent-foreground text-foreground text-body-sm font-medium">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-accent-foreground text-foreground text-body-sm font-medium">
              <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="cursor-pointer hover:bg-destructive/10 text-destructive hover:text-destructive text-body-sm font-medium">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
