import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AppShell } from "@/components/layout/app-shell";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pulse — Analytics Dashboard",
    template: "%s · Pulse",
  },
  description:
    "Dashboard de analytics para uma empresa fictícia. Projeto de portfólio frontend construído com Next.js, TypeScript e Tailwind CSS.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* NuqsAdapter reads useSearchParams(), which requires a Suspense
            boundary so statically-rendered routes (like /_not-found) don't
            bail out of prerendering. */}
        <Suspense fallback={null}>
          <NuqsAdapter>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider delay={150}>
                <AppShell>{children}</AppShell>
              </TooltipProvider>
            </ThemeProvider>
          </NuqsAdapter>
        </Suspense>
      </body>
    </html>
  );
}
