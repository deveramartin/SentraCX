# Implementation Plan: Web CRM UI Shell

## 1. Overview
This plan outlines the steps for implementing the core UI Shell (Sidebar, Header, and responsive layout) for the SentraCX Web CRM (`apps/web-crm`), based on the `Bren Raphael's` minimalist design system documented in `.design-ref/DESIGN.md` and the minimal UI shell reference. 

As per repository rules, all icons must be migrated from Material Symbols (used in the design reference) to `lucide-react`.

## 2. Files & Directories Affected

- `apps/web-crm/tailwind.config.ts`: Add custom color palette, font families, and spacing variables.
- `apps/web-crm/src/app/globals.css`: Add baseline styles and typography setups.
- `apps/web-crm/src/app/layout.tsx`: Update the root layout to compose the new UI Shell (replacing the placeholder `HeaderTabs`).
- `apps/web-crm/src/components/shared/Sidebar.tsx`: The left-side navigation for desktop screens.
- `apps/web-crm/src/components/shared/Header.tsx`: The top navigation bar, search, and user actions.
- `apps/web-crm/src/components/shared/MobileNav.tsx`: Bottom navigation for mobile views.

## 3. Implementation Steps

### Phase 1: Design System & Styling Setup
1. **Font Integration**: 
   - Update `layout.tsx` to import and use the `Hanken Grotesk` font from `next/font/google` instead of `Geist` to match the brand identity.
2. **Tailwind Configuration** (`tailwind.config.ts`):
   - Port all color tokens (primary, secondary, surface, on-surface, etc.) into the `theme.extend.colors` section based on the design ref's `tailwind-config` object.
   - Configure border radiuses, typography variables (display, headline, body, label classes), and spacing constraints (e.g. `margin-mobile`, `margin-desktop`, `gutter`).
3. **Global CSS**:
   - Update `globals.css` with the `bg-background` and text color base configurations. Set the `Hanken Grotesk` font as the default sans serif font.

### Phase 2: Building Core Shell Components
1. **Sidebar Component** (`src/components/shared/Sidebar.tsx`):
   - A fixed, `w-64` aside on desktop.
   - Brand logo/header section.
   - Navigation links using `lucide-react` icons (e.g., `LayoutDashboard`, `Users`, `Ticket`, `BarChart`, `Settings`).
   - User profile section anchored at the bottom.
2. **Header Component** (`src/components/shared/Header.tsx`):
   - Sticky top bar (`h-16`).
   - Search input container.
   - Top-level links (Shop, CRM, HRM, etc.) and action buttons (Notifications, Help).
3. **Mobile Navigation** (`src/components/shared/MobileNav.tsx`):
   - A fixed bottom navigation bar (`h-16`) visible only on `md:hidden` viewports, featuring icon-centric tabs for primary sections.

### Phase 3: Layout Composition
1. **Root Layout Updates** (`src/app/layout.tsx`):
   - Remove `HeaderTabs.tsx`.
   - Wrap `{children}` in the main content container:
     ```tsx
     <div className="flex min-h-screen">
       <Sidebar />
       <div className="flex-1 flex flex-col md:ml-64">
         <Header />
         <main className="flex-1 bg-background relative overflow-hidden">
           {children}
         </main>
       </div>
       <MobileNav />
     </div>
     ```
2. **Review & Test**: Ensure responsiveness works across desktop, tablet, and mobile views.

## 4. Dependencies & Constraints
- **Icons**: The design reference uses Google Material Symbols. These **MUST** be mapped to `lucide-react` equivalents (e.g., `account_balance` -> `Landmark`, `dashboard` -> `LayoutDashboard`). No other icon libraries will be added.
- **UI Primitives**: If advanced interactive elements (dropdowns, sheet menus for mobile sidebar) are needed, use `shadcn/ui` and place them in `src/components/ui/`.
- **Client Components**: Navigation states (like active routes) might require components to be marked with `"use client"`. Keep the usage minimal and isolated to interactive pieces.
