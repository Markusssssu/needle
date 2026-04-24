import { eq } from "drizzle-orm";
import { products } from "~~/server/db/schema";
import { db } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) return;

  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      variants: { with: { size: true, color: true } },
      images: true,
      category: true,
    },
  });

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: "Товар не найден" });
  }

  return product;
});
