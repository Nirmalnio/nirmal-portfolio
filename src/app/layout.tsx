import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, JetBrains_Mono } from "next/font/google";
import { site } from "@/content/site";
import { Providers } from "@/components/Providers";
import "./globals.css";

const sans = Schibsted_Grotesk({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], display: "swap" });

const title = `${site.name} – ${site.role}`;

export const metadata: Metadata = {
  ...(site.url && { metadataBase: new URL(site.url), alternates: { canonical: "/" } }),
  title,
  description: site.description,
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    title,
    description: site.description,
    siteName: site.name,
    locale: "en_IN",
    // Social images need an absolute URL, so they wait for a configured domain.
    ...(site.url && { images: [{ url: "/images/portrait.jpg", width: 592, height: 740, alt: site.name }] }),
  },
  twitter: {
    card: "summary",
    title,
    description: site.description,
    ...(site.url && { images: ["/images/portrait.jpg"] }),
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
