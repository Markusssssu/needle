import { db } from "~~/server/utils/db";

const statusPriority = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: 4,
  returned: 5
} as const;

export default defineEventHandler(async () => {
  try {
    const allOrders = await db.query.orders.findMany({
      with: {
        customer: true,
        items: {
          with: {
            variant: {
              with: {
                product: true
              }
            }
          }
        },
        statusHistory: true
      },
      orderBy: (orders, { desc }) => [desc(orders.createdAt)]
    });

    const orders = allOrders.map(order => {
      const latestStatus = [...order.statusHistory]
        .sort((left, right) => {
          const leftDate = left.changedAt ? new Date(left.changedAt).getTime() : 0;
          const rightDate = right.changedAt ? new Date(right.changedAt).getTime() : 0;

          if (leftDate !== rightDate) {
            return rightDate - leftDate;
          }

          return statusPriority[right.status] - statusPriority[left.status];
        })[0]?.status ?? "pending";

      const itemNames = Array.from(
        new Set(
          order.items
            .map(item => item.variant?.product?.name)
            .filter((name): name is string => Boolean(name))
        )
      );

      const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
      const customerName = [order.customer?.firstName, order.customer?.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();

      return {
        id: order.id,
        customerName: customerName || order.customer?.phone || "Без клиента",
        customerPhone: order.customer?.phone ?? null,
        status: latestStatus,
        source: order.source ?? "offline",
        totalAmount: Number(order.totalAmount),
        discountAmount: Number(order.discountAmount ?? 0),
        itemsCount,
        itemsPreview: itemNames.slice(0, 3).join(", ") || "Без товаров",
        createdAt: order.createdAt?.toISOString() ?? null
      };
    });

    return { orders };
  } catch (error) {
    console.error(error);

    throw createError({
      statusCode: 500,
      statusMessage: "Ошибка при получении заказов"
    });
  }
});
