import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
} from "next/font/google";
import "./globals.css";
import QueryClientProvider from "@/context/query-client-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import WagmiContextProvider from "@/context/wagmi/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coinflip",
  description:
    "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TooltipProvider>
          <WagmiContextProvider>
            <QueryClientProvider>
              {children}
            </QueryClientProvider>
          </WagmiContextProvider>
        </TooltipProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
