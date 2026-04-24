import { db } from "~~/server/utils/db";
import { productImages, products, productVariants } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    return await db.transaction(async (tx) => {
      const [newProduct] = await tx
        .insert(products)
        .values({
          name: body.name,
          description: body.description,
          categoryId: body.categoryId,
          basePrice: body.basePrice.toString(),
        })
        .returning();

      if (body.variants && body.variants.length > 0) {
        const variantsToInsert = body.variants.map((v: any) => ({
          productId: newProduct.id,
          colorId: v.colorId,
          sizeId: v.sizeId,
          sku: v.sku,
          stock: v.stock,
          price: v.price?.toString(),
        }));
        await tx.insert(productVariants).values(variantsToInsert);
      }

      if (body.images && body.images.length > 0) {
        const imagesToInsert = body.images.map((img: any) => ({
          productId: newProduct.id,
          colorId: img.colorId,
          url: img.url,
          isMain: img.isMain,
        }));
        await tx.insert(productImages).values(imagesToInsert);
      }

      return { success: true, productId: newProduct.id };
    });
  } catch (e) {
    console.error(e);
    throw createError({
      statusCode: 400,
      statusMessage: "Ошибка при создании товара",
    });
  }
});
