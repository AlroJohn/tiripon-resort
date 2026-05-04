"use client";

import Image from "next/image";
import { ArrowRight, MoveLeft, MoveRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";

const villaSlides = [
  {
    name: "Villa Sundara",
    description:
      "A place where time stands still. Among herbs' scent and the wind's whisper, find peace hidden from the world.",
    image: "/images/2.jpg",
  },
  {
    name: "Villa Miraia",
    description:
      "A warm retreat with open views and soft evening light, made for quiet conversations and long coastal mornings.",
    image: "/images/3.jpg",
  },
  {
    name: "Villa Azari",
    description:
      "A modern escape with generous spaces, natural textures, and calm interiors that frame the surrounding sea breeze.",
    image: "/images/4.jpg",
  },
  {
    name: "Villa Veluna",
    description:
      "An intimate hideaway surrounded by greenery, balancing private comfort with effortless indoor-outdoor living.",
    image: "/images/5.jpg",
  },
];

export default function ThirdPage() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCarouselFading, setIsCarouselFading] = useState(false);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  const fadeCarouselTo = (scroll: () => void) => {
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }

    setIsCarouselFading(true);
    fadeTimeoutRef.current = setTimeout(() => {
      scroll();
      setIsCarouselFading(false);
    }, 180);
  };

  const handleVillaSelect = (index: number) => {
    if (index === activeIndex) return;

    setActiveIndex(index);

    if (!api) return;

    fadeCarouselTo(() => api.scrollTo(index));
  };

  const activeSlide = villaSlides[activeIndex] ?? villaSlides[0];

  return (
    <section className="min-h-dvh w-full bg-cream px-4 py-12 md:px-[5dvw] md:py-20">
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
            <Button className="h-10 self-start rounded-full bg-tan px-4 text-sm text-brown hover:bg-khaki sm:h-12 sm:px-7 sm:text-base">
              View All Available Villas
              <ArrowRight className="size-4" />
            </Button>
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
            <Carousel
              setApi={setApi}
              opts={{ loop: true, align: "start" }}
              className={`w-full transition-opacity duration-300 ease-in-out rounded-xl overflow-hidden ${
                isCarouselFading ? "opacity-0" : "opacity-100"
              }`}
            >
              <CarouselContent className="ml-0">
                {villaSlides.map((slide) => (
                  <CarouselItem key={slide.name} className="pl-0">
                    <div className="relative aspect-[4/5] w-full  sm:aspect-[16/10]">
                      <Image
                        src={slide.image}
                        alt={slide.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 66vw, 90vw"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <Button
              type="button"
              size="icon-lg"
              onClick={() => fadeCarouselTo(() => api?.scrollPrev())}
              aria-label="Previous villa"
              className="absolute left-2 top-1/2 z-20 size-11 -translate-y-1/2 rounded-full border border-cream bg-tan text-brown shadow-md hover:bg-khaki sm:size-14 md:-left-10 md:size-20"
            >
              <MoveLeft className="size-5 sm:size-6 md:size-8" />
            </Button>
            <Button
              type="button"
              size="icon-lg"
              onClick={() => fadeCarouselTo(() => api?.scrollNext())}
              aria-label="Next villa"
              className="absolute right-2 top-1/2 z-20 size-11 -translate-y-1/2 rounded-full border border-cream bg-tan text-brown shadow-md hover:bg-khaki sm:size-14 md:-right-10 md:size-20"
            >
              <MoveRight className="size-5 sm:size-6 md:size-8" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
