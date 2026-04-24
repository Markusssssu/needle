import { db } from "~~/server/utils/db";

export default defineEventHandler(async () => {
  try {
    const allProducts = await db.query.products.findMany({
      with: {
        category: true,
        images: true,
        variants: {
          with: {
            color: true,
            size: true
          }
        }
      },
      orderBy: (products, { desc }) => [desc(products.createdAt)]
    });

    const products = allProducts.map(product => {
      const mainImage = product.images.find(image => image.isMain) ?? product.images[0];
      const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
      const colorNames = Array.from(
        new Set(
          product.variants
            .map(variant => variant.color?.name)
            .filter((color): color is string => Boolean(color))
        )
      );

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category?.name ?? "Без категории",
        basePrice: Number(product.basePrice),
        variantsCount: product.variants.length,
        totalStock,
        skuPreview: product.variants
          .map(variant => variant.sku)
          .slice(0, 3)
          .join(", "),
        colors: colorNames,
        mainImageUrl: mainImage?.url ?? null,
        createdAt: product.createdAt?.toISOString() ?? null
      };
    });

    return { products };
  } catch (error) {
    console.error(error);

    throw createError({
      statusCode: 500,
      statusMessage: "Ошибка при получении товаров"
    });
  }
});
