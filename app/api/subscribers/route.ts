import { prisma } from "@/lib/prisma";

type SubscribeBody = {
  email?: string;
  website?: string;
  formStartedAt?: number;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FORM_FILL_MS = 1500;
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS_PER_IP = 8;
const MAX_ATTEMPTS_PER_EMAIL = 4;

const ipAttempts = new Map<string, { count: number; resetAt: number }>();
const emailAttempts = new Map<string, { count: number; resetAt: number }>();

function hitRateLimit(
  store: Map<string, { count: number; resetAt: number }>,
  key: string,
  maxAttempts: number,
) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  store.set(key, entry);
  return entry.count > maxAttempts;
}

export async function POST(request: Request) {
  let body: SubscribeBody;

  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const website = body.website?.trim() ?? "";
  const formStartedAt = Number(body.formStartedAt ?? 0);
  const elapsed = Date.now() - formStartedAt;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    "unknown";

  if (website.length > 0) {
    return Response.json({ error: "Request rejected." }, { status: 400 });
  }

  if (!Number.isFinite(formStartedAt) || elapsed < MIN_FORM_FILL_MS) {
    return Response.json({ error: "Request rejected." }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email)) {
    return Response.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  if (hitRateLimit(ipAttempts, ip, MAX_ATTEMPTS_PER_IP)) {
    return Response.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  if (hitRateLimit(emailAttempts, email, MAX_ATTEMPTS_PER_EMAIL)) {
    return Response.json(
      { error: "Too many attempts for this email. Please try again later." },
      { status: 429 },
    );
  }

  try {
    await prisma.subscribers.create({
      data: { email },
    });

    return Response.json(
      { message: "Subscribed successfully. Thank you." },
      { status: 201 },
    );
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return Response.json(
        { message: "This email is already subscribed." },
        { status: 200 },
      );
    }

    return Response.json({ error: "Unable to subscribe right now." }, { status: 500 });
  }
}
