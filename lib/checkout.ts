import type { SalesOrder } from "@/lib/types";

export const CHECKOUT_SHIPPING_AMOUNT = 5;

type SalesOrderSellerSource = Pick<SalesOrder, "clerk_user_id_vendedor" | "vendedor_id" | "items"> & {
  orden_id?: string;
};

export function getSalesOrderSellerId(
  order: SalesOrderSellerSource
) {
  const itemWithSellerId = order.items.find((item) => item.clerk_user_id_vendedor || item.vendedor_id);

  return (
    order.clerk_user_id_vendedor ??
    order.vendedor_id ??
    itemWithSellerId?.clerk_user_id_vendedor ??
    itemWithSellerId?.vendedor_id ??
    null
  );
}

function getCheckoutMockSellerId() {
  const isMockAllowed =
    process.env.NODE_ENV !== "production" &&
    process.env.ALLOW_CHECKOUT_SELLER_MOCK?.trim().toLowerCase() === "true";

  if (!isMockAllowed) {
    return null;
  }

  return (
    process.env.CHECKOUT_MOCK_SELLER_ID?.trim() ||
    process.env.MOCK_SELLER_ID?.trim() ||
    null
  );
}

export function resolveSalesOrderSellerId(order: SalesOrderSellerSource) {
  const sellerId = getSalesOrderSellerId(order);

  if (sellerId) {
    return sellerId;
  }

  const mockSellerId = getCheckoutMockSellerId();

  if (mockSellerId) {
    console.warn("[checkout] Using mocked vendedor_id because Seller did not return one.", {
      orden_id: order.orden_id
    });
  }

  return mockSellerId;
}
