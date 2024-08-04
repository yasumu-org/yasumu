import type { Metadata } from 'next';
import './globals.css';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { SideNav } from '@/components/layout/side-nav';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/themes/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { YasumuWorkspaceProvider } from '@/components/workspaces/workspace-provider';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Yasumu',
  description: 'Your api testing tool',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased select-none',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Sonner />
          <Toaster />
          <TooltipProvider>
            <YasumuWorkspaceProvider>
              <div className="flex flex-col bg-muted/40 w-full px-4">
                <SideNav />
                {children}
              </div>
            </YasumuWorkspaceProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
