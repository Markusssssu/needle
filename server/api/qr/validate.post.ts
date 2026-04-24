import { z } from "zod";
import { validateCouponByScannedValue } from "~~/server/utils/coupons";

const bodySchema = z.object({
  value: z.string().min(1)
});

export default defineEventHandler(async event => {
  const body = bodySchema.parse(await readBody(event));
  const origin = getRequestURL(event).origin;

  try {
    const result = await validateCouponByScannedValue(body.value, origin);
    return { result };
  } catch (error) {
    console.error(error);

    throw createError({
      statusCode: 500,
      statusMessage: "Ошибка при проверке QR-кода"
    });
  }
});
