import { db } from "../utils/db";
import {
  categories,
  colors,
  couponCategories,
  couponUsageHistory,
  coupons,
  customerGroups,
  customerNotes,
  customers,
  customersToGroups,
  orderItems,
  orders,
  orderStatusHistory,
  productImages,
  productVariants,
  products,
  promotionCampaigns,
  sizes,
  transactions
} from "../db/schema";

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

export default defineTask({
  meta: {
    name: "seed",
    description: "Seed all non-user tables with demo data"
  },
  async run() {
    return await db.transaction(async tx => {
      await tx.delete(couponUsageHistory);
      await tx.delete(couponCategories);
      await tx.delete(orderStatusHistory);
      await tx.delete(orderItems);
      await tx.delete(orders);
      await tx.delete(customerNotes);
      await tx.delete(customersToGroups);
      await tx.delete(customerGroups);
      await tx.delete(customers);
      await tx.delete(coupons);
      await tx.delete(promotionCampaigns);
      await tx.delete(productImages);
      await tx.delete(productVariants);
      await tx.delete(products);
      await tx.delete(sizes);
      await tx.delete(colors);
      await tx.delete(categories);
      await tx.delete(transactions);

      const [womenCategory, menCategory, accessoriesCategory] = await tx
        .insert(categories)
        .values([
          { name: "Women", slug: "women" },
          { name: "Men", slug: "men" },
          { name: "Accessories", slug: "accessories" }
        ])
        .returning();

      const [dressesCategory, shirtsCategory, giftCategory] = await tx
        .insert(categories)
        .values([
          {
            name: "Dresses",
            slug: "dresses",
            parentId: womenCategory.id
          },
          {
            name: "Shirts",
            slug: "shirts",
            parentId: menCategory.id
          },
          {
            name: "Gift Cards",
            slug: "gift-cards",
            parentId: accessoriesCategory.id
          }
        ])
        .returning();

      const [redColor, blackColor, whiteColor, blueColor] = await tx
        .insert(colors)
        .values([
          { name: "Red", hex: "#E11D48" },
          { name: "Black", hex: "#111827" },
          { name: "White", hex: "#F8FAFC" },
          { name: "Blue", hex: "#2563EB" }
        ])
        .returning();

      const [sizeXs, sizeS, sizeM, sizeL] = await tx
        .insert(sizes)
        .values([
          { name: "XS", type: "INT" },
          { name: "S", type: "INT" },
          { name: "M", type: "INT" },
          { name: "L", type: "INT" }
        ])
        .returning();

      const [summerDress, linenShirt, toteBag] = await tx
        .insert(products)
        .values([
          {
            categoryId: dressesCategory.id,
            name: "Summer Dress",
            description: "Lightweight midi dress for daily wear",
            basePrice: "5900.00",
            createdAt: daysFromNow(-30)
          },
          {
            categoryId: shirtsCategory.id,
            name: "Linen Shirt",
            description: "Breathable shirt with relaxed fit",
            basePrice: "4900.00",
            createdAt: daysFromNow(-24)
          },
          {
            categoryId: giftCategory.id,
            name: "Canvas Tote Bag",
            description: "Reusable tote bag for store gifts",
            basePrice: "1900.00",
            createdAt: daysFromNow(-10)
          }
        ])
        .returning();

      const [
        dressRedS,
        dressRedM,
        dressBlackM,
        shirtWhiteM,
        shirtBlueL,
        toteBlack
      ] = await tx
        .insert(productVariants)
        .values([
          {
            productId: summerDress.id,
            colorId: redColor.id,
            sizeId: sizeS.id,
            sku: "DRS-SUM-RED-S",
            stock: 7,
            price: "5900.00"
          },
          {
            productId: summerDress.id,
            colorId: redColor.id,
            sizeId: sizeM.id,
            sku: "DRS-SUM-RED-M",
            stock: 5,
            price: "5900.00"
          },
          {
            productId: summerDress.id,
            colorId: blackColor.id,
            sizeId: sizeM.id,
            sku: "DRS-SUM-BLK-M",
            stock: 3,
            price: "6100.00"
          },
          {
            productId: linenShirt.id,
            colorId: whiteColor.id,
            sizeId: sizeM.id,
            sku: "SRT-LIN-WHT-M",
            stock: 9,
            price: "4900.00"
          },
          {
            productId: linenShirt.id,
            colorId: blueColor.id,
            sizeId: sizeL.id,
            sku: "SRT-LIN-BLU-L",
            stock: 4,
            price: "5200.00"
          },
          {
            productId: toteBag.id,
            colorId: blackColor.id,
            sizeId: sizeXs.id,
            sku: "BAG-TOTE-BLK-ONE",
            stock: 12,
            price: "1900.00"
          }
        ])
        .returning();

      await tx.insert(productImages).values([
        {
          productId: summerDress.id,
          colorId: redColor.id,
          url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
          isMain: true
        },
        {
          productId: summerDress.id,
          colorId: blackColor.id,
          url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
          isMain: false
        },
        {
          productId: linenShirt.id,
          colorId: whiteColor.id,
          url: "https://images.unsplash.com/photo-1603252109303-2751441dd157",
          isMain: true
        },
        {
          productId: toteBag.id,
          colorId: blackColor.id,
          url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
          isMain: true
        }
      ]);

      const [welcomeCampaign, vipCampaign, expiredCampaign] = await tx
        .insert(promotionCampaigns)
        .values([
          {
            name: "Welcome Gift",
            discountType: "percentage",
            discountValue: "15.00",
            expiresAt: daysFromNow(45)
          },
          {
            name: "VIP Fixed Discount",
            discountType: "fixed",
            discountValue: "1200.00",
            expiresAt: daysFromNow(90)
          },
          {
            name: "Old Spring Sale",
            discountType: "percentage",
            discountValue: "40.00",
            expiresAt: daysFromNow(-15)
          }
        ])
        .returning();

      const [coupon15, coupon30, couponGift, couponExpired, couponDisabled] = await tx
        .insert(coupons)
        .values([
          {
            campaignId: welcomeCampaign.id,
            code: "GIFT-15-ALICE",
            usageLimit: 1,
            usedCount: 0,
            isActive: true
          },
          {
            campaignId: welcomeCampaign.id,
            code: "GIFT-15-BOB",
            usageLimit: 3,
            usedCount: 1,
            isActive: true
          },
          {
            campaignId: vipCampaign.id,
            code: "VIP-1200-STORE",
            usageLimit: 5,
            usedCount: 1,
            isActive: true
          },
          {
            campaignId: expiredCampaign.id,
            code: "SPRING-40-OLD",
            usageLimit: 1,
            usedCount: 0,
            isActive: true
          },
          {
            campaignId: welcomeCampaign.id,
            code: "DISABLED-15",
            usageLimit: 2,
            usedCount: 0,
            isActive: false
          }
        ])
        .returning();

      await tx.insert(couponCategories).values([
        {
          campaignId: welcomeCampaign.id,
          categoryId: dressesCategory.id
        },
        {
          campaignId: vipCampaign.id,
          categoryId: shirtsCategory.id
        },
        {
          campaignId: vipCampaign.id,
          categoryId: accessoriesCategory.id
        }
      ]);

      const [vipGroup, regularGroup, wholesaleGroup] = await tx
        .insert(customerGroups)
        .values([
          { name: "VIP", discountPercent: 15 },
          { name: "Regular", discountPercent: 0 },
          { name: "Wholesale", discountPercent: 10 }
        ])
        .returning();

      const [alice, bob, claire, david] = await tx
        .insert(customers)
        .values([
          {
            phone: "+79990000001",
            firstName: "Alice",
            lastName: "Green",
            email: "alice@example.com",
            birthday: "1995-03-12",
            bonusPoints: 180,
            totalSpent: "15400.00",
            isSubscribed: true,
            createdAt: daysFromNow(-60),
            updatedAt: daysFromNow(-3)
          },
          {
            phone: "+79990000002",
            firstName: "Bob",
            lastName: "Miller",
            email: "bob@example.com",
            birthday: "1990-07-01",
            bonusPoints: 90,
            totalSpent: "8600.00",
            isSubscribed: true,
            createdAt: daysFromNow(-44),
            updatedAt: daysFromNow(-6)
          },
          {
            phone: "+79990000003",
            firstName: "Claire",
            lastName: "Stone",
            email: "claire@example.com",
            birthday: "1988-11-23",
            bonusPoints: 420,
            totalSpent: "36200.00",
            isSubscribed: false,
            createdAt: daysFromNow(-90),
            updatedAt: daysFromNow(-1)
          },
          {
            phone: "+79990000004",
            firstName: "David",
            lastName: "Young",
            email: "david@example.com",
            birthday: "1998-05-18",
            bonusPoints: 15,
            totalSpent: "2400.00",
            isSubscribed: true,
            createdAt: daysFromNow(-12),
            updatedAt: daysFromNow(-2)
          }
        ])
        .returning();

      await tx.insert(customersToGroups).values([
        { customerId: alice.id, groupId: vipGroup.id },
        { customerId: bob.id, groupId: regularGroup.id },
        { customerId: claire.id, groupId: wholesaleGroup.id },
        { customerId: claire.id, groupId: vipGroup.id },
        { customerId: david.id, groupId: regularGroup.id }
      ]);

      await tx.insert(customerNotes).values([
        {
          customerId: alice.id,
          note: "Prefers delivery after 18:00"
        },
        {
          customerId: bob.id,
          note: "Interested in new shirt arrivals"
        },
        {
          customerId: claire.id,
          note: "Corporate gifting account"
        }
      ]);

      const [orderOne, orderTwo, orderThree] = await tx
        .insert(orders)
        .values([
          {
            customerId: alice.id,
            couponId: coupon30.id,
            source: "online",
            totalAmount: "10030.00",
            discountAmount: "1770.00",
            createdAt: daysFromNow(-5),
            updatedAt: daysFromNow(-4)
          },
          {
            customerId: bob.id,
            couponId: couponGift.id,
            source: "offline",
            totalAmount: "3700.00",
            discountAmount: "1200.00",
            createdAt: daysFromNow(-2),
            updatedAt: daysFromNow(-2)
          },
          {
            customerId: claire.id,
            couponId: null,
            source: "offline",
            totalAmount: "15400.00",
            discountAmount: "0.00",
            createdAt: daysFromNow(-1),
            updatedAt: daysFromNow(-1)
          }
        ])
        .returning();

      await tx.insert(orderItems).values([
        {
          orderId: orderOne.id,
          variantId: dressRedM.id,
          quantity: 1,
          priceAtPurchase: "5900.00"
        },
        {
          orderId: orderOne.id,
          variantId: shirtWhiteM.id,
          quantity: 1,
          priceAtPurchase: "4900.00"
        },
        {
          orderId: orderTwo.id,
          variantId: toteBlack.id,
          quantity: 1,
          priceAtPurchase: "1900.00"
        },
        {
          orderId: orderTwo.id,
          variantId: shirtBlueL.id,
          quantity: 1,
          priceAtPurchase: "3000.00"
        },
        {
          orderId: orderThree.id,
          variantId: dressRedS.id,
          quantity: 1,
          priceAtPurchase: "5900.00"
        },
        {
          orderId: orderThree.id,
          variantId: dressBlackM.id,
          quantity: 1,
          priceAtPurchase: "6100.00"
        },
        {
          orderId: orderThree.id,
          variantId: shirtWhiteM.id,
          quantity: 1,
          priceAtPurchase: "3400.00"
        }
      ]);

      await tx.insert(orderStatusHistory).values([
        {
          orderId: orderOne.id,
          status: "pending",
          comment: "Awaiting payment confirmation",
          changedAt: daysFromNow(-5),
          changedBy: "seed-system"
        },
        {
          orderId: orderOne.id,
          status: "processing",
          comment: "Packed in warehouse",
          changedAt: daysFromNow(-4),
          changedBy: "seed-system"
        },
        {
          orderId: orderOne.id,
          status: "shipped",
          comment: "Sent with courier",
          changedAt: daysFromNow(-3),
          changedBy: "seed-system"
        },
        {
          orderId: orderTwo.id,
          status: "pending",
          comment: "Created at POS terminal",
          changedAt: daysFromNow(-2),
          changedBy: "seed-system"
        },
        {
          orderId: orderTwo.id,
          status: "delivered",
          comment: "Picked up in store",
          changedAt: daysFromNow(-1),
          changedBy: "seed-system"
        },
        {
          orderId: orderThree.id,
          status: "processing",
          comment: "Preparing invoice",
          changedAt: daysFromNow(-1),
          changedBy: "seed-system"
        }
      ]);

      await tx.insert(couponUsageHistory).values([
        {
          couponId: coupon30.id,
          orderId: orderOne.id,
          customerId: alice.id,
          usedAt: daysFromNow(-5)
        },
        {
          couponId: couponGift.id,
          orderId: orderTwo.id,
          customerId: bob.id,
          usedAt: daysFromNow(-2)
        }
      ]);

      await tx.insert(transactions).values([
        {
          paymentId: "PAY-1001",
          rrn: "407105123456",
          amount: 1003000,
          currency: "RUB",
          status: "succeeded",
          cardMask: "427638******1234",
          cardType: "visa",
          processedAt: daysFromNow(-5),
          rawData: { gateway: "demo", orderId: orderOne.id },
          createdAt: daysFromNow(-5),
          updatedAt: daysFromNow(-5)
        },
        {
          paymentId: "PAY-1002",
          rrn: "407105123457",
          amount: 370000,
          currency: "RUB",
          status: "succeeded",
          cardMask: "220002******5541",
          cardType: "mir",
          processedAt: daysFromNow(-2),
          rawData: { gateway: "demo", orderId: orderTwo.id },
          createdAt: daysFromNow(-2),
          updatedAt: daysFromNow(-2)
        },
        {
          paymentId: "PAY-1003",
          rrn: "407105123458",
          amount: 1540000,
          currency: "RUB",
          status: "refunded",
          cardMask: "541275******8812",
          cardType: "mastercard",
          processedAt: daysFromNow(-1),
          rawData: { gateway: "demo", orderId: orderThree.id },
          createdAt: daysFromNow(-1),
          updatedAt: daysFromNow(-1)
        },
        {
          paymentId: "PAY-1004",
          rrn: "407105123459",
          amount: 590000,
          currency: "RUB",
          status: "error",
          cardMask: "427638******4321",
          cardType: "visa",
          processedAt: daysFromNow(-7),
          rawData: { gateway: "demo", reason: "insufficient_funds" },
          createdAt: daysFromNow(-7),
          updatedAt: daysFromNow(-7)
        }
      ]);

      return {
        result: "success",
        seeded: {
          categories: 6,
          colors: 4,
          sizes: 4,
          products: 3,
          productVariants: 6,
          productImages: 4,
          promotionCampaigns: 3,
          coupons: 5,
          customers: 4,
          customerGroups: 3,
          customerNotes: 3,
          orders: 3,
          orderItems: 7,
          orderStatusHistory: 6,
          couponCategories: 3,
          couponUsageHistory: 2,
          transactions: 4
        }
      };
    });
  }
});
