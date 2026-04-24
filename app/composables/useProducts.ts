import { h } from "vue";
import type { TableColumn } from "@nuxt/ui";

type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  basePrice: number;
  variantsCount: number;
  totalStock: number;
  skuPreview: string;
  colors: string[];
  mainImageUrl: string | null;
  createdAt: string | null;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2
  }).format(value);

export const useProducts = () => {
  const { data, pending, error, refresh } = useAsyncData(
    "products-table",
    async () => {
      const response = await $fetch<{ products: ProductRow[] }>("/api/products");
      return response.products;
    },
    {
      default: () => []
    }
  );

  const columns: TableColumn<ProductRow>[] = [
    {
      accessorKey: "name",
      header: "Товар",
      cell: ({ row }) =>
        h("div", { class: "flex flex-col py-1" }, [
          h("span", { class: "font-medium text-highlighted" }, row.original.name),
          h(
            "span",
            { class: "text-xs text-muted truncate max-w-[320px]" },
            row.original.skuPreview || row.original.description || "Без описания"
          )
        ])
    },
    {
      accessorKey: "category",
      header: "Категория"
    },
    {
      accessorKey: "colors",
      header: "Цвета",
      cell: ({ row }) => row.original.colors.join(", ") || "—"
    },
    {
      accessorKey: "variantsCount",
      header: "Варианты",
      meta: {
        class: {
          th: "text-right",
          td: "text-right"
        }
      }
    },
    {
      accessorKey: "totalStock",
      header: "Остаток",
      meta: {
        class: {
          th: "text-right",
          td: "text-right"
        }
      }
    },
    {
      accessorKey: "basePrice",
      header: "Цена",
      meta: {
        class: {
          th: "text-right",
          td: "text-right"
        }
      },
      cell: ({ row }) => formatCurrency(row.original.basePrice)
    },
    {
      accessorKey: "createdAt",
      header: "Создан",
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString("ru-RU")
          : "—"
    }
  ];

  return {
    data,
    columns,
    pending,
    error,
    refresh
  };
};
