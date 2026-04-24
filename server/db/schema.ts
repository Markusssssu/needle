import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  char,
  date,
  decimal,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", ["admin", "member"]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "succeeded",
  "canceled",
  "refunded",
  "error",
]);

export const cardTypeEnum = pgEnum("card_type", [
  "visa",
  "mastercard",
  "mir",
  "sbp",
  "unknown",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
]);

export const discountTypeEnum = pgEnum("discount_type", [
  "percentage",
  "fixed",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  role: roleEnum("role").default("member").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

//================== Transactions =====================

export const transactions = pgTable(
  "transactions",
  {
    id: serial("id").primaryKey(),
    paymentId: text("payment_id").notNull().unique(),
    rrn: varchar("rrn", { length: 12 }),
    amount: bigint("amount", { mode: "number" }).notNull(),
    currency: char("currency", { length: 3 }).default("RUB").notNull(),
    status: paymentStatusEnum("status").notNull(),
    cardMask: text("card_mask"),
    cardType: cardTypeEnum("card_type").default("unknown"),
    processedAt: timestamp("processed_at"),
    rawData: jsonb("raw_data"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    rrnIdx: index("rrn_idx").on(table.rrn),
  }),
);

//=========================================================
//
//
//
//
//================== Products (products, categories, colors, sizes, productVariants, productImages, promotionCampaigns) =====================

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  parentId: uuid("parent_id"),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").references(() => categories.id),
  name: text("name").notNull(),
  description: text("description"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const colors = pgTable("colors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  hex: text("hex"),
});

export const sizes = pgTable("sizes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: text("type"),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, {
    onDelete: "cascade",
  }),
  colorId: uuid("color_id").references(() => colors.id),
  sizeId: uuid("size_id").references(() => sizes.id),
  sku: text("sku").notNull().unique(),
  stock: integer("stock").default(0).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
});

export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id),
  colorId: uuid("color_id").references(() => colors.id),
  url: text("url").notNull(),
  isMain: boolean("is_main").default(false),
});

export const promotionCampaigns = pgTable("promotion_campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  discountType: discountTypeEnum("discount_type").notNull(),
  discountValue: decimal("discount_value", {
    precision: 10,
    scale: 2,
  }).notNull(),
  expiresAt: timestamp("expires_at"),
});

//====================================================================================

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  campaignId: uuid("campaign_id").references(() => promotionCampaigns.id),
  code: text("code").notNull().unique(),
  usageLimit: integer("usage_limit").default(1),
  usedCount: integer("used_count").default(0),
  isActive: boolean("is_active").default(true),
});

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  phone: text("phone").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  birthday: date("birthday"),
  bonusPoints: integer("bonus_points").default(0),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0"),
  isSubscribed: boolean("is_subscribed").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const customerGroups = pgTable("customer_groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  discountPercent: integer("discount_percent").default(0),
});

export const customersToGroups = pgTable("customers_to_groups", {
  customerId: uuid("customer_id").references(() => customers.id),
  groupId: uuid("group_id").references(() => customerGroups.id),
});

export const customerNotes = pgTable("customer_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id),
  couponId: uuid("coupon_id").references(() => coupons.id),
  source: text("source").default("offline"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", {
    precision: 10,
    scale: 2,
  }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, {
    onDelete: "cascade",
  }),
  variantId: uuid("variant_id").references(() => productVariants.id),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: decimal("price_at_purchase", {
    precision: 10,
    scale: 2,
  }).notNull(),
});

export const orderStatusHistory = pgTable("order_status_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id),
  status: orderStatusEnum("status").notNull(),
  comment: text("comment"),
  changedAt: timestamp("changed_at").defaultNow(),
  changedBy: text("changed_by"),
});

export const couponCategories = pgTable("coupon_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  campaignId: uuid("campaign_id").references(() => promotionCampaigns.id),
  categoryId: uuid("category_id").references(() => categories.id),
});

export const couponUsageHistory = pgTable("coupon_usage_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  couponId: uuid("coupon_id").references(() => coupons.id),
  orderId: uuid("order_id").references(() => orders.id),
  customerId: uuid("customer_id").references(() => customers.id),
  usedAt: timestamp("used_at").defaultNow(),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    relationName: "category_children",
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories, {
    relationName: "category_children",
  }),
  products: many(products),
  couponCategories: many(couponCategories),
}));

export const productRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
}));

export const colorsRelations = relations(colors, ({ many }) => ({
  variants: many(productVariants),
  images: many(productImages),
}));

export const sizesRelations = relations(sizes, ({ many }) => ({
  variants: many(productVariants),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    color: one(colors, {
      fields: [productVariants.colorId],
      references: [colors.id],
    }),
    size: one(sizes, {
      fields: [productVariants.sizeId],
      references: [sizes.id],
    }),
    orderItems: many(orderItems),
  }),
);

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
  color: one(colors, {
    fields: [productImages.colorId],
    references: [colors.id],
  }),
}));

export const promotionCampaignRelations = relations(
  promotionCampaigns,
  ({ many }) => ({
    coupons: many(coupons),
    categoryLinks: many(couponCategories),
  }),
);

export const couponsRelations = relations(coupons, ({ one, many }) => ({
  campaign: one(promotionCampaigns, {
    fields: [coupons.campaignId],
    references: [promotionCampaigns.id],
  }),
  orders: many(orders),
  usages: many(couponUsageHistory),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
  notes: many(customerNotes),
  groupLinks: many(customersToGroups),
  couponUsages: many(couponUsageHistory),
}));

export const customerGroupsRelations = relations(
  customerGroups,
  ({ many }) => ({
    customerLinks: many(customersToGroups),
  }),
);

export const customersToGroupsRelations = relations(
  customersToGroups,
  ({ one }) => ({
    customer: one(customers, {
      fields: [customersToGroups.customerId],
      references: [customers.id],
    }),
    group: one(customerGroups, {
      fields: [customersToGroups.groupId],
      references: [customerGroups.id],
    }),
  }),
);

export const customerNotesRelations = relations(customerNotes, ({ one }) => ({
  customer: one(customers, {
    fields: [customerNotes.customerId],
    references: [customers.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  coupon: one(coupons, {
    fields: [orders.couponId],
    references: [coupons.id],
  }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory),
  couponUsages: many(couponUsageHistory),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export const orderStatusHistoryRelations = relations(
  orderStatusHistory,
  ({ one }) => ({
    order: one(orders, {
      fields: [orderStatusHistory.orderId],
      references: [orders.id],
    }),
  }),
);

export const couponCategoriesRelations = relations(
  couponCategories,
  ({ one }) => ({
    campaign: one(promotionCampaigns, {
      fields: [couponCategories.campaignId],
      references: [promotionCampaigns.id],
    }),
    category: one(categories, {
      fields: [couponCategories.categoryId],
      references: [categories.id],
    }),
  }),
);

export const couponUsageHistoryRelations = relations(
  couponUsageHistory,
  ({ one }) => ({
    coupon: one(coupons, {
      fields: [couponUsageHistory.couponId],
      references: [coupons.id],
    }),
    order: one(orders, {
      fields: [couponUsageHistory.orderId],
      references: [orders.id],
    }),
    customer: one(customers, {
      fields: [couponUsageHistory.customerId],
      references: [customers.id],
    }),
  }),
);
