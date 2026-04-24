import type { AppRole } from "~/utils/access";
import { normalizeRole } from "~/utils/access";

type AppRoleState = {
  clerkId: string | null;
  orgRole: string | null;
  role: AppRole | null;
};

export const useAppRole = () => {
  const state = useState<AppRoleState>("app-role", () => ({
    clerkId: null,
    orgRole: null,
    role: null
  }));
  const { orgRole } = useAuth();
  const { user } = useUser();

  const currentRole = computed<AppRole>(() => {
    return state.value.role ?? normalizeRole(user.value?.publicMetadata?.role, orgRole.value);
  });

  const setAppRole = (
    role: AppRole | null,
    clerkId: string | null,
    currentOrgRole: string | null
  ) => {
    state.value = {
      orgRole: currentOrgRole,
      role,
      clerkId
    };
  };

  const clearAppRole = () => {
    state.value = {
      orgRole: null,
      role: null,
      clerkId: null
    };
  };

  return {
    state,
    currentRole,
    setAppRole,
    clearAppRole
  };
};
