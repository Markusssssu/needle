import { listCouponsWithMeta } from "~~/server/utils/coupons";

export default defineEventHandler(async event => {
  try {
    const origin = getRequestURL(event).origin;
    const coupons = await listCouponsWithMeta(origin);

    return { coupons };
  } catch (error) {
    console.error(error);

    throw createError({
      statusCode: 500,
      statusMessage: "Ошибка при получении QR-кодов"
    });
  }
});
