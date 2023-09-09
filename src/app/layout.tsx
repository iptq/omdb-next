import TopBar from "@/components/Layout/TopBar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "OMDB",
    template: "%s | OMDB",
  },
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <TopBar />
        {children}
      </body>
    </html>
  );
}
