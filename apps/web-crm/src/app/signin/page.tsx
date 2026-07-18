import { RedirectToLogin } from "@/components/shared/RedirectToLogin";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, fontFamily: "sans-serif" }}>Loading...</div>}>
      <RedirectToLogin />
    </Suspense>
  );
}
