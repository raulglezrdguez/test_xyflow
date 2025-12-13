"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/user";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Allow unauthenticated access to login and register
    const loginPath = `/login`;
    const registerPath = `/register`;

    if (!pathname) return;

    const isAuthRoute = [loginPath, registerPath].includes(pathname);

    if (!isAuthenticated && !isAuthRoute) {
      // redirect to login preserving query
      router.replace(loginPath);
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}
