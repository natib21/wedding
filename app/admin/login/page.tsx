import { Suspense } from "react";
import LoginPage from "@/components/login-page";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" aria-busy="true" />}>
      <LoginPage mode="admin" />
    </Suspense>
  );
}
