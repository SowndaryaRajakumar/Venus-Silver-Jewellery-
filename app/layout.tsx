import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Venus Silver Admin",
  description: "Venus Silver Admin Console",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

        {/* Branding */}
        <link rel="icon" href="/assets/logo/logo.jpeg" sizes="any" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body>{children}</body>
    </html>
  );
}
