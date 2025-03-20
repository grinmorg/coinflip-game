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
import { Header } from "@/components/layout/header";
import { headers } from "next/headers";
import { ActualPriceContextProvider } from "@/context/actual-price-context";
import { ActualEthPrice } from "@/components/shared/actual-eth-price";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies =
    headersObj.get("cookie");

  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TooltipProvider>
          <WagmiContextProvider
            cookies={cookies}>
            <QueryClientProvider>
              <ActualPriceContextProvider>
                <ActualEthPrice className='fixed top-0 left-1/2 -translate-x-1/2 z-50' />

                <Header />
                {children}
              </ActualPriceContextProvider>
            </QueryClientProvider>
          </WagmiContextProvider>
        </TooltipProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
