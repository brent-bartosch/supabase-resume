import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brent Bartosch | Enterprise AE & Supabase Builder",
  description: "Enterprise Account Executive with 15+ years selling technical products. Daily Supabase/Postgres user building production-grade GTM systems.",
  openGraph: {
    title: "Brent Bartosch | Enterprise AE & Supabase Builder",
    description: "Enterprise Account Executive with 15+ years selling technical products. Daily Supabase/Postgres user.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
