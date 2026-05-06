export const useQRCode = () => {
  const { data, pending, error, refresh } = useFetch("/api/coupons", {
    transform: (response: { coupons: CouponRow[] }) => response.coupons,
    key: "coupon-qr-table",
    default: () => [],
  });

  const columns = [
    {
      id: "code", // Используем id вместо key или вместе с ним
      accessorKey: "code", // Для соответствия данным
      header: "Код / QR",
    },
    {
      id: "discountLabel",
      accessorKey: "discountLabel",
      header: "Скидка",
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Статус",
    },
    {
      id: "usedCount",
      accessorKey: "usedCount",
      header: "Использование",
    },
    {
      id: "expiresAt",
      accessorKey: "expiresAt",
      header: "Истекает",
    },
    {
      id: "actions",
      header: "",
    },
  ];

  return { data, columns, pending, refresh };
};
