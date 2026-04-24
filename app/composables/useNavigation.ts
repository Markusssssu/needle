import type { NavigationMenuItem } from "@nuxt/ui";
import { filterNavigationByRole } from "~/utils/access";

export const useNavigation = () => {
  const route = useRoute();
  const open = useState("sidebar-open", () => false);
  const { currentRole } = useAppRole();

  const baseLinks = computed<NavigationMenuItem[][]>(() => [
    [
      {
        label: "Главная",
        icon: "i-lucide-house",
        to: "/",
        onSelect: () => {
          open.value = false;
        },
      },
      {
        label: "Заказы",
        icon: "i-lucide-shopping-cart",
        to: "/orders",
        onSelect: () => {
          open.value = false;
        },
      },
      {
        label: "Товары",
        icon: "i-lucide-package",
        to: "/products",
        onSelect: () => {
          open.value = false;
        },
      },
      {
        label: "Клиенты",
        icon: "i-lucide-contact-2",
        to: "/customers",
        onSelect: () => {
          open.value = false;
        },
      },
      {
        label: "QR",
        icon: "i-lucide-qr-code",
        defaultOpen: false,
        children: [
          {
            label: "QR-Сканер",
            to: "/qrs/scan",
            icon: "i-lucide-scan-line",
            onSelect: () => {
              open.value = false;
            },
          },
          {
            label: "Мои коды",
            to: "/qrs/codes",
            icon: "i-lucide-layers-2",
            onSelect: () => {
              open.value = false;
            },
          },
        ],
      },
      {
        label: "Аналитика",
        icon: "i-lucide-chart-column",
        to: "/analytics",
        defaultOpen: false,
        children: [
          {
            label: "Неделя",
            to: "/analytics",
            icon: "i-lucide-calendar-days",
            onSelect: () => {
              open.value = false;
            },
          },
          {
            label: "Месяц",
            to: "/analytics",
            icon: "i-lucide-calendar",
            onSelect: () => {
              open.value = false;
            },
          },
          {
            label: "Пол-года",
            to: "/analytics",
            icon: "i-lucide-calendar-range",
            onSelect: () => {
              open.value = false;
            },
          },
        ],
      },
    ],
    [
      {
        label: "Настройки",
        icon: "i-lucide-settings",
        defaultOpen: false,
        children: [
          {
            label: "Внешний вид",
            to: "/settings/appearance",
            icon: "i-lucide-palette",
            onSelect: () => {
              open.value = false;
            },
          },
          {
            label: "Уведомления",
            to: "/settings/notifications",
            icon: "i-lucide-bell",
            onSelect: () => {
              open.value = false;
            },
          },
          {
            label: "Безопасность",
            to: "/settings/security",
            icon: "i-lucide-shield",
            onSelect: () => {
              open.value = false;
            },
          },
        ],
      },
      {
        label: "Обратная связь",
        icon: "i-lucide-message-circle",
        to: "https://github.com",
        target: "_blank",
      },
      {
        label: "Помощь и поддержка",
        icon: "i-lucide-info",
        to: "https://github.com",
        target: "_blank",
      },
    ],
  ]);

  const links = computed(() =>
    filterNavigationByRole(baseLinks.value, currentRole.value),
  );

  const searchGroups = computed(() => {
    const groups = [
      {
        id: "links",
        label: "Перейти к",
        items: links.value.flat().reduce((acc, link) => {
          if (link.to && !link.children) {
            acc.push(link);
          }

          if (link.children) {
            acc.push(...link.children.filter((child) => child.to));
          }

          return acc;
        }, [] as NavigationMenuItem[]),
      },
    ];

    if (currentRole.value === "admin") {
      groups.push({
        id: "code",
        label: "Код",
        items: [
          {
            id: "source",
            label: "Исходный код страницы",
            icon: "i-simple-icons-github",
            to: `https://github.com/blob/main/app/pages${route.path === "/" ? "/index" : route.path}.vue`,
            target: "_blank",
          },
        ],
      });
    }

    return groups;
  });

  const baseSettingsLinks = [
    [
      {
        label: "Внешний вид",
        icon: "i-lucide-palette",
        to: "/settings/appearance",
        exact: true,
      },
      {
        label: "Уведомления",
        icon: "i-lucide-bell",
        to: "/settings/notifications",
      },
      {
        label: "Безопасность",
        icon: "i-lucide-shield",
        to: "/settings/security",
      },
    ],
    [],
  ] satisfies NavigationMenuItem[][];

  const links_settings = computed(() =>
    filterNavigationByRole(baseSettingsLinks, currentRole.value),
  );

  return {
    links,
    links_settings,
    searchGroups,
    open,
  };
};
