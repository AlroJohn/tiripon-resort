import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Tiripon Resort",
  description:
    "Tiripon Resort is a serene getaway nestled in the heart of nature, offering a perfect blend of tranquility and adventure. With its lush surroundings, comfortable accommodations, and a range of activities, Tiripon Resort is the ideal destination for those seeking relaxation and outdoor fun.",
  icons: "/logo/web-logo.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="min-h-dvh relative bg-gradient-to-b from-accent via-cream/30 to-cream/70">
        <div className="absolute h-full w-full">
          <Header />
        </div>
        {children}
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
