"use client";

import Image from "next/image";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { DatePicker } from "./DatePicker";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const checkInTimes = [
  "6:00 AM",
  "6:30 AM",
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
];

function GuestStepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex h-11 items-center justify-between bg-stone/45 px-3 text-brown">
      <span className="text-sm">{value}</span>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="rounded-none text-brown hover:bg-tan/30"
          onClick={() => onChange(Math.max(0, value - 1))}
          aria-label={`Decrease ${label}`}
        >
          <Minus className="size-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="rounded-none text-brown hover:bg-tan/30"
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label}`}
        >
          <Plus className="size-3" />
        </Button>
      </div>
    </div>
  );
}

export default function SecondPage() {
  const [date, setDate] = useState<Date>();
  const [checkInTime, setCheckInTime] = useState("6:00 AM");
  const [children, setChildren] = useState(0);
  const [olderGuests, setOlderGuests] = useState(0);

  const total = useMemo(
    () => children * 30 + olderGuests * 50,
    [children, olderGuests],
  );

  return (
    <section className="relative min-h-dvh overflow-hidden bg-cream px-4 py-14 text-brown md:px-[4.5dvw] md:py-20">
      <div className="pointer-events-none absolute inset-0 opacity-35">
        <div className="mx-auto grid h-full max-w-[90dvw] grid-cols-4 border-x border-brown/15 md:grid-cols-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="border-r border-brown/15 last:border-r-0"
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-[90dvw]">
        <div className="grid min-h-[68dvh] bg-[#86a8b5] md:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center px-6 py-16 text-cream md:px-16">
            <p className="font-googlesansflex text-sm font-semibold uppercase">
              The luxury resort
            </p>
            <div className="mt-2 h-px w-24 bg-tan" />
            <h2 className="mt-5 max-w-xl font-heading text-5xl leading-[0.95] capitalize md:text-7xl">
              Enjoy a resort experience
            </h2>
            <p className="mt-7 max-w-lg font-googlesansflex text-sm leading-6 text-cream/85 md:text-base">
              Reserve your visit with a clear check-in window, fixed checkout,
              and simple guest pricing for families and groups.
            </p>
            {/* <Button
              type="button"
              className="mt-8 h-11 w-fit rounded-full bg-tan px-6 font-googlesansflex text-brown hover:bg-khaki"
            >
              Book Now
              <ArrowRight className="size-4" />
            </Button> */}
          </div>

          <div className="relative min-h-[46dvh] md:min-h-full">
            <div className="absolute inset-x-0 bottom-[-8dvh] top-0 overflow-hidden rounded-none md:inset-x-0 md:bottom-[-15dvh] md:right-15 md:top-16 md:rounded-2xl">
              <Image
                src="/examples/3.jpg"
                alt="Resort villa and pool"
                fill
                className="object-cover w-full"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>

        <form className="relative z-10 mx-auto mt-10 grid gap-3 p-4 shadow-2xl backdrop-blur-md md:-mt-12 md:w-[92%] md:grid-cols-[1fr_1fr_1fr_1fr_1.2fr] md:p-5">
          <label className="bg-white p-4">
            <span className="font-googlesansflex text-sm font-semibold uppercase text-brown">
              Check in
            </span>
            <DatePicker
              date={date}
              onDateChange={setDate}
              placeholder="Arrival date"
              minDate={new Date()}
              className="mt-3 h-11 rounded-none border-none bg-stone/45 text-brown shadow-none"
            />
          </label>

          <label className="bg-white p-4">
            <span className="font-googlesansflex text-sm font-semibold uppercase text-brown">
              Arrival time
            </span>

            <Select value={checkInTime} onValueChange={setCheckInTime}>
              <SelectTrigger className="mt-3 w-full rounded-none border-none bg-stone/45 p-5.5 text-brown shadow-none">
                <SelectValue placeholder="Time" />
              </SelectTrigger>

              <SelectContent
                position="popper"
                sideOffset={4}
                className="h-46 overflow-y-auto rounded-none border-none bg-white text-brown shadow-md"
              >
                {checkInTimes.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="bg-white p-4">
            <span className="font-googlesansflex text-sm font-semibold uppercase text-brown">
              Ages 4-10
            </span>
            <div className="mt-3">
              <GuestStepper
                label="Ages 4-10"
                value={children}
                onChange={setChildren}
              />
            </div>
          </label>

          <label className="bg-white p-4">
            <span className="font-googlesansflex text-sm font-semibold uppercase text-brown">
              Ages 11+
            </span>
            <div className="mt-3">
              <GuestStepper
                label="Ages 11 and above"
                value={olderGuests}
                onChange={setOlderGuests}
              />
            </div>
          </label>

          <div className="grid grid-cols-[1fr_auto] overflow-hidden bg-tan text-brown md:grid-cols-1">
            <div className="flex flex-col justify-center px-5 py-4">
              <span className="font-googlesansflex text-sm font-semibold uppercase">
                Total fee
              </span>
              <span className="mt-1 text-3xl font-semibold">₱{total}</span>
              <span className="mt-1 text-base text-brown">
                Checkout: 5:30 PM
              </span>
            </div>
            <Button
              type="button"
              className="h-full rounded-none bg-tan px-5 text-brown shadow-none hover:bg-khaki md:h-auto md:min-h-16"
            >
              Search Room
            </Button>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-googlesansflex text-sm text-brown/70 md:ml-[4%]">
          <span>Ages 4-10: ₱30 each</span>
          <span>Ages 11 and above: ₱50 each</span>
          <span>Check-in window: 6:00 AM-12:00 PM</span>
        </div>
      </div>
    </section>
  );
}
