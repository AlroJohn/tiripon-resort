"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  CheckCircle2,
  Eye,
  MoreHorizontal,
  ReceiptText,
  Trash2,
} from "lucide-react";

import {
  confirmReceipt,
  deleteBooking,
} from "@/app/(private)/bookings/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type BookingRow = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  numberOfAdults: string;
  numberOfKids: string;
  totalPrice: string;
  summary: string | null;
  checkIn: string;
  checkOut: string;
  createdAt: string;
  cottages: Array<{
    id: number;
    name: string;
    description: string;
    price: string;
  }>;
  receipt: {
    id: number;
    status: string;
    downPaymentAmount: string;
    proofFileName: string | null;
    proofViewUrl: string | null;
    proofUploadedAt: string;
    paidAt: string;
    createdAt: string;
  } | null;
};

type BookingsTableProps = {
  bookings: BookingRow[];
};

export function BookingsTable({ bookings }: BookingsTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(
    null,
  );
  const [bookingToDelete, setBookingToDelete] = useState<BookingRow | null>(
    null,
  );
  const [receiptToConfirm, setReceiptToConfirm] = useState<BookingRow | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Cottages</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Receipt</TableHead>
              <TableHead className="w-10">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-28 text-center text-muted-foreground"
                >
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="font-medium">{booking.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {booking.email ?? booking.phone ?? "No contact"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{booking.checkIn}</div>
                    <div className="text-xs text-muted-foreground">
                      to {booking.checkOut}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-64">
                    <div className="truncate">
                      {booking.cottages
                        .map((cottage) => cottage.name)
                        .join(", ")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {booking.cottages.length} selected
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.numberOfAdults} adults, {booking.numberOfKids} kids
                  </TableCell>
                  <TableCell className="font-medium">
                    {booking.totalPrice}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.receipt?.status === "paid"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {booking.receipt?.status ?? "missing"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal />
                          <span className="sr-only">Open row actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onSelect={() => setSelectedBooking(booking)}
                        >
                          <Eye />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={!booking.receipt}
                          onSelect={() => setReceiptToConfirm(booking)}
                        >
                          <CheckCircle2 />
                          Receipt confirmation
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => setBookingToDelete(booking)}
                        >
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={Boolean(selectedBooking)}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Booking #{selectedBooking.id}</DialogTitle>
                <DialogDescription>
                  Created {selectedBooking.createdAt}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-5">
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <Detail label="Guest" value={selectedBooking.name} />
                  <Detail
                    label="Contact"
                    value={
                      selectedBooking.email ?? selectedBooking.phone ?? "-"
                    }
                  />
                  <Detail label="Check in" value={selectedBooking.checkIn} />
                  <Detail label="Check out" value={selectedBooking.checkOut} />
                  <Detail
                    label="Guests"
                    value={`${selectedBooking.numberOfAdults} adults, ${selectedBooking.numberOfKids} kids`}
                  />
                  <Detail label="Total" value={selectedBooking.totalPrice} />
                </dl>

                <section>
                  <h3 className="text-sm font-medium">Cottages</h3>
                  <div className="mt-2 divide-y rounded-lg border">
                    {selectedBooking.cottages.map((cottage) => (
                      <div
                        key={cottage.id}
                        className="flex items-start justify-between gap-4 p-3 text-sm"
                      >
                        <div>
                          <p className="font-medium">{cottage.name}</p>
                          <p className="mt-1 text-muted-foreground">
                            {cottage.description}
                          </p>
                        </div>
                        <span className="font-medium">{cottage.price}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-medium">Receipt</h3>
                  <div className="mt-2 grid gap-3 rounded-lg border p-3 text-sm sm:grid-cols-2">
                    {selectedBooking.receipt ? (
                      <>
                        <Detail
                          label="Status"
                          value={selectedBooking.receipt.status}
                        />
                        <Detail
                          label="Down payment"
                          value={selectedBooking.receipt.downPaymentAmount}
                        />
                        <Detail
                          label="Uploaded"
                          value={selectedBooking.receipt.proofUploadedAt}
                        />
                        <Detail
                          label="Paid at"
                          value={selectedBooking.receipt.paidAt}
                        />
                        <div className="sm:col-span-2">
                          {selectedBooking.receipt.proofViewUrl ? (
                            <Button asChild variant="outline" size="sm">
                              <Link
                                href={selectedBooking.receipt.proofViewUrl}
                                target="_blank"
                              >
                                <ReceiptText />
                                Open proof
                              </Link>
                            </Button>
                          ) : (
                            <p className="text-muted-foreground">
                              No proof uploaded.
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="text-muted-foreground">No receipt found.</p>
                    )}
                  </div>
                </section>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(receiptToConfirm)}
        onOpenChange={(open) => !open && setReceiptToConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm receipt?</AlertDialogTitle>
            <AlertDialogDescription>
              This marks the receipt for {receiptToConfirm?.name} as paid.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending || !receiptToConfirm?.receipt}
              onClick={(event) => {
                event.preventDefault();
                if (!receiptToConfirm?.receipt) return;

                const receiptId = receiptToConfirm.receipt.id;

                startTransition(() => {
                  void confirmReceipt(receiptId).then(() => {
                    setReceiptToConfirm(null);
                  });
                });
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(bookingToDelete)}
        onOpenChange={(open) => !open && setBookingToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the booking for {bookingToDelete?.name},
              including connected cottages and receipt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending || !bookingToDelete}
              onClick={(event) => {
                event.preventDefault();
                if (!bookingToDelete) return;

                const bookingId = bookingToDelete.id;

                startTransition(() => {
                  void deleteBooking(bookingId).then(() => {
                    setBookingToDelete(null);
                  });
                });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
