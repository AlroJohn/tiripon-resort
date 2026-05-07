"use client";

import Image from "next/image";
import { ArrowRight, MoveLeft, MoveRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const villaSlides = [
  {
    name: "Villa Sundara",
    description:
      "A place where time stands still. Among herbs' scent and the wind's whisper, find peace hidden from the world.",
    image: "/images/2.png",
  },
  {
    name: "Villa Miraia",
    description:
      "A warm retreat with open views and soft evening light, made for quiet conversations and long coastal mornings.",
    image: "/images/3.png",
  },
  {
    name: "Villa Azari",
    description:
      "A modern escape with generous spaces, natural textures, and calm interiors that frame the surrounding sea breeze.",
    image: "/images/4.png",
  },
  {
    name: "Villa Veluna",
    description:
      "An intimate hideaway surrounded by greenery, balancing private comfort with effortless indoor-outdoor living.",
    image: "/images/5.png",
  },
];

export default function ThirdPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const autoplayInterval = setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % villaSlides.length);
    }, 10000);

    return () => clearInterval(autoplayInterval);
  }, []);

  const handleVillaSelect = (index: number) => {
    setActiveIndex(index);
  };

  const handlePreviousVilla = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? villaSlides.length - 1 : currentIndex - 1,
    );
  };

  const handleNextVilla = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % villaSlides.length);
  };

  const activeSlide = villaSlides[activeIndex] ?? villaSlides[0];

  return (
    <section className="min-h-dvh w-full px-4 py-12 md:px-[5dvw] md:py-20">
      <motion.div
        className="mx-auto grid w-full max-w-[92rem] gap-10 md:grid-cols-[0.9fr_1.9fr]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.16,
            },
          },
        }}
      >
        <motion.aside
          className="relative z-30 flex flex-col justify-between"
          variants={{
            hidden: { opacity: 0, x: -34 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.75, ease: "easeOut" },
            },
          }}
        >
          <div>
            <p className="font-googlesansflex text-sm font-semibold uppercase text-brown">
              The Luxury Hotel
            </p>
            <div className="mt-2 h-px w-24 bg-tan" />
            <h2 className="mt-6 max-w-sm font-heading text-5xl leading-[0.95] text-brown sm:text-6xl md:text-7xl">
              Life Along the Coast
            </h2>
          </div>

          <div className="relative z-30 mt-10 flex flex-col items-start md:mt-16">
            {villaSlides.map((villa, index) => (
              <Button
                key={villa.name}
                type="button"
                variant="ghost"
                onClick={() => handleVillaSelect(index)}
                aria-pressed={index === activeIndex}
                className={`mb-3 h-auto justify-start rounded-none bg-transparent p-0 text-left font-googlesansflex text-3xl leading-none shadow-none hover:bg-transparent focus-visible:ring-brown/30 sm:text-4xl ${
                  index === activeIndex
                    ? "text-brown"
                    : "text-brown/55 hover:text-brown/80"
                }`}
              >
                {villa.name}
              </Button>
            ))}
            <p className="mt-5 max-w-md font-googlesansflex text-base leading-7 text-brown/70 sm:text-lg sm:leading-8">
              {activeSlide.description}
            </p>
          </div>

          <button
            type="button"
            className="mt-10 flex items-center gap-2 font-googlesansflex text-lg font-semibold text-[#8ea0a8]"
          >
            Accommodation Details
            <ArrowRight className="size-4" />
          </button>
        </motion.aside>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 38 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.75, ease: "easeOut" },
            },
          }}
        >
          <motion.div
            className="mb-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
            variants={{
              hidden: { opacity: 0, y: 22 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.65, ease: "easeOut" },
              },
            }}
          >
            <p className="max-w-2xl font-googlesansflex text-lg leading-8 text-brown/65">
              The villas were crafted using a low-impact building method that
              embraces the land&apos;s natural contours, allowing each structure
              to settle gently into the coastal landscape.
            </p>
          </motion.div>

          <motion.div
            className="relative"
            variants={{
              hidden: { opacity: 0, scale: 0.97 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: { duration: 0.75, ease: "easeOut" },
              },
            }}
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-tan sm:aspect-[16/10]">
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={activeSlide.name}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.025 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={{
                    opacity: { duration: 0.65, ease: "easeInOut" },
                    scale: { duration: 0.9, ease: "easeOut" },
                  }}
                >
                  <Image
                    src={activeSlide.image}
                    alt={activeSlide.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 66vw, 90vw"
                    priority={activeIndex === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <Button
              type="button"
              size="icon-lg"
              onClick={handlePreviousVilla}
              aria-label="Previous villa"
              className="absolute left-2 top-1/2 z-20 size-11 -translate-y-1/2 rounded-full border border-cream bg-tan text-brown shadow-md hover:bg-khaki sm:size-10 md:-left-10 md:size-14"
            >
              <MoveLeft className="size-5 sm:size-6 md:size-8" />
            </Button>
            <Button
              type="button"
              size="icon-lg"
              onClick={handleNextVilla}
              aria-label="Next villa"
              className="absolute right-2 top-1/2 z-20 size-11 -translate-y-1/2 rounded-full border border-cream bg-tan text-brown shadow-md hover:bg-khaki sm:size-10 md:-right-10 md:size-14"
            >
              <MoveRight className="size-5 sm:size-6 md:size-8" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
