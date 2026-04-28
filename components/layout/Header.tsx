"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

function isTransparent(color: string) {
  return (
    !color ||
    color === "transparent" ||
    color === "rgba(0, 0, 0, 0)" ||
    color === "rgb(0 0 0 / 0)"
  );
}

function shouldUseLightHeader(color: string) {
  const rgb = color.match(
    /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/
  );

  if (rgb) {
    const [, red, green, blue, alpha = "1"] = rgb;
    const opacity = alpha.endsWith("%")
      ? Number(alpha.slice(0, -1)) / 100
      : Number(alpha);

    if (opacity < 0.2) {
      return false;
    }

    const brightness =
      (Number(red) * 299 + Number(green) * 587 + Number(blue) * 114) / 1000;

    return brightness < 200;
  }

  const oklch = color.match(
    /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/
  );

  if (oklch) {
    const [, lightness, chroma, , alpha = "1"] = oklch;
    const opacity = alpha.endsWith("%")
      ? Number(alpha.slice(0, -1)) / 100
      : Number(alpha);
    const lightnessValue = lightness.endsWith("%")
      ? Number(lightness.slice(0, -1)) / 100
      : Number(lightness);

    if (opacity < 0.2) {
      return false;
    }

    return lightnessValue < 0.82 || Number(chroma) > 0.04;
  }

  return false;
}

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [showHeader, setShowHeader] = useState(false);
  const [useLightHeader, setUseLightHeader] = useState(true);

  useEffect(() => {
    const updateHeaderVisibility = () => {
      setShowHeader(window.scrollY > 0);
    };

    updateHeaderVisibility();
    window.addEventListener("scroll", updateHeaderVisibility, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateHeaderVisibility);
    };
  }, []);

  useEffect(() => {
    const updateHeaderColor = () => {
      const header = headerRef.current;

      if (!header) {
        return;
      }

      if (window.scrollY <= 0) {
        setUseLightHeader(true);
        return;
      }

      const previousPointerEvents = header.style.pointerEvents;
      header.style.pointerEvents = "none";

      const bounds = header.getBoundingClientRect();
      const target = document.elementFromPoint(
        window.innerWidth / 2,
        Math.max(1, bounds.top + bounds.height / 2)
      );

      header.style.pointerEvents = previousPointerEvents;

      let element = target;

      while (element && element !== document.documentElement) {
        if (
          element instanceof HTMLImageElement ||
          element instanceof HTMLVideoElement ||
          element instanceof HTMLCanvasElement
        ) {
          setUseLightHeader(true);
          return;
        }

        const backgroundColor = window.getComputedStyle(element).backgroundColor;

        if (!isTransparent(backgroundColor)) {
          setUseLightHeader(shouldUseLightHeader(backgroundColor));
          return;
        }

        element = element.parentElement;
      }

      setUseLightHeader(false);
    };

    updateHeaderColor();
    window.addEventListener("scroll", updateHeaderColor, { passive: true });
    window.addEventListener("resize", updateHeaderColor);

    return () => {
      window.removeEventListener("scroll", updateHeaderColor);
      window.removeEventListener("resize", updateHeaderColor);
    };
  }, []);

  const headerTextColor = useLightHeader
    ? "text-accent"
    : "text-accent-foreground";
  const separatorColor = useLightHeader
    ? "border-accent"
    : "border-accent-foreground";
  const separatorBackground = useLightHeader
    ? "bg-accent/30"
    : "bg-accent-foreground/30";
  const logoSrc = useLightHeader ? "/logo/logo_white.png" : "/logo/logo.png";

  return (
    <header
      ref={headerRef}
      className={`
        fixed top-0 z-50
        flex h-[10dvh] w-full items-center justify-center
        bg-white/10 shadow-lg backdrop-blur-sm
        transform transition-transform duration-300 ease-out
        translate-y-0
        ${showHeader ? "md:translate-y-0" : "md:-translate-y-full"}
      `}
    >
      <nav className="mx-auto w-full max-w-[90dvw] rounded-2xl px-4 py-3 md:px-6 md:py-4">
        <ul
          className={`flex flex-row ${headerTextColor} items-center justify-between uppercase transition-colors duration-300`}
        >
          {/* Menu */}
          <li className="flex items-center gap-4">
            <Button
              className={`bg-white/5 p-4 border-none rounded-none cursor-pointer uppercase text-sm md:text-lg font-thin ${headerTextColor}`}
            >
              <div className="w-8 md:w-10 flex flex-col gap-2">
                <Separator className={`border ${separatorColor}`} />
                <Separator className={`border ${separatorColor}`} />
              </div>
              <h1>Menu</h1>
            </Button>
          </li>

          {/* Logo */}
          <li>
            <Image
              src={logoSrc}
              alt="Logo"
              width={180}
              height={72}
              className="h-8 w-auto md:h-12"
              priority
            />
          </li>

          {/* Desktop only */}
          <li className="hidden md:flex items-center gap-4 justify-center text-lg bg-white/5 px-4">
            <a
              href="/contact"
              className="relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
            >
              Apply
            </a>

            <Separator
              orientation="vertical"
              className={`h-5 ${separatorBackground}`}
            />

            <a
              href="/about"
              className="relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
            >
              Login
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
