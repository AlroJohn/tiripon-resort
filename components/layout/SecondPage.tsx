"use client";

import { useState } from "react";
import { DatePicker } from "./DatePicker";

export default function SecondPage() {
  const [date, setDate] = useState<Date>();
  return (
    <div className="h-full w-full flex flex-col border border-black">
      <div className="w-full h-dvh flex flex-row  bg-stone-100">
        <div className="w-full h-full border border-black flex items-center justify-start pl-24">
          <h2 className="text-4xl font-bold">Welcome to the Second Page</h2>
        </div>
        <div className="w-full h-dvh border border-black relative">
          <img
            src="/examples/3.jpg"
            alt=""
            className="inset-0 h-full w-full object-cover rounded-2xl absolute top-44"
          />
        </div>
      </div>
      <div className="h-[50dvh] flex justify-center items-center relative w-full border border-black">
        <div className="h-[20dvh] rounded-xl bg-black/10 shadow-lg backdrop-blur-sm w-full max-w-[90dvw] mx-auto border border-black z-10 p-6 grid grid-cols-5 gap-6">
          <div className="w-full h-full flex flex-col gap-2 bg-accent p-6  border border-black">
            <h3 className="uppercase text-2xl font-googlesansflex font-semibold">
              check in
            </h3>
            <DatePicker
              date={date}
              onDateChange={setDate}
              placeholder="Check in Date"
            />
          </div>
          <div className="w-full h-full flex flex-col gap-2 bg-accent p-6 border border-black">
            <h3 className="uppercase text-2xl font-googlesansflex font-semibold">
              check out
            </h3>
            <DatePicker
              date={date}
              onDateChange={setDate}
              placeholder="Check out Date"
            />
          </div>
          <div className="w-full h-full border border-black"></div>
          <div className="w-full h-full border border-black"></div>
          <div className="w-full h-full border border-black"></div>
        </div>
      </div>
    </div>
  );
}
