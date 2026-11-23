import { Syne, DM_Sans, DM_Mono, Caveat } from "next/font/google";
import "./globals.css";

const display = Syne({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-body" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });
const script = Caveat({ subsets: ["latin"], weight: ["600"], variable: "--font-script" });

export const metadata = {
  title: "McCray Made · Websites, Engineering & Tech Help",
  description: "Real tech help from a real person. Websites built and maintained, engineering projects, IT support, and branding by Isaiah McCray.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${script.variable}`}>
      <body>{children}</body>
    </html>
  );
}
