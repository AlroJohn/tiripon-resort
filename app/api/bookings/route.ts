import type { BookingRequestPayload } from "@/lib/booking-types";
import { sendReservationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const CHECKOUT_TIME = "5:30 PM";
const PAGE_SIZE = 10;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);
}

function formatDate(value: Date | null) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function getBookingDayRange(value: Date) {
  const start = new Date(value);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

async function getPaidCottageNamesForDay(date: Date) {
  const { start, end } = getBookingDayRange(date);
  const paidBookings = await prisma.booking.findMany({
    where: {
      checkIn: {
        gte: start,
        lt: end,
      },
      receipt: {
        status: "paid",
      },
    },
    select: {
      cottage: {
        select: {
          name: true,
        },
      },
    },
  });

  return new Set(
    paidBookings.flatMap((booking) =>
      booking.cottage.map((cottage) => cottage.name),
    ),
  );
}

function isBookingPayload(value: unknown): value is BookingRequestPayload {
  if (!value || typeof value !== "object") return false;

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.name === "string" &&
    payload.name.trim().length > 0 &&
    typeof payload.email === "string" &&
    payload.email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) &&
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

  if (checkIn) {
    const paidCottageNames = await getPaidCottageNamesForDay(checkIn);
    const unavailableCottage = body.cottage.find((cottage) =>
      paidCottageNames.has(cottage.name),
    );

    if (unavailableCottage) {
      return Response.json(
        {
          error: `${unavailableCottage.name} is already paid and reserved for this date.`,
        },
        { status: 409 },
      );
    }
  }

  const downPaymentAmount = body.total_price * 0.5;
  const booking = await prisma.booking.create({
    data: {
      name: body.name.trim(),
      email: body.email.trim(),
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

  const receipt = await prisma.receipt.create({
    data: {
      bookingId: booking.id,
      downPaymentAmount,
    },
  });

  const receiptUrl = new URL(`/receipt/${receipt.id}`, request.url).toString();
  let emailSent = false;

  try {
    await sendReservationEmail({
      to: body.email.trim(),
      name: body.name.trim(),
      receiptUrl,
      totalPrice: body.total_price,
      downPaymentAmount,
    });
    emailSent = true;
  } catch (error) {
    console.error("Failed to send reservation email", error);
  }

  return Response.json(
    {
      booking: {
        ...booking,
        receipt,
        checkoutTime: CHECKOUT_TIME,
      },
      receiptUrl,
      emailSent,
      message: emailSent
        ? "Booking request created. Reservation email sent."
        : "Booking request created. Reservation email could not be sent.",
    },
    { status: 201 },
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const availabilityDate = searchParams.get("availabilityDate");

  if (availabilityDate) {
    const date = new Date(`${availabilityDate}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return Response.json({ error: "Invalid availability date." }, { status: 400 });
    }

    const paidCottageNames = await getPaidCottageNamesForDay(date);

    return Response.json({
      unavailableCottageNames: Array.from(paidCottageNames),
    });
  }

  const page = Math.max(Number(searchParams.get("page") ?? "1") || 1, 1);
  const size = Math.max(Number(searchParams.get("size") ?? `${PAGE_SIZE}`) || PAGE_SIZE, 1);
  const skip = (page - 1) * size;

  const bookings = await prisma.booking.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      deleted: false,
    },
    skip,
    take: size,
    include: {
      cottage: {
        orderBy: {
          createdAt: "asc",
        },
      },
      receipt: true,
    },
  });

  const rows = bookings.map((booking) => ({
    id: booking.id,
    name: booking.name,
    email: booking.email,
    phone: booking.phone,
    numberOfAdults: booking.number_of_adult,
    numberOfKids: booking.number_of_kids,
    totalPrice: formatCurrency(booking.total_price),
    summary: booking.summary,
    checkIn: formatDate(booking.checkIn),
    checkOut: formatDate(booking.checkOut),
    createdAt: formatDate(booking.createdAt),
    createdAtIso: booking.createdAt.toISOString(),
    cottages: booking.cottage.map((cottage) => ({
      id: cottage.id,
      name: cottage.name,
      description: cottage.description,
      price: formatCurrency(cottage.price),
    })),
    receipt: booking.receipt
      ? {
          id: booking.receipt.id,
          status: booking.receipt.status,
          receiptConfirmation: Boolean(booking.receipt.receipt_confirmation),
          downPaymentAmount: formatCurrency(booking.receipt.downPaymentAmount),
          proofFileName: booking.receipt.proofFileName,
          proofMimeType: booking.receipt.proofMimeType,
          proofViewUrl: booking.receipt.proofViewUrl,
          proofUploadedAt: formatDate(booking.receipt.proofUploadedAt),
          paidAt: formatDate(booking.receipt.paidAt),
          createdAt: formatDate(booking.receipt.createdAt),
        }
      : null,
  }));

  return Response.json({ rows });
}
