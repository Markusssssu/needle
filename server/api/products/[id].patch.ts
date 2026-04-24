import { eq } from "drizzle-orm";
import { productImages, products, productVariants } from "~~/server/db/schema";
import { db } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  if (!id)
    throw createError({ statusCode: 400, statusMessage: "ID не указан" });

  try {
    return await db.transaction(async (tx) => {
      // 1. Обновляем основные данные товара
      await tx
        .update(products)
        .set({
          name: body.name,
          description: body.description,
          categoryId: body.categoryId,
          basePrice: body.basePrice?.toString(),
        })
        .where(eq(products.id, id));

      // 2. Обновление вариантов (Variants)
      // В простом варианте: удаляем старые и записываем новые
      // (или делаем сверку по ID, если важна история)
      if (body.variants) {
        await tx
          .delete(productVariants)
          .where(eq(productVariants.productId, id));

        const variantsToInsert = body.variants.map((v: any) => ({
          productId: id,
          colorId: v.colorId,
          sizeId: v.sizeId,
          sku: v.sku,
          stock: v.stock,
          price: v.price?.toString(),
        }));

        if (variantsToInsert.length > 0) {
          await tx.insert(productVariants).values(variantsToInsert);
        }
      }

      // 3. Обновление изображений
      if (body.images) {
        await tx.delete(productImages).where(eq(productImages.productId, id));

        const imagesToInsert = body.images.map((img: any) => ({
          productId: id,
          colorId: img.colorId,
          url: img.url,
          isMain: img.isMain,
        }));

        if (imagesToInsert.length > 0) {
          await tx.insert(productImages).values(imagesToInsert);
        }
      }

      return { success: true, message: "Товар обновлен" };
    });
  } catch (e) {
    console.error(e);
    throw createError({
      statusCode: 500,
      statusMessage: "Ошибка при обновлении товара",
    });
  }
});
