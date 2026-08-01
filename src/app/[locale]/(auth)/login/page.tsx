import { LoginForm } from "@/features/auth";
import { LockKeyhole, ArrowLeft } from "lucide-react";
import { Link } from "@/shared/i18n";
import I18n from "@/shared/components/I18n";

export default async function LoginPage() {
  return (
    <main className="bg-background text-foreground relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden p-4 sm:p-6">
      {}
      <div
        aria-hidden="true"
        className="bg-primary/10 pointer-events-none absolute top-1/4 -left-40 h-96 w-96 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-primary/5 pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full blur-3xl"
      />

      {}
      <div
        aria-hidden="true"
        className="ui-grid-pattern pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] opacity-5 dark:opacity-10"
      />

      {}
      <div className="absolute top-6 right-6 left-6 z-20 flex items-center justify-between">
        <Link
          href="/"
          className="group text-muted-foreground hover:text-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span>
            <I18n>Back to Home</I18n>
          </span>
        </Link>
      </div>

      {}
      <div className="relative z-10 w-full max-w-[480px] transition-all duration-300">
        {}
        <div className="border-border bg-card/40 relative overflow-hidden rounded-none border p-6 shadow-xl backdrop-blur-md sm:rounded-lg sm:p-10">
          {}
          <div className="via-primary/40 absolute top-0 left-1/2 h-[1.5px] w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent to-transparent" />

          {}
          <div className="mb-8 flex flex-col items-center text-center">
            {}
            <div className="border-border bg-background shadow-3xs text-primary mb-4 flex h-11 w-11 items-center justify-center rounded-none border transition-all duration-300 group-hover:scale-105 sm:rounded-xl">
              <LockKeyhole className="h-5 w-5 stroke-[2]" />
            </div>

            <span className="text-primary mb-2 text-xs font-black tracking-[0.25em] uppercase">
              <I18n>Identity Dispatcher</I18n>
            </span>

            <h1 className="text-foreground font-sans text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
              <I18n>Title</I18n>
            </h1>
          </div>

          {}
          <div className="bg-background/50 border-border relative box-border w-full rounded-none border p-1 sm:rounded-xl">
            <LoginForm />
          </div>
        </div>

        {}
        <p className="text-muted-foreground/50 mt-6 text-center text-xs font-semibold tracking-wider uppercase">
          <I18n>Cryptographically Signed Secure Session</I18n>
        </p>
      </div>
    </main>
  );
}
