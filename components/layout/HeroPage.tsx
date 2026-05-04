"use client";

import { ArrowRightFromLine } from "lucide-react";
import { motion } from "framer-motion";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

export default function HeroPage() {
  return (
    <motion.div
      className="relative h-dvh w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      {/* Background Image */}
      <motion.img
        src="/examples/1.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-accent-foreground/10" />
      {/* Overlay */}
      <div className="absolute inset-0 z-10 ">
        <div className="z-10 w-full h-full  flex flex-row justify-between items-center">
          <div className="relative h-full w-full">
            {/* Blur/fade overlay only */}
            {/* <div className="absolute inset-0 bg-black/30 md:backdrop-blur-sm md:[mask-image:linear-gradient(to_right,black_55%,transparent)] md:[-webkit-mask-image:linear-gradient(to_right,black_90%,transparent)]" /> */}

            {/* Content stays fully visible */}
            <div className="relative z-10 flex h-full w-full items-center justify-start">
              <motion.div
                className="my-auto flex h-full max-h-[50dvh] flex-col justify-around gap-12 px-[5dvw]"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      delayChildren: 0.25,
                      staggerChildren: 0.16,
                    },
                  },
                }}
              >
                <motion.h1
                  className="text-cream w-full md:text-9xl text-5xl font-heading capitalize"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
                  variants={{
                    hidden: { opacity: 0, y: 38 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.8, ease: "easeOut" },
                    },
                  }}
                >
                  Unlock your{" "}
                  <span className="flex items-center gap-4">
                    <Separator className="max-w-16 border border-cream" />
                    <span>best stays</span>
                  </span>
                </motion.h1>

                <motion.p
                  className="text-cream w-full md:max-w-[35dvw] rounded p-4 md:text-xl text-lg font-googlesansflex"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,1)" }}
                  variants={{
                    hidden: { opacity: 0, y: 26 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.7, ease: "easeOut" },
                    },
                  }}
                >
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt
                  nostrum at incidunt possimus, quisquam consectetur dolorem
                  totam non. Adipisci magnam aliquam saepe provident! Cum quam
                  sint modi. Eos, pariatur esse.
                </motion.p>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease: "easeOut" },
                    },
                  }}
                >
                  <Button className="flex h-12 w-48 cursor-pointer gap-4 rounded-full p-2 text-xl">
                    Book Now
                    <span className="flex items-center justify-center rounded-full bg-muted p-2">
                      <ArrowRightFromLine className="text-accent-foreground" />
                    </span>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
          <div className="h-full w-full md:relative md:block hidden">
            <motion.div
              className="p-4 md:absolute rounded md:bottom-24 md:right-24 z-50 flex md:h-[25dvh] md:max-w-[25dvw] w-full items-center justify-center bg-white/10 shadow-lg backdrop-blur-sm"
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65, duration: 0.75, ease: "easeOut" }}
            >
              <div className="w-full h-full flex flex-row items-center capitalize gap-4 p-4">
                <h3 className="text-xl font-googlesansflex text-accent max-w-72">
                  Watch a video about us
                </h3>
                <div className="w-full h-full rounded overflow-hidden">
                  <video
                    src="/examples/vid-1.mp4"
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
