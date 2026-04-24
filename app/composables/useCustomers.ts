import { h, resolveComponent } from "vue";

export const useCustomers = () => {
  const UBadge = resolveComponent("UBadge");

  const { data, pending, refresh } = useAsyncData(
    "transactions-list",
    async () => {
      const res = await $fetch("/api/transactions");
      return res.allTransactions;
    },
    {
      default: () => [],
    },
  );

  const columns = [
    {
      accessorKey: "rrn",
      header: "RRN / ID операции",
      cell: ({ row }: any) =>
        h("div", { class: "flex flex-col" }, [
          h("span", { class: "font-medium" }, row.getValue("rrn") || "—"),
          h(
            "span",
            { class: "text-[10px] text-gray-400 uppercase" },
            `ID: ${row.original.paymentId}`,
          ),
        ]),
    },
    {
      accessorKey: "createdAt",
      header: "Дата",
      cell: ({ row }: any) => {
        const date = row.getValue("createdAt");
        if (!date) return "—";
        return new Date(date).toLocaleString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }: any) => {
        // Маппинг под ваш paymentStatusEnum
        const statusCfg: Record<string, { label: string; color: any }> = {
          succeeded: { label: "Успешно", color: "green" },
          error: { label: "Ошибка", color: "red" },
          canceled: { label: "Отмена", color: "gray" },
          refunded: { label: "Возврат", color: "orange" },
        };

        const statusValue = row.getValue("status") as string;
        const current = statusCfg[statusValue] || {
          label: statusValue,
          color: "blue",
        };

        return h(
          UBadge,
          {
            variant: "subtle",
            color: current.color,
            size: "xs",
            class: "capitalize",
          },
          () => current.label,
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => h("div", { class: "text-right" }, "Сумма"),
      cell: ({ row }: any) => {
        const amount = Number(row.getValue("amount")) / 100;
        const currency = row.original.currency || "RUB";

        const formatted = new Intl.NumberFormat("ru-RU", {
          style: "currency",
          currency: currency,
        }).format(amount);

        return h("div", { class: "text-right font-medium" }, formatted);
      },
    },
  ];

  return {
    data,
    columns,
    pending,
    refresh,
  };
};
