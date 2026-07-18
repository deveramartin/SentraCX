import type { Metadata } from "next";
import { Hanken_Grotesk, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import { MobileNav } from "@/components/shared/MobileNav";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SentraCX - Customer Relations",
  description: "Enterprise Portal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${hankenGrotesk.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar Shell */}
        <Sidebar />

        {/* Content Area Container */}
        <div className="flex-1 flex flex-col md:ml-64 min-w-0 pb-16 md:pb-0">
          {/* Top Header Shell */}
          <Header />

          {/* Main Canvas */}
          <main className="flex-1 w-full bg-background relative overflow-hidden animate-in fade-in duration-300">
            {children}
          </main>
        </div>

        {/* Mobile Navigation Shell */}
        <MobileNav />
      </body>
    </html>
  );
}
