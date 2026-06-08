"use client";

import { ReactNode } from "react";
import { hasPermission, PermissionKey } from "@/lib/permissions";

export default function PermissionGate({
  permission,
  children,
  fallback = null,
}: {
  permission: PermissionKey;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  if (typeof window === "undefined") return null;
  if (!hasPermission(permission)) return <>{fallback}</>;
  return <>{children}</>;
}

