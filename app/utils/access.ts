import type { NavigationMenuItem } from "@nuxt/ui";

export type AppRole = "admin" | "member";

const MEMBER_ALLOWED_PATHS = ["/settings/appearance", "/qrs/scan"] as const;
const PUBLIC_PATHS = new Set(["/sign-in", "/sign-up"]);

export const normalizeRole = (role: unknown, orgRole?: unknown): AppRole =>
  role === "admin" || orgRole === "org:admin" ? "admin" : "member";

export const getDefaultRouteForRole = (role: AppRole) =>
  role === "admin" ? "/" : "/settings/appearance";

export const isPublicPath = (path: string) =>
  PUBLIC_PATHS.has(path) || path.startsWith("/gift/");

export const canAccessPath = (role: AppRole, path: string) => {
  if (role === "admin") {
    return true;
  }

  return MEMBER_ALLOWED_PATHS.some(allowedPath => path === allowedPath);
};

const canShowNavigationItem = (item: NavigationMenuItem, role: AppRole) => {
  if (!item.to) {
    return true;
  }

  if (typeof item.to !== "string") {
    return role === "admin";
  }

  if (!item.to.startsWith("/")) {
    return role === "admin";
  }

  return canAccessPath(role, item.to);
};

export const filterNavigationByRole = (
  groups: NavigationMenuItem[][],
  role: AppRole
) =>
  groups
    .map(group =>
      group
        .map(item => {
          const children = item.children?.filter(child =>
            canShowNavigationItem(child, role)
          );

          if (children && children.length > 0) {
            return {
              ...item,
              to: item.to && typeof item.to === "string" && item.to.startsWith("/")
                ? undefined
                : item.to,
              children
            };
          }

          if (item.children?.length) {
            return null;
          }

          return canShowNavigationItem(item, role) ? item : null;
        })
        .filter((item): item is NavigationMenuItem => Boolean(item))
    )
    .filter(group => group.length > 0);
