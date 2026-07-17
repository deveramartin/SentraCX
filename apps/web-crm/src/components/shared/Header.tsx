"use client";

import Link from "next/link";
import { Menu, Search, Bell, HelpCircle, User, LogOut, Settings } from "lucide-react";
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

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center w-full px-lg h-16 bg-surface border-b border-outline-variant">
      {/* Left: Search and Breadcrumb */}
      <div className="flex items-center gap-xl flex-1">
        <Button variant="ghost" size="icon" className="md:hidden -ml-md text-on-surface-variant hover:text-primary">
          <Menu className="w-6 h-6" />
        </Button>
        
        <div className="hidden sm:flex items-center bg-surface-container-low rounded-full px-md w-full max-w-md border border-outline-variant focus-within:border-primary transition-all relative">
          <Search className="text-on-surface-variant w-4 h-4 mr-sm shrink-0" />
          <Input 
            className="bg-transparent border-none shadow-none outline-none focus:outline-none focus-visible:ring-0 text-body-sm w-full font-body-sm placeholder:text-on-surface-variant text-on-surface h-9 px-0 py-0" 
            placeholder="Global search..." 
            type="text" 
          />
        </div>
        
        <nav className="hidden lg:flex items-center gap-md ml-md">
          {["Shop", "CRM", "HRM", "POS", "SCM"].map((item) => (
            <Link 
              key={item} 
              href="#" 
              className={`text-label-md font-medium transition-colors py-1 ${
                item === "CRM" 
                  ? "text-primary font-semibold border-b-2 border-primary" 
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-md">
        <div className="flex items-center gap-xs">
          <Button variant="ghost" size="icon" className="text-on-surface-variant hover:text-primary relative w-9 h-9">
            <Bell className="w-5 h-5" />
            <Badge className="absolute top-1 right-1 w-2.5 h-2.5 p-0 bg-error hover:bg-error rounded-full" />
          </Button>
          <Button variant="ghost" size="icon" className="text-on-surface-variant hover:text-primary w-9 h-9">
            <HelpCircle className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="h-8 w-[1px] bg-outline-variant mx-xs hidden sm:block"></div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmN3cisO6-__3amuuQs9HUIpCz4TETRbyjrnu6EVNy2ZR5yYtQH2H1K4r--KKrPb2XfLrYtuNnfV6VwnXGG_ypUNFqWjm8EIzXq34nPGsMFNniMF6D0O4IeXnEpLuhpSqO1kEoYwFIPtY49IzTbJ6E6af-bEr_rrvZDB6_DPRpobOCqDHjwT-QItw70F98rUOwgt-ocSgDmReBZ57Oi3D4YhaostxGM1OkePOcgArmsDcEPH9VzaSpEw"
                  alt="Bren Raphael"
                  className="object-cover"
                />
                <AvatarFallback className="text-xs bg-secondary-container text-secondary font-bold">BR</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-surface border-outline-variant" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-primary leading-none">Bren Raphael</p>
                <p className="text-xs text-on-surface-variant leading-none">bren@sentracx.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-outline-variant" />
            <DropdownMenuItem className="cursor-pointer hover:bg-surface-container text-on-surface text-body-sm font-medium">
              <User className="mr-2 h-4 w-4 text-on-surface-variant" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-surface-container text-on-surface text-body-sm font-medium">
              <Settings className="mr-2 h-4 w-4 text-on-surface-variant" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-outline-variant" />
            <DropdownMenuItem className="cursor-pointer hover:bg-red-50 text-red-600 hover:text-red-700 text-body-sm font-medium">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
