import { AppShell } from "@/components/layout/app-shell";
import { RegisterServiceWorker } from "@/components/pwa/register-sw";
import { LowBandwidthProvider } from "@/components/providers/low-bandwidth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getServerSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ELMA — El-Niño Local Monitoring & Accountability",
  description:
    "Public disaster fund transparency and first-responder operations during El Niño.",
  applicationName: "ELMA",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "ELMA",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { active, profile } = getServerSession();

  return (
    <html lang="en" className={cn(jakarta.variable)} suppressHydrationWarning>
      <body className="min-h-screen font-sans font-medium">
        <ThemeProvider>
          <LowBandwidthProvider>
            <RegisterServiceWorker />
            <AppShell sessionActive={active} profile={profile}>
              {children}
            </AppShell>
          </LowBandwidthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
