import { SidebarProvider } from '@/components/ui/sidebar';
import './globals.css';
import type { Metadata } from 'next';
import { JetBrains_Mono, Poppins } from 'next/font/google';
import { AppSidebar } from '@/components/sidebars/app-sidebar';
import LayoutGroup from '@/components/layout-group';
import ThemeProvider from '@/providers/ThemeProvider';
import WorkspaceProvider from '@/providers/WorkspaceProvider';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Yasumu',
};

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

const jetbrainsMono = JetBrains_Mono({
  weight: 'variable',
  display: 'swap',
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${jetbrainsMono.variable} antialiased`}>
      <body>
        <ThemeProvider>
          <WorkspaceProvider>
            <SidebarProvider>
              <LayoutGroup>
                <AppSidebar />
                {children}
              </LayoutGroup>
            </SidebarProvider>
          </WorkspaceProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
