import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Flex } from "next/font/google";
import { materialCss } from "@/lib/palette";
import { allSkills, profile } from "@/lib/portfolio";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site";
import { KEYS } from "@/lib/storage";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const roboto = Roboto_Flex({ variable: "--font-roboto", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s · ${profile.name}` },
  description: SITE_DESCRIPTION,
  keywords: [profile.name, "portfolio", "hospital administration", "MHA", "hospital operations", "healthcare management", "Biomedical Science", ...allSkills.slice(0, 12)],
  authors: [{ name: profile.name }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: `${profile.name} · Portfolio`,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d1f22" },
    { media: "(prefers-color-scheme: light)", color: "#e8efe9" },
  ],
};

// Applies the saved theme before first paint. Dark is the default.
const themeScript = `try{if(localStorage.getItem(${JSON.stringify(KEYS.theme)})==="light"){var d=document.documentElement;d.classList.remove("dark");d.style.colorScheme="light"}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${roboto.variable}`} style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <style dangerouslySetInnerHTML={{ __html: materialCss(profile.themeSeed) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
