// Permission + role utilities for the mock admin panel.
// In this project, we store auth in localStorage key: "vs_auth".
// This file provides a deterministic mapping from the current user to permissions.

export type PermissionKey =
  | "CATEGORY_CREATE"
  | "CATEGORY_EDIT"
  | "CATEGORY_DELETE"
  | "SUBCATEGORY_CREATE"
  | "SUBCATEGORY_EDIT"
  | "SUBCATEGORY_DELETE"
  | "PRODUCT_CREATE"
  | "PRODUCT_EDIT"
  | "PRODUCT_DELETE";

type RoleName = "ADMIN" | "MANAGER" | "INVENTORY_STAFF" | "UNKNOWN";

export type PermissionSet = Record<PermissionKey, boolean>;

export const ALL_PERMISSIONS: PermissionKey[] = [
  "CATEGORY_CREATE",
  "CATEGORY_EDIT",
  "CATEGORY_DELETE",
  "SUBCATEGORY_CREATE",
  "SUBCATEGORY_EDIT",
  "SUBCATEGORY_DELETE",
  "PRODUCT_CREATE",
  "PRODUCT_EDIT",
  "PRODUCT_DELETE",
];

const makeAllFalse = (): PermissionSet =>
  ALL_PERMISSIONS.reduce((acc, p) => {
    acc[p] = false;
    return acc;
  }, {} as PermissionSet);

const ADMIN_PERMS: PermissionSet = {
  CATEGORY_CREATE: true,
  CATEGORY_EDIT: true,
  CATEGORY_DELETE: true,
  SUBCATEGORY_CREATE: true,
  SUBCATEGORY_EDIT: true,
  SUBCATEGORY_DELETE: true,
  PRODUCT_CREATE: true,
  PRODUCT_EDIT: true,
  PRODUCT_DELETE: true,
};

const MANAGER_PERMS: PermissionSet = {
  CATEGORY_CREATE: false,
  CATEGORY_EDIT: false,
  CATEGORY_DELETE: false,
  SUBCATEGORY_CREATE: false,
  SUBCATEGORY_EDIT: false,
  SUBCATEGORY_DELETE: false,
  PRODUCT_CREATE: true,
  PRODUCT_EDIT: true,
  PRODUCT_DELETE: false,
};

const INVENTORY_STAFF_PERMS: PermissionSet = {
  CATEGORY_CREATE: false,
  CATEGORY_EDIT: false,
  CATEGORY_DELETE: false,
  SUBCATEGORY_CREATE: false,
  SUBCATEGORY_EDIT: false,
  SUBCATEGORY_DELETE: false,
  PRODUCT_CREATE: false,
  PRODUCT_EDIT: false,
  PRODUCT_DELETE: false,
};

const ROLE_TO_PERMS: Record<RoleName, PermissionSet> = {
  ADMIN: ADMIN_PERMS,
  MANAGER: MANAGER_PERMS,
  INVENTORY_STAFF: INVENTORY_STAFF_PERMS,
  UNKNOWN: makeAllFalse(),
};

export function getActiveRole(): RoleName {
  if (typeof window === "undefined") return "UNKNOWN";
  try {
    const raw = localStorage.getItem("vs_auth");
    if (!raw) return "UNKNOWN";
    const parsed = JSON.parse(raw);

    // The current demo login sets: { user, email, ts }
    // If role is stored in localStorage, we trust it.
    const role = (parsed?.role || parsed?.userRole || parsed?.user_type || parsed?.type) as
      | RoleName
      | undefined;

    if (role && (role === "ADMIN" || role === "MANAGER" || role === "INVENTORY_STAFF")) return role;

    // Fallback heuristics based on email/user.
    const email = String(parsed?.email || parsed?.user || "").toLowerCase();
    if (email.includes("admin")) return "ADMIN";
    if (email.includes("manager")) return "MANAGER";
    if (email.includes("staff") || email.includes("inventory")) return "INVENTORY_STAFF";

    // Default demo role
    return "ADMIN";
  } catch {
    return "UNKNOWN";
  }
}

export function getActivePermissions(): PermissionSet {
  const role = getActiveRole();
  return ROLE_TO_PERMS[role];
}

export function hasPermission(permission: PermissionKey): boolean {
  const perms = getActivePermissions();
  return !!perms[permission];
}

export function requirePermission(permission: PermissionKey): boolean {
  return hasPermission(permission);
}

