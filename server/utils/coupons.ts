import { eq } from "drizzle-orm";
import { coupons } from "~~/server/db/schema";
import { db } from "~~/server/utils/db";

type CouponStatus = "valid" | "inactive" | "expired" | "exhausted" | "not_found";

const buildDiscountLabel = (
  discountType: "percentage" | "fixed" | null,
  discountValue: string | number | null
) => {
  if (!discountType || discountValue === null || discountValue === undefined) {
    return "Без скидки";
  }

  if (discountType === "percentage") {
    return `${Number(discountValue)}%`;
  }

  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Number(discountValue));
};

const getCouponStatus = (coupon: {
  isActive: boolean | null;
  usageLimit: number | null;
  usedCount: number | null;
  campaign?: { expiresAt: Date | null } | null;
} | null): CouponStatus => {
  if (!coupon) {
    return "not_found";
  }

  if (!coupon.isActive) {
    return "inactive";
  }

  if (coupon.campaign?.expiresAt && coupon.campaign.expiresAt.getTime() < Date.now()) {
    return "expired";
  }

  if (
    coupon.usageLimit !== null &&
    coupon.usageLimit !== undefined &&
    (coupon.usedCount ?? 0) >= coupon.usageLimit
  ) {
    return "exhausted";
  }

  return "valid";
};

const getStatusLabel = (status: CouponStatus) => {
  switch (status) {
    case "valid":
      return "Действителен";
    case "inactive":
      return "Выключен";
    case "expired":
      return "Истёк";
    case "exhausted":
      return "Лимит исчерпан";
    default:
      return "Не найден";
  }
};

export const extractCouponCode = (value: string) => {
  const input = value.trim();

  if (!input) {
    return "";
  }

  try {
    const url = new URL(input);

    return (
      url.searchParams.get("coupon") ??
      url.searchParams.get("code") ??
      url.pathname.split("/").filter(Boolean).at(-1) ??
      input
    );
  } catch {
    return input;
  }
};

export const listCouponsWithMeta = async (origin: string) => {
  const records = await db.query.coupons.findMany({
    with: {
      campaign: true
    },
    orderBy: (coupons, { desc }) => [desc(coupons.code)]
  });

  return records.map(coupon => {
    const status = getCouponStatus(coupon);
    const shareUrl = `${origin}/gift/${coupon.code}`;

    return {
      id: coupon.id,
      code: coupon.code,
      isActive: coupon.isActive ?? false,
      usedCount: coupon.usedCount ?? 0,
      usageLimit: coupon.usageLimit,
      status,
      statusLabel: getStatusLabel(status),
      discountType: coupon.campaign?.discountType ?? null,
      discountValue: coupon.campaign?.discountValue ?? null,
      discountLabel: buildDiscountLabel(
        coupon.campaign?.discountType ?? null,
        coupon.campaign?.discountValue ?? null
      ),
      expiresAt: coupon.campaign?.expiresAt?.toISOString() ?? null,
      shareUrl
    };
  });
};

export const validateCouponByScannedValue = async (
  scannedValue: string,
  origin: string
) => {
  const code = extractCouponCode(scannedValue);

  if (!code) {
    return {
      scannedValue,
      code,
      exists: false,
      valid: false,
      status: "not_found" as const,
      statusLabel: getStatusLabel("not_found"),
      message: "QR-код пустой или не содержит код купона",
      discountLabel: null,
      shareUrl: null
    };
  }

  const coupon = await db.query.coupons.findFirst({
    where: eq(coupons.code, code),
    with: {
      campaign: true
    }
  });

  const status = getCouponStatus(coupon);

  if (!coupon) {
    return {
      scannedValue,
      code,
      exists: false,
      valid: false,
      status,
      statusLabel: getStatusLabel(status),
      message: "Такой QR-код не найден в базе данных",
      discountLabel: null,
      shareUrl: null
    };
  }

  const discountLabel = buildDiscountLabel(
    coupon.campaign?.discountType ?? null,
    coupon.campaign?.discountValue ?? null
  );

  return {
    id: coupon.id,
    scannedValue,
    code,
    exists: true,
    valid: status === "valid",
    status,
    statusLabel: getStatusLabel(status),
    message:
      status === "valid"
        ? `Купон найден и действителен. Скидка: ${discountLabel}.`
        : `Купон найден, но сейчас недоступен: ${getStatusLabel(status)}.`,
    discountLabel,
    usageLimit: coupon.usageLimit,
    usedCount: coupon.usedCount ?? 0,
    expiresAt: coupon.campaign?.expiresAt?.toISOString() ?? null,
    shareUrl: `${origin}/gift/${coupon.code}`
  };
};
