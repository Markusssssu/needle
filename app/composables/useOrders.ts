import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

type OrderRow = {
  id: string;
  customerName: string;
  customerPhone: string | null;
  status: OrderStatus;
  source: string;
  totalAmount: number;
  discountAmount: number;
  itemsCount: number;
  itemsPreview: string;
  createdAt: string | null;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2
  }).format(value);

export const useOrders = () => {
  const UBadge = resolveComponent("UBadge");

  const { data, pending, error, refresh } = useAsyncData(
    "orders-table",
    async () => {
      const response = await $fetch<{ orders: OrderRow[] }>("/api/orders");
      return response.orders;
    },
    {
      default: () => []
    }
  );

  const statusConfig: Record<OrderStatus, { label: string; color: "neutral" | "warning" | "info" | "success" | "error" }> = {
    pending: { label: "Ожидает", color: "warning" },
    processing: { label: "В работе", color: "info" },
    shipped: { label: "Отправлен", color: "info" },
    delivered: { label: "Доставлен", color: "success" },
    cancelled: { label: "Отменён", color: "error" },
    returned: { label: "Возврат", color: "neutral" }
  };

  const columns: TableColumn<OrderRow>[] = [
    {
      accessorKey: "customerName",
      header: "Клиент / заказ",
      cell: ({ row }) =>
        h("div", { class: "flex flex-col py-1" }, [
          h("span", { class: "font-medium text-highlighted" }, row.original.customerName),
          h(
            "span",
            { class: "text-xs text-muted" },
            row.original.customerPhone || row.original.id.slice(0, 8)
          )
        ])
    },
    {
      accessorKey: "itemsPreview",
      header: "Состав",
      cell: ({ row }) =>
        h("div", { class: "flex flex-col py-1" }, [
          h("span", { class: "truncate max-w-[320px]" }, row.original.itemsPreview),
          h("span", { class: "text-xs text-muted" }, `${row.original.itemsCount} шт.`)
        ])
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }) => {
        const current = statusConfig[row.original.status];

        return h(
          UBadge,
          {
            variant: "subtle",
            color: current.color,
            class: "rounded-full"
          },
          () => current.label
        );
      }
    },
    {
      accessorKey: "source",
      header: "Источник",
      cell: ({ row }) => (row.original.source === "online" ? "Онлайн" : "Оффлайн")
    },
    {
      accessorKey: "totalAmount",
      header: "Сумма",
      meta: {
        class: {
          th: "text-right",
          td: "text-right"
        }
      },
      cell: ({ row }) =>
        h("div", { class: "flex flex-col items-end py-1" }, [
          h("span", { class: "font-medium" }, formatCurrency(row.original.totalAmount)),
          row.original.discountAmount > 0
            ? h(
                "span",
                { class: "text-xs text-muted" },
                `Скидка ${formatCurrency(row.original.discountAmount)}`
              )
            : null
        ])
    },
    {
      accessorKey: "createdAt",
      header: "Создан",
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit"
            })
          : "—"
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
