"use client";

import { motion } from "framer-motion";

export default function VideoPage() {
  return (
    <motion.div
      className="h-full bg-black w-full md:relative md:hidden block"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.div
        className="md:p-4 md:absolute rounded md:bottom-24 md:right-24 z-50 flex h-[40dvh] w-full items-center
       justify-center bg-white/10 shadow-lg backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.1, duration: 0.65, ease: "easeOut" }}
      >
        <div className="w-full h-full flex md:flex-row flex-col-reverse gap-4 items-center capitalize p-4">
          {/* <h3 className="md:text-xl text-base font-googlesansflex text-accent w-full">
            Watch a video about us
          </h3> */}
          <div className="w-full h-full rounded overflow-hidden">
            <video
              src="/examples/vid-1.mp4"
              controls
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
