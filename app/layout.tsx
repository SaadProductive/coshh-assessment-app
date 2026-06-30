import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COSHH Assessment Generator | Create Compliant Assessments in Minutes",
  description:
    "Create a compliant COSHH assessment in 5 minutes. No subscription required — pay once per assessment, or save with a bundle. Used by UK salons, cleaners, and trades.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
