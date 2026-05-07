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
    Array.isArray(payload.cottage) &&
    payload.cottage.length > 0 &&
    payload.cottage.every(
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
    typeof payload.number_of_kids === "string" &&
    /^\d+$/.test(payload.number_of_kids) &&
    typeof payload.number_of_adult === "string" &&
    /^\d+$/.test(payload.number_of_adult) &&
    typeof payload.total_price === "number" &&
    Number.isFinite(payload.total_price) &&
    payload.total_price >= 0 &&
    (payload.checkIn === undefined || typeof payload.checkIn === "string") &&
    (payload.checkOut === undefined || typeof payload.checkOut === "string") &&
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

  const numberOfKids = Number(body.number_of_kids);
  const numberOfAdults = Number(body.number_of_adult);
  const expectedEntranceTotal = numberOfKids * 30 + numberOfAdults * 50;
  const cottageTotal = body.cottage.reduce(
    (sum, cottage) => sum + cottage.price,
    0,
  );

  if (body.total_price !== expectedEntranceTotal + cottageTotal) {
    return Response.json(
      { error: "Booking total does not match selected guests and cottages." },
      { status: 400 },
    );
  }

  const checkIn = body.checkIn ? new Date(body.checkIn) : null;

  if (checkIn && Number.isNaN(checkIn.getTime())) {
    return Response.json(
      { error: "Invalid check-in date." },
      { status: 400 },
    );
  }

  const checkOut = body.checkOut ? new Date(body.checkOut) : null;

  if (checkOut && Number.isNaN(checkOut.getTime())) {
    return Response.json({ error: "Invalid checkout date." }, { status: 400 });
  }

  const booking = await prisma.booking.create({
    data: {
      name: body.name.trim(),
      email: body.email?.trim() || null,
      phone: body.phone?.trim() || null,
      number_of_adult: body.number_of_adult,
      number_of_kids: body.number_of_kids,
      total_price: body.total_price,
      summary: body.summary?.trim() || null,
      checkIn,
      checkOut,
      cottage: {
        create: body.cottage.map((cottage) => ({
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
