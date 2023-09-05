import "@/styles/globals.css";

import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers";
import { TailwindIndicator } from "@/bcomponents/tailwind-indicator";
import { Toaster as DefaultToaster } from "@/registry/default/ui/toaster";
import { Toaster as NewYorkToaster } from "@/registry/new-york/ui/toaster";

import AuthProvider from "./context/AuthContext";
import ToasterContext from "./context/ToasterContext";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased relative before:absolute before:w-full before:h-full before:-z-10",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div>
              <AuthProvider>
                <ToasterContext />
                <div>{children}</div>
              </AuthProvider>
            </div>
            <TailwindIndicator />
          </ThemeProvider>
          <NewYorkToaster />
          <DefaultToaster />
        </body>
      </html>
    </>
  );
}
