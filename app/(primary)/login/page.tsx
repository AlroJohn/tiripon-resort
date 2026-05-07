import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-24">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--cream),var(--sand)_46%,var(--stone))]" />
      <div className="absolute inset-x-0 top-0 h-44 bg-tan/35" />
      <div className="absolute inset-y-0 left-0 w-24 bg-mint/20" />
      <div className="absolute inset-y-0 right-0 w-24 bg-till/15" />
      <section className="relative z-10 grid w-full max-w-5xl items-center gap-10 md:grid-cols-[1fr_420px]">
        <div className="max-w-xl">
          <p className="font-urbanist text-sm font-semibold uppercase tracking-[0.2em] text-green">
            Tiripon Resort
          </p>
          <h1 className="mt-4 font-bodoni text-5xl leading-tight text-brown md:text-7xl">
            Staff access
          </h1>
          <p className="mt-4 max-w-md font-urbanist text-base leading-7 text-brown/70">
            Manage bookings, receipts, and resort requests from one secure
            workspace.
          </p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
