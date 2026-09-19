import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/src/core/providers/providers";
import { GlobalFooter } from "@/src/components/layout/global-footer";

export const metadata: Metadata = {
  title: "Mini Wallet Challenge",
  description: "Mock financial wallet built with Next.js, React, TypeScript, React Query, and Redux Toolkit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <div className="flex-1">
          <AppProviders>{children}</AppProviders>
        </div>
        <GlobalFooter />
      </body>
    </html>
  );
}
