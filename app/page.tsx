import HeroPage from "@/components/layout/HeroPage";
import SecondPage from "@/components/layout/SecondPage";
import Image from "next/image";

export default function Home() {
  return (
    <main className="border border-black min-h-dvh">
      <HeroPage />
      {/* <SecondPage /> */}
    </main>
  );
}
