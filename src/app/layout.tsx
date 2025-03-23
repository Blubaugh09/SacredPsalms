import type { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "../lib/registry";

export const metadata: Metadata = {
  title: "Lectio Divina | Sacred Reading Guide",
  description: "A guided reading experience for spiritual reflection and prayer through scripture",
  viewport: "width=device-width, initial-scale=1.0",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
