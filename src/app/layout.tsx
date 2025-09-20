import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ethereum Address Generator",
  description:
    "Generate secure Ethereum addresses with custom prefixes and suffixes",
  keywords: [
    "ethereum",
    "address",
    "generator",
    "cryptocurrency",
    "blockchain",
  ],
  authors: [{ name: "Ethereum Address Generator" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#667eea",
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23667eea;stop-opacity:1" /><stop offset="100%" style="stop-color:%23764ba2;stop-opacity:1" /></linearGradient></defs><circle cx="50" cy="50" r="45" fill="url(%23grad)"/><text x="50" y="60" font-family="Arial,sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="white">🔐</text></svg>',
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          {children}
        </div>
      </body>
    </html>
  );
}
