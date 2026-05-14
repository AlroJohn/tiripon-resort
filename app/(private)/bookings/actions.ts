"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
}

export async function deleteBooking(bookingId: number) {
  await requireAdmin();

  if (!Number.isInteger(bookingId)) {
    throw new Error("Invalid booking id.");
  }

  await prisma.booking.delete({
    where: {
      id: bookingId,
    },
  });

  revalidatePath("/bookings");
}

export async function confirmReceipt(receiptId: number) {
  await requireAdmin();

  if (!Number.isInteger(receiptId)) {
    throw new Error("Invalid receipt id.");
  }

  await prisma.receipt.update({
    where: {
      id: receiptId,
    },
    data: {
      receipt_confirmation: true,
    },
  });

  revalidatePath("/bookings");
}

function requireText(value: FormDataEntryValue | null, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required.`);
  }

  return value.trim();
}

export async function createChatNode(formData: FormData) {
  await requireAdmin();

  const question = requireText(formData.get("question"), "Question");
  const answer = requireText(formData.get("answer"), "Answer");

  await prisma.defaultChatNodes.create({
    data: {
      question,
      answer,
    },
  });

  revalidatePath("/chatbot-management");
}

export async function updateChatNode(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id)) {
    throw new Error("Invalid chat node id.");
  }

  const question = requireText(formData.get("question"), "Question");
  const answer = requireText(formData.get("answer"), "Answer");

  await prisma.defaultChatNodes.update({
    where: {
      id,
    },
    data: {
      question,
      answer,
    },
  });

  revalidatePath("/chatbot-management");
}

export async function deleteChatNode(chatNodeId: number) {
  await requireAdmin();

  if (!Number.isInteger(chatNodeId)) {
    throw new Error("Invalid chat node id.");
  }

  await prisma.defaultChatNodes.delete({
    where: {
      id: chatNodeId,
    },
  });

  revalidatePath("/chatbot-management");
}
