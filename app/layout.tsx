import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { headers } from 'next/headers'
import { prisma } from '@/app/lib/prisma'
import { auth } from '@/auth'
import { Providers } from '@/components/Providers'

import MobileBottomNav from '@/components/MobileBottomNav'
import PullToRefresh from '@/components/PullToRefresh'
import NotificationManager from '@/components/NotificationManager'
import NativeGuard from '@/components/NativeGuard'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming like a native app
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  title: "Sukra House of Diagnostic",
  description: "Advanced Medical Lab Services",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sukra Lab',
  },
  formatDetection: {
    telephone: false,
  },
};

// Simple server-side tracking
async function trackVisit() {
  try {
    const session = await auth();
    // Requirements: "if they are not login otherwise don't display the count"
    // So we ONLY track if user is NOT logged in.
    if (session?.user) {
      return;
    }

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    await prisma.visitorLog.create({
      data: {
        ip: ip.split(',')[0], // Take first IP if multiple
        userAgent: userAgent.substring(0, 200), // Truncate to fit if needed
      }
    });
  } catch (e) {
    console.error("Tracking failed silently", e);
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await trackVisit();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <NativeGuard />
          <NotificationManager />
          <PullToRefresh>
            {children}
          </PullToRefresh>
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
