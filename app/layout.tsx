import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/session-provider";
import { Toaster } from "react-hot-toast";
import { getSiteSettings } from "@/actions/settings";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "Lumina – Modern Content Management",
    template: "%s | Lumina",
  },
  description:
    "A premium, modern headless CMS built with Next.js 15, Prisma, and PostgreSQL.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Lumina",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings().catch(() => null);

  return (
    <html lang="en" className={outfit.variable}>
      <head>
        {settings?.customCss && (
          <style dangerouslySetInnerHTML={{ __html: settings.customCss }} />
        )}
      </head>
      <body className="antialiased">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#0f172a",
                color: "#f8fafc",
                border: "1px solid #1e293b",
                borderRadius: "12px",
                fontSize: "14px",
              },
              success: {
                iconTheme: { primary: "#10b981", secondary: "#0f172a" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#0f172a" },
              },
            }}
          />
        </Providers>
        {settings?.customJs && (
          <script dangerouslySetInnerHTML={{ __html: settings.customJs }} />
        )}
      </body>
    </html>
  );
}
