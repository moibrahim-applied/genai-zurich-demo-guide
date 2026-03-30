import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Demo Guide -- GenAI Zurich 2026",
  description: "Agentic AI in Action: How to Automate a Process in 1 Hour",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
