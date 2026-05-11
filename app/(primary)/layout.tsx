import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";

export default function PrimaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-dvh relative bg-gradient-to-b from-accent via-cream/30 to-cream/70">
      <div className="absolute h-full w-full">
        <Header />
      </div>
      {children}
      <Footer />
      <Toaster position="bottom-right" />
    </section>
  );
}
