"use client";

import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

export default function Header() {
  const [showHeader, setShowHeader] = useState(false);

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

  return (
    <header
      className={`
        fixed md:sticky md:top-0 z-50
        flex h-[10dvh] w-full items-center justify-center
        bg-white/10 shadow-lg backdrop-blur-sm
        transform transition-transform duration-300 ease-out
        translate-y-0
        md:${showHeader ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <nav className="mx-auto w-full max-w-[90dvw] rounded-2xl px-4 py-3 md:px-6 md:py-4">
        <ul className="flex flex-row text-accent items-center justify-between uppercase">
          {/* Menu */}
          <li className="flex items-center gap-4">
            <Button className="bg-transparent border-none p-0 cursor-pointer uppercase text-sm md:text-lg font-thin">
              <div className="w-8 md:w-10 flex flex-col gap-2">
                <Separator />
                <Separator />
              </div>
              <h1>Menu</h1>
            </Button>
          </li>

          {/* Logo */}
          <li>
            <img
              src="/logo/logo_white.png"
              alt="Logo"
              className="h-8 md:h-12"
            />
          </li>

          {/* Desktop only */}
          <li className="hidden md:flex items-center gap-4 justify-center text-lg">
            <a
              href="/contact"
              className="relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
            >
              Apply
            </a>

            <Separator
              orientation="vertical"
              className="h-5 bg-accent-foreground/30"
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
