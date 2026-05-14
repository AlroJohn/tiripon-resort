import { prisma } from "@/lib/prisma";

const STALE_MINUTES = 30;

function isAuthorized(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET;

  if (!expected) return false;
  return authHeader === `Bearer ${expected}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - STALE_MINUTES * 60 * 1000);

  const result = await prisma.booking.deleteMany({
    where: {
      createdAt: {
        lte: cutoff,
      },
      OR: [
        { receipt: null },
        {
          receipt: {
            is: {
              status: {
                not: "paid",
              },
            },
          },
        },
      ],
    },
  });

  return Response.json({
    ok: true,
    deletedCount: result.count,
    staleMinutes: STALE_MINUTES,
    cutoff: cutoff.toISOString(),
  });
}
