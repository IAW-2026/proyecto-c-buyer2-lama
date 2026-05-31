import { checkoutSellerMockConfigSchema } from "@/lib/validation";

export const CHECKOUT_SHIPPING_AMOUNT = 4500;

export function getCheckoutMockSellerId() {
  const parsed = checkoutSellerMockConfigSchema.safeParse({
    ALLOW_CHECKOUT_SELLER_MOCK: process.env.ALLOW_CHECKOUT_SELLER_MOCK,
    CHECKOUT_MOCK_SELLER_ID: process.env.CHECKOUT_MOCK_SELLER_ID
  });

  if (!parsed.success || parsed.data.ALLOW_CHECKOUT_SELLER_MOCK !== "true") {
    return null;
  }

  return parsed.data.CHECKOUT_MOCK_SELLER_ID ?? null;
}
