"use client";

import { useActionState } from "react";

import { login, type LoginFormState } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginFormState = {
  message: "",
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <Card className="w-full max-w-[420px] rounded-lg border-stone/70 bg-cream/95 shadow-xl shadow-stone/30 ring-till/20">
      <CardHeader className="gap-2 px-6 pt-6">
        <div className="flex size-11 items-center justify-center rounded-lg bg-till text-cream shadow-sm"></div>
        <CardTitle className="font-spanlight text-3xl text-brown">
          Welcome back
        </CardTitle>
        <CardDescription className="font-urbanist text-brown/70">
          Sign in with your resort account.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-brown">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
              className="h-11 border-tan/80 bg-sand/40 text-brown placeholder:text-brown/45 focus-visible:border-till focus-visible:ring-mint/40"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-brown">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              autoComplete="current-password"
              required
              className="h-11 border-tan/80 bg-sand/40 text-brown placeholder:text-brown/45 focus-visible:border-till focus-visible:ring-mint/40"
            />
          </div>
          {state.message ? (
            <p className="rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={pending}
            className="mt-1 h-11 bg-till text-cream hover:bg-green"
          >
            {pending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
