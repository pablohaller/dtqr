import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drive to QR",
  description: "Generate printable QR codes for every file in your Google Drive folders.",
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
    <body className="min-h-full flex flex-col bg-background text-foreground">
      {children}
    </body>
  </html>
);

export default RootLayout;
