import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";

type CouponRow = {
  id: string;
  code: string;
  status: "valid" | "inactive" | "expired" | "exhausted" | "not_found";
  statusLabel: string;
  discountLabel: string;
  usedCount: number;
  usageLimit: number | null;
  expiresAt: string | null;
  shareUrl: string;
};

export const useQRCode = () => {
  const UBadge = resolveComponent("UBadge");
  const UButton = resolveComponent("UButton");
  const QRCode = resolveComponent("Qrcode");
  const toast = useToast();

  const { data, pending, error, refresh } = useAsyncData(
    "coupon-qr-table",
    async () => {
      const response = await $fetch<{ coupons: CouponRow[] }>("/api/coupons");
      return response.coupons;
    },
    {
      default: () => []
    }
  );

  const columns: TableColumn<CouponRow>[] = [
    {
      accessorKey: "code",
      header: "Код / QR",
      cell: ({ row }) =>
        h("div", { class: "flex items-center gap-3 py-2" }, [
          h("div", { class: "rounded-xl border border-default p-2 bg-white" }, [
            h(QRCode, {
              value: row.original.shareUrl,
              size: 56,
              variant: "pixelated",
              radius: 0
            })
          ]),
          h("div", { class: "flex flex-col" }, [
            h("span", { class: "font-medium text-highlighted" }, row.original.code),
            h("span", { class: "text-xs text-muted truncate max-w-[220px]" }, row.original.shareUrl)
          ])
        ])
    },
    {
      accessorKey: "discountLabel",
      header: "Скидка"
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }) => {
        const colorMap: Record<CouponRow["status"], "success" | "warning" | "error" | "neutral"> = {
          valid: "success",
          inactive: "neutral",
          expired: "warning",
          exhausted: "error",
          not_found: "neutral"
        };

        return h(
          UBadge,
          {
            variant: "subtle",
            color: colorMap[row.original.status],
            class: "rounded-full"
          },
          () => row.original.statusLabel
        );
      }
    },
    {
      accessorKey: "usedCount",
      header: "Использование",
      cell: ({ row }) => {
        const limit =
          row.original.usageLimit === null || row.original.usageLimit === undefined
            ? "∞"
            : row.original.usageLimit;

        return `${row.original.usedCount} / ${limit}`;
      }
    },
    {
      accessorKey: "expiresAt",
      header: "Истекает",
      cell: ({ row }) =>
        row.original.expiresAt
          ? new Date(row.original.expiresAt).toLocaleDateString("ru-RU")
          : "Без срока"
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) =>
        h(UButton, {
          size: "xs",
          variant: "soft",
          icon: "i-lucide-copy",
          onClick: async () => {
            await navigator.clipboard.writeText(row.original.shareUrl);
            toast.add({
              title: "Ссылка на QR-код скопирована"
            });
          }
        })
    }
  ];

  return {
    data,
    columns,
    pending,
    error,
    refresh
  };
};
