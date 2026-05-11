import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-cream px-4 py-12 text-brown">
      <section className="w-full max-w-xl text-center">
        <p className="font-googlesansflex text-sm font-semibold uppercase tracking-wide text-brown/60">
          404
        </p>
        <h1 className="mt-3 font-heading text-5xl leading-none sm:text-7xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-5 max-w-md font-googlesansflex text-sm leading-6 text-brown/75 sm:text-base">
          This page may have expired, moved, or no longer exists. For receipt
          links, please request a new reservation confirmation from Tiripon
          Resort.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-brown px-6 font-googlesansflex text-sm font-semibold text-cream"
        >
          Return to resort
        </Link>
      </section>
    </main>
  );
}
