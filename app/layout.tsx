import type { Metadata, Viewport } from "next";
import { Merriweather, Montserrat } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { site } from "@/lib/site";
import "./normalize.css";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.title}`,
  },
  description: site.description,
  authors: [{ name: site.author.name, url: site.url }],
  openGraph: {
    type: "website",
    siteName: site.title,
    url: site.url,
    title: site.title,
    description: site.description,
  },
  alternates: {
    types: { "application/rss+xml": `${site.url}/rss.xml` },
  },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${merriweather.variable}`}>
      <body>
        <div id="LayoutContainer">
          <NavBar title={site.title} />
          <main>{children}</main>
          <footer>
            {`© ${new Date().getFullYear()} `}
            <Link href="/contact">{site.author.name}</Link>, All rights reserved. Built with{" "}
            <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
              Next.js
            </a>
            .
          </footer>
        </div>
        {process.env.NODE_ENV === "production" && <GoogleAnalytics gaId={site.gaMeasurementId} />}
      </body>
    </html>
  );
}
