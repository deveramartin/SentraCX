import type { Metadata } from "next";
import { Hanken_Grotesk, Geist_Mono } from "next/font/google";
import { auth } from "@/auth";
import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
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
  title: "SentraCX",
  description: "Customer Relations",
};

const THIS_SYSTEM_CODE = "CRMS";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Temporarily commented out for UI/UX development
  // const session = await auth();
  // if (session == null) {
  //   return (
  //     <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
  //       <body className="min-h-full flex flex-col">
  //         <RedirectToLogin />
  //       </body>
  //     </html>
  //   );
  // }
  // const hasAccess = session.systems?.includes(THIS_SYSTEM_CODE) ?? false;
  const hasAccess = true;

  return (
    <html lang="en" className={`${hankenGrotesk.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {hasAccess ? (
          <SidebarProvider>
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 bg-background relative overflow-hidden animate-in fade-in duration-500">
                {children}
              </main>
            </div>
          </SidebarProvider>
        ) : (
          <div style={{ padding: 40, fontFamily: "monospace" }}>
            <h1>Access Denied</h1>
            <p>
              Access Denied Placeholder
            </p>
          </div>
        )}
      </body>
    </html>
  );
}
