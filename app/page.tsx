import HeroPage from "@/components/layout/HeroPage";
import SecondPage from "@/components/layout/SecondPage";
import ThirdPage from "@/components/layout/ThirdPage";
import VideoPage from "@/components/layout/VideoPage";

export default function Home() {
  return (
    <main className=" min-h-dvh">
      <HeroPage />
      <VideoPage />
      <SecondPage />
      <ThirdPage />
  </main>
  );
}
