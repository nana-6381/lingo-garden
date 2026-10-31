import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lingo Garden — Korean Roleplay",
  description: "Practice Korean lessons and real-world roleplay.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
