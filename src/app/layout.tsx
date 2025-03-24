import type { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "../lib/registry";

export const metadata: Metadata = {
  title: "Lectio Divina | Sacred Reading Guide",
  description: "A guided reading experience for spiritual reflection and prayer through scripture",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  icons: {
    icon: "/favicon.ico",
  },
  'apple-mobile-web-app-capable': 'yes',
  'apple-mobile-web-app-status-bar-style': 'black-translucent',
  'mobile-web-app-capable': 'yes',
  'theme-color': '#your-theme-color-here'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Add any additional meta tags here */}
      </head>
      <body>
        <StyledComponentsRegistry>
          <div className="app-container">
            {children}
          </div>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
