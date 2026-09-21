import { LoginForm } from "@/app/login/login-form";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="py-12 text-center text-muted-foreground">Loading…</p>}>
      <LoginForm />
    </Suspense>
  );
}
