import { canAccessPath } from "~/utils/access";

export const useQuickAccess = () => {
  const { currentRole } = useAppRole();

  const items = computed(() =>
    [
      {
        title: "QR-Сканер",
        icon: "i-lucide-qr-code",
        to: "/qrs/scan",
        color: "text-blue-500"
      },
      {
        title: "AI-Джестер",
        icon: "i-lucide-sparkles",
        to: "/analytics",
        color: "text-purple-500"
      },
      {
        title: "Клиенты",
        icon: "i-lucide-contact-2",
        to: "/customers",
        color: "text-emerald-500"
      },
      {
        title: "Заказы",
        icon: "i-lucide-shopping-cart",
        to: "/orders",
        color: "text-orange-500"
      }
    ].filter(item => canAccessPath(currentRole.value, item.to))
  );

  return { items };
};
