import HeroPage from "@/components/layout/HeroPage";
import SecondPage from "@/components/layout/SecondPage";
import VideoPage from "@/components/layout/VideoPage";

export default function Home() {
  return (
    <main className=" min-h-dvh">
      <HeroPage />
      <VideoPage />
      <SecondPage />
    </main>
  );
}
