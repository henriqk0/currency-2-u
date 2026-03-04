"use client";

import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter()

  return async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      cache: "no-store",
    });

    router.refresh();
    router.replace("/");
  }
}