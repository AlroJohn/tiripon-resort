import type { BookingRequestPayload } from "@/lib/booking-types";
import { prisma } from "@/lib/prisma";

const CHECKOUT_TIME = "5:30 PM";

function isBookingPayload(value: unknown): value is BookingRequestPayload {
  if (!value || typeof value !== "object") return false;

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.name === "string" &&
    payload.name.trim().length > 0 &&
    (payload.email === undefined || typeof payload.email === "string") &&
    (payload.phone === undefined || typeof payload.phone === "string") &&
    Array.isArray(payload.cottages) &&
    payload.cottages.length > 0 &&
    payload.cottages.every(
      (cottage) =>
        cottage &&
        typeof cottage === "object" &&
        typeof cottage.name === "string" &&
        cottage.name.trim().length > 0 &&
        typeof cottage.description === "string" &&
        typeof cottage.price === "number" &&
        Number.isFinite(cottage.price) &&
        cottage.price >= 0,
    ) &&
    typeof payload.checkInDate === "string" &&
    payload.checkInDate.length > 0 &&
    typeof payload.checkInTime === "string" &&
    payload.checkInTime.length > 0 &&
    typeof payload.children === "number" &&
    Number.isInteger(payload.children) &&
    payload.children >= 0 &&
    typeof payload.olderGuests === "number" &&
    Number.isInteger(payload.olderGuests) &&
    payload.olderGuests >= 0 &&
    typeof payload.entranceTotal === "number" &&
    Number.isFinite(payload.entranceTotal) &&
    payload.entranceTotal >= 0 &&
    typeof payload.totalPrice === "number" &&
    Number.isFinite(payload.totalPrice) &&
    payload.totalPrice >= 0 &&
    (payload.summary === undefined || typeof payload.summary === "string")
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isBookingPayload(body)) {
    return Response.json(
      { error: "Invalid booking request payload." },
      { status: 400 },
    );
  }

  const expectedTotal = body.children * 30 + body.olderGuests * 50;

  if (body.entranceTotal !== expectedTotal) {
    return Response.json(
      { error: "Booking total does not match guest pricing." },
      { status: 400 },
    );
  }

  const cottageTotal = body.cottages.reduce(
    (sum, cottage) => sum + cottage.price,
    0,
  );

  if (body.totalPrice !== expectedTotal + cottageTotal) {
    return Response.json(
      { error: "Booking total does not match selected cottages." },
      { status: 400 },
    );
  }

  const checkIn = new Date(`${body.checkInDate} ${body.checkInTime}`);

  if (Number.isNaN(checkIn.getTime())) {
    return Response.json(
      { error: "Invalid check-in date or arrival time." },
      { status: 400 },
    );
  }

  const checkOut = new Date(checkIn);
  checkOut.setHours(17, 30, 0, 0);

  const booking = await prisma.booking.create({
    data: {
      name: body.name.trim(),
      email: body.email?.trim() || null,
      phone: body.phone?.trim() || null,
      number_of_adult: String(body.olderGuests),
      number_of_kids: String(body.children),
      total_price: body.totalPrice,
      summary: body.summary?.trim() || null,
      checkIn,
      checkOut,
      cottage: {
        create: body.cottages.map((cottage) => ({
          name: cottage.name,
          description: cottage.description,
          price: cottage.price,
        })),
      },
    },
    include: {
      cottage: true,
    },
  });

  return Response.json(
    {
      booking: {
        ...booking,
        checkoutTime: CHECKOUT_TIME,
      },
      message: "Booking request created.",
    },
    { status: 201 },
  );
}
