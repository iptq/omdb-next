import TopBar from "@/components/Layout/TopBar";
import NextTopLoader from "nextjs-toploader";
import type { Metadata } from "next";
import "./globals.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Footer from "@/components/Layout/Footer";

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
        <NextTopLoader />
        <TopBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
