import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { auth } from "@/auth";
import { RedirectToLogin } from "@/components/RedirectToLogin";
import { HeaderTabs } from "@/components/HeaderTabs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
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

const THIS_SYSTEM_CODE = "SentraCX";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session == null) {
    return (
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col">
          <RedirectToLogin />
        </body>
      </html>
    );
  }

  const hasAccess = session.systems?.includes(THIS_SYSTEM_CODE) ?? false;

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {hasAccess ? (
          <>
            <HeaderTabs />
            {children}
          </>
        ) : (
          <div style={{ padding: 40, fontFamily: "monospace" }}>
            <h1>Access Denied</h1>
            <p>
              You are logged in as {session.user?.name}, but you don&apos;t have access to {THIS_SYSTEM_CODE}.
            </p>
          </div>
        )}
      </body>
    </html>
  );
}
