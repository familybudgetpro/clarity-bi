import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Clarity BI | Intelligent Auto Insurance Analytics",
  description:
    "Enterprise analytics for CEOs, CFOs, and managers. Conversational reporting with real-time Oracle and Excel integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased bg-background text-foreground font-inter">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
