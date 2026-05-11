import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BookingsTable } from "@/components/admin/bookings-table";
import { prisma } from "@/lib/prisma";

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

function getPageHref(page: number) {
  return `/bookings?page=${page}`;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const currentPage = Math.max(Number(rawPage ?? "1") || 1, 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const [bookings, totalBookings] = await Promise.all([
    prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: PAGE_SIZE,
      include: {
        cottage: {
          orderBy: {
            createdAt: "asc",
          },
        },
        receipt: true,
      },
    }),
    prisma.booking.count(),
  ]);

  const pageCount = Math.max(Math.ceil(totalBookings / PAGE_SIZE), 1);
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
          downPaymentAmount: formatCurrency(booking.receipt.downPaymentAmount),
          proofFileName: booking.receipt.proofFileName,
          proofViewUrl: booking.receipt.proofViewUrl,
          proofUploadedAt: formatDate(booking.receipt.proofUploadedAt),
          paidAt: formatDate(booking.receipt.paidAt),
          createdAt: formatDate(booking.receipt.createdAt),
        }
      : null,
  }));

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Manage reservation requests, receipt proof, and connected cottages.
        </p>
      </div>

      <BookingsTable bookings={rows} />

      <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {bookings.length === 0 ? 0 : skip + 1}-
          {Math.min(skip + bookings.length, totalBookings)} of {totalBookings}
        </p>
        <Pagination className="mx-0 w-auto justify-start sm:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={getPageHref(Math.max(currentPage - 1, 1))}
                aria-disabled={currentPage <= 1}
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {Array.from({ length: pageCount }, (_, index) => index + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === pageCount ||
                  Math.abs(page - currentPage) <= 1,
              )
              .map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={getPageHref(page)}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
            <PaginationItem>
              <PaginationNext
                href={getPageHref(Math.min(currentPage + 1, pageCount))}
                aria-disabled={currentPage >= pageCount}
                className={
                  currentPage >= pageCount
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </main>
  );
}
