import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={sora.className}>
      <div className="flex flex-col min-h-screen bg-white text-black font-mono">
        {children}
      </div>
    </div>
  );
}
