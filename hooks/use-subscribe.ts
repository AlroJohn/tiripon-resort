"use client";

import { useCallback, useState } from "react";

type SubscribeState = {
  error: string | null;
  isLoading: boolean;
  message: string | null;
};

type SubscribePayload = {
  email: string;
  website: string;
  formStartedAt: number;
};

export function useSubscribe() {
  const [state, setState] = useState<SubscribeState>({
    error: null,
    isLoading: false,
    message: null,
  });

  const subscribe = useCallback(async (payload: SubscribePayload) => {
    setState({ error: null, isLoading: true, message: null });

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Subscription failed.");
      }

      setState({
        error: null,
        isLoading: false,
        message: result.message ?? "Subscribed successfully.",
      });

      return result.message ?? "Subscribed successfully.";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Subscription failed.";
      setState({ error: message, isLoading: false, message: null });
      throw error;
    }
  }, []);

  return { ...state, subscribe };
}
