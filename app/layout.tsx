import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

function siteBaseUrl(): string | undefined {
  const url = process.env.WEBSITE_URL?.trim();
  if (!url) return undefined;
  return url.replace(/\/$/, "");
}

const baseUrl = siteBaseUrl();
const iconUrl = baseUrl ? `${baseUrl}/logo.png` : undefined;

export const metadata: Metadata = {
  title: "SSL Checker",
  description: "Monitor SSL certificates",
  ...(iconUrl
    ? {
        icons: {
          icon: iconUrl,
          shortcut: iconUrl,
          apple: iconUrl,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var k="sawabo-theme";var t=localStorage.getItem(k);if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);})();`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${pressStart.variable} min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
