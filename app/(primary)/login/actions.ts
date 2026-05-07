"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";

export type LoginFormState = {
  message: string;
};

export async function login(
  _state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { message: "Enter your email and password." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Invalid email or password." };
    }

    throw error;
  }

  return { message: "" };
}
