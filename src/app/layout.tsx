import { AppShell } from "@/components/layout/app-shell";
import { RegisterServiceWorker } from "@/components/pwa/register-sw";
import { LowBandwidthProvider } from "@/components/providers/low-bandwidth-provider";
import { ELMA_SESSION_COOKIE, isActiveDemoSession } from "@/lib/auth/demo-session";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
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
    "Cross-track civic platform for county flood transparency and community emergency safety during El Niño.",
  applicationName: "ELMA",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "ELMA",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#5B4B8A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const signedIn = isActiveDemoSession(cookies().get(ELMA_SESSION_COOKIE)?.value);

  return (
    <html lang="en" className={cn(jakarta.variable)}>
      <body className="min-h-screen font-sans font-medium">
        <LowBandwidthProvider>
          <RegisterServiceWorker />
          <AppShell signedIn={signedIn}>{children}</AppShell>
        </LowBandwidthProvider>
      </body>
    </html>
  );
}
