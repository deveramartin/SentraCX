"use client";

import Link from "next/link";
import { Menu, Search, Bell, HelpCircle, User } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center w-full px-lg h-16 bg-surface border-b border-outline-variant">
      {/* Left: Search and Breadcrumb */}
      <div className="flex items-center gap-xl flex-1">
        <button className="md:hidden p-sm -ml-md text-on-surface-variant hover:text-primary">
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden sm:flex items-center bg-surface-container-low rounded-full px-md py-xs w-full max-w-md border border-outline-variant focus-within:border-primary transition-all">
          <Search className="text-on-surface-variant w-4 h-4 mr-sm" />
          <input 
            className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-body-sm w-full font-body-sm placeholder:text-on-surface-variant text-on-surface" 
            placeholder="Global search..." 
            type="text" 
          />
        </div>
        
        <nav className="hidden lg:flex items-center gap-md ml-md">
          {["Shop", "CRM", "HRM", "POS", "SCM"].map((item) => (
            <Link 
              key={item} 
              href="#" 
              className={`text-label-md font-medium transition-colors ${
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
          <button className="p-sm text-on-surface-variant hover:text-primary transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button className="p-sm text-on-surface-variant hover:text-primary transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        
        <div className="h-8 w-[1px] bg-outline-variant mx-xs hidden sm:block"></div>
        
        <div className="flex items-center gap-sm cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center group-hover:bg-outline-variant transition-colors">
            <User className="text-secondary w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
