import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";

export const useMembers = () => {
  const { organizations, memberships } = useOrganization();

  const columns;

  type MembersPermissions = "Пользователь" | "Админ";
  type MembersPresence = "Офлайн" | "Онлайн";
  interface Members {
    id: string;
    permissions: MembersPermission;
    presence: MembersPresence;
  }
};
