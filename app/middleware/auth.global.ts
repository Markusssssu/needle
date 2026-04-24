import {
  canAccessPath,
  getDefaultRouteForRole,
  isPublicPath,
  normalizeRole
} from "~/utils/access";

export default defineNuxtRouteMiddleware(async to => {
  if (!process.client) {
    return;
  }

  if (to.path.startsWith("/qr/")) {
    return navigateTo(to.path.replace(/^\/qr\//, "/qrs/"), { replace: true });
  }

  if (to.path === "/settings") {
    return navigateTo("/settings/appearance", { replace: true });
  }

  if (isPublicPath(to.path)) {
    return;
  }

  const { isLoaded, isSignedIn, orgRole } = useAuth();
  const { user } = useUser();
  const { state, currentRole, setAppRole, clearAppRole } = useAppRole();

  if (!isLoaded.value) {
    await new Promise<void>(resolve => {
      const stop = watch(
        isLoaded,
        value => {
          if (value) {
            stop();
            resolve();
          }
        },
        { immediate: true }
      );
    });
  }

  if (!isSignedIn.value) {
    clearAppRole();
    return navigateTo("/sign-in");
  }

  const clerkId = user.value?.id ?? null;
  const currentOrgRole = orgRole.value ?? null;

  if (
    !state.value.role ||
    state.value.clerkId !== clerkId ||
    state.value.orgRole !== currentOrgRole
  ) {
    try {
      const response = await $fetch<{
        user: {
          clerkId: string;
          role: "admin" | "member";
        };
      }>("/api/me");

      setAppRole(
        normalizeRole(response.user.role, currentOrgRole),
        response.user.clerkId,
        currentOrgRole
      );
    } catch (error) {
      console.error("Failed to resolve app role from database", error);
      setAppRole(
        normalizeRole(user.value?.publicMetadata?.role, currentOrgRole),
        clerkId,
        currentOrgRole
      );
    }
  }

  const role = currentRole.value;

  if (!canAccessPath(role, to.path)) {
    return navigateTo(getDefaultRouteForRole(role), { replace: true });
  }
});
