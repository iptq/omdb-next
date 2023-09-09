import TopBar from "@/components/Layout/TopBar";
import type { Metadata } from "next";

import "./globals.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";

export const metadata: Metadata = {
  title: {
    default: "OMDB",
    template: "%s | OMDB",
  },
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopBar />
        {children}
      </body>
    </html>
  );
}
