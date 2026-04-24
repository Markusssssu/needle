import { isPublicPath } from "~/utils/access";

export default defineNuxtPlugin(() => {
  const route = useRoute();
  const { isLoaded, isSignedIn } = useAuth();
  const { clearAppRole } = useAppRole();

  watch(
    [isLoaded, isSignedIn, () => route.path],
    async ([loaded, signedIn, path]) => {
      if (!loaded) {
        return;
      }

      if (signedIn) {
        return;
      }

      clearAppRole();

      if (isPublicPath(path)) {
        return;
      }

      await navigateTo("/sign-in", { replace: true });
    },
    {
      immediate: true
    }
  );
});
