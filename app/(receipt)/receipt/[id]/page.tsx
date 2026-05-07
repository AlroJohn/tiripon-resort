import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReceiptUploadForm } from "@/components/receipt/ReceiptUploadForm";

const RECEIPT_LINK_TTL_MS = 30 * 60 * 1000;

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

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const receiptId = Number(id);

  if (!Number.isInteger(receiptId)) {
    notFound();
  }

  const receipt = await prisma.receipt.findUnique({
    where: {
      id: receiptId,
    },
    include: {
      booking: {
        include: {
          cottage: true,
        },
      },
    },
  });

  if (!receipt) {
    notFound();
  }

  const [databaseTime] = await prisma.$queryRaw<Array<{ now: Date }>>`
    SELECT NOW() as now
  `;
  const expiresAt = new Date(receipt.createdAt.getTime() + RECEIPT_LINK_TTL_MS);
  const isExpired = databaseTime.now.getTime() > expiresAt.getTime();
  const isPaid = receipt.status === "paid";

  return (
    <main className="min-h-dvh bg-cream px-4 py-10 text-brown md:px-[5dvw] md:py-16">
      <section className="mx-auto grid max-w-5xl overflow-hidden bg-white shadow-2xl shadow-brown/10 md:grid-cols-[1fr_0.8fr]">
        <div className="p-6 md:p-10">
          <p className="font-googlesansflex text-sm font-semibold uppercase text-brown/65">
            Reservation Receipt
          </p>
          <h1 className="mt-3 font-heading text-5xl leading-none md:text-7xl">
            Down Payment Confirmation
          </h1>

          <div className="mt-8 grid gap-4 font-googlesansflex text-sm md:text-base">
            <div>
              <span className="font-semibold uppercase text-brown/60">
                Guest
              </span>
              <p className="mt-1 text-xl font-semibold">
                {receipt.booking.name}
              </p>
            </div>
            <div>
              <span className="font-semibold uppercase text-brown/60">
                Check in
              </span>
              <p className="mt-1">{formatDate(receipt.booking.checkIn)}</p>
            </div>
            <div>
              <span className="font-semibold uppercase text-brown/60">
                Cottages
              </span>
              <ul className="mt-2 grid gap-2">
                {receipt.booking.cottage.map((cottage) => (
                  <li
                    key={cottage.id}
                    className="flex justify-between gap-4 border-b border-brown/10 pb-2"
                  >
                    <span>{cottage.name}</span>
                    <span>{formatCurrency(cottage.price)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            href="/"
            className="mt-8 z-10 inline-flex h-11 items-center rounded-full bg-brown px-6 font-googlesansflex text-sm font-semibold text-cream"
          >
            Back to resort
          </Link>
        </div>

        <aside className="flex flex-col justify-between bg-tan p-6 text-brown md:p-10">
          <div>
            <p className="font-googlesansflex text-sm font-semibold uppercase">
              Amount to pay
            </p>
            <p className="mt-3 font-heading text-5xl leading-none">
              {formatCurrency(receipt.downPaymentAmount)}
            </p>
            <p className="mt-3 font-googlesansflex text-sm leading-6">
              This is the required 50% down payment for your reservation. Please
              send payment using the QR code below.
            </p>
          </div>

          <div className="mt-8 bg-cream p-4">
            <Image
              src="/images/qr.jpg"
              alt="Payment QR code"
              width={640}
              height={640}
              className="h-auto w-full"
            />
          </div>

          <div className="mt-6 font-googlesansflex text-sm">
            <p>
              Status:{" "}
              <span className="font-semibold capitalize">{receipt.status}</span>
            </p>
            <p className="mt-2">
              Booking total: {formatCurrency(receipt.booking.total_price)}
            </p>
            <p className="mt-2">Upload link expires: {formatDate(expiresAt)}</p>
            {receipt.proofFileName && (
              <p className="mt-2">Uploaded file: {receipt.proofFileName}</p>
            )}
          </div>

          <ReceiptUploadForm
            receiptId={receipt.id}
            disabled={isExpired}
            isPaid={isPaid}
          />
        </aside>
      </section>
    </main>
  );
}
