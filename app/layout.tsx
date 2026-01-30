import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";

export const metadata: Metadata = {
  title: "Ontario Sports Betting - Arbitrage & Props Finder",
  description: "Find arbitrage opportunities and best prop odds across Ontario legal sportsbooks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <Navigation />
        <main className="lg:pl-72 pb-16 lg:pb-0">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
