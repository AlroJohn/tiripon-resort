import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-accent px-4 py-24 text-accent-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--cream)_0%,transparent_45%),radial-gradient(circle_at_bottom_right,var(--cream)_0%,transparent_40%)] opacity-60" />
      <section className="relative z-10 grid w-full max-w-5xl items-center gap-10 md:grid-cols-[1fr_420px]">
        <div className="max-w-xl">
          <p className="font-urbanist text-sm font-semibold uppercase tracking-[0.2em] text-accent-foreground/70">
            Tiripon Resort
          </p>
          <h1 className="mt-4 font-spanlight text-5xl leading-tight text-accent-foreground md:text-7xl">
            Staff access
          </h1>
          <p className="mt-4 max-w-md font-urbanist text-base leading-7 text-accent-foreground/75">
            Manage bookings, receipts, and resort requests from one secure
            workspace.
          </p>
          <div className="mt-8 h-px w-28 bg-accent-foreground/25" />
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
