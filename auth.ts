import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

async function verifyPassword(password: string, storedPassword: string) {
  if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$")) {
    return bcrypt.compare(password, storedPassword);
  }

  return password === storedPassword;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        if (!email || !password) {
          return null;
        }

        const administrator = await prisma.administrator.findUnique({
          where: { email },
        });

        const account =
          administrator ??
          (await prisma.user.findUnique({
            where: { email },
          }));

        if (!account) {
          return null;
        }

        const isValidPassword = await verifyPassword(password, account.password);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: String(account.id),
          email: account.email,
          name: account.name ?? account.email,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = String(token.id);
      }

      return session;
    },
  },
});
