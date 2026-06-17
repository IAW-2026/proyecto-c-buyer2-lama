import type { SalesOrder } from "@/lib/types";

export const CHECKOUT_SHIPPING_AMOUNT = 5;

export function getSalesOrderSellerId(
  order: Pick<SalesOrder, "clerk_user_id_vendedor" | "vendedor_id" | "items">
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
