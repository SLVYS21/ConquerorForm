import type { Metadata } from "next";
import Script from "next/script";
import { getTheme } from "@/lib/theme";
import { themeToCssVars, FONT_VAR_BY_KEY } from "@/lib/theme-css";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcomConqueror, réserve ta place",
  description: "Rejoins la formation EcomConqueror.",
};

const FONTS_URL =
  "https://fonts.googleapis.com/css2?" +
  [
    "family=Inter:wght@400;500;600;700",
    "family=Space+Grotesk:wght@400;500;600;700",
    "family=DM+Sans:wght@400;500;600;700",
    "family=Instrument+Sans:wght@400;500;600;700",
    "family=Fraunces:wght@400;500;600;700",
  ].join("&") +
  "&display=swap";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getTheme();
  const cssVars = themeToCssVars(theme);
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS_URL} />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root {\n${cssVars}\n--font-active: var(${FONT_VAR_BY_KEY[theme.font]});\n}`,
          }}
        />
        {pixelId ? (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        ) : null}
      </head>
      <body>{children}</body>
    </html>
  );
}
