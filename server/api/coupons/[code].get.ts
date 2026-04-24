import { validateCouponByScannedValue } from "~~/server/utils/coupons";

export default defineEventHandler(async event => {
  const code = getRouterParam(event, "code");

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: "Код купона не указан"
    });
  }

  const origin = getRequestURL(event).origin;
  const result = await validateCouponByScannedValue(code, origin);

  if (!result.exists) {
    throw createError({
      statusCode: 404,
      statusMessage: "Купон не найден"
    });
  }

  return { coupon: result };
});
