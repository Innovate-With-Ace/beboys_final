"use client";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href="#"
          className="flex items-center gap-2 self-center font-heading font-bold text-brand-primary text-2xl transition-transform hover:scale-105"
        >
          Beboy&apos;s Kagawad&apos;s Best Eatery
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
