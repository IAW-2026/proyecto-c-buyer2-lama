import {
  createSalesOrder as createSellerSalesOrder,
  getSalesOrderById as getSellerSalesOrderById,
  getSalesOrdersForBuyer as getSellerSalesOrdersForBuyer,
  getSalesOrdersForBuyerList as getSellerSalesOrdersForBuyerList,
  getSalesOrderStatus as getSellerSalesOrderStatus,
  getProductsByIds
} from "@/lib/seller-service";
import { getShippingForOrder } from "@/lib/shipping-service";
import type { SalesOrder, SalesOrderItem } from "@/lib/types";

export type CreateSalesOrderInput = {
  ordenId: string;
  clerkUserId: string;
  items: Array<{
    producto_id: string;
    precio_unitario: number;
  }>;
  precioTotal: number;
  direccionEnvio: string;
};

export async function createSalesOrder(input: CreateSalesOrderInput) {
  return createSellerSalesOrder(input);
}

export async function getSalesOrderStatus(orderId: string) {
  return getSellerSalesOrderStatus(orderId);
}

export async function getSalesOrderById(orderId: string) {
  return getSellerSalesOrderById(orderId);
}

export async function enrichSalesOrderItems(order: SalesOrder): Promise<SalesOrder> {
  const productIds = [
    ...new Set([
      ...order.producto_ids,
      ...order.items.map((item) => item.producto_id)
    ].filter(Boolean))
  ];

  if (!productIds.length) {
    return order;
  }

  const products = await getProductsByIds(productIds).catch(() => []);
  const productsById = new Map(products.map((product) => [product.producto_id, product]));
  const itemsByProductId = new Map(order.items.map((item) => [item.producto_id, item]));
  const completeItems = productIds.map<SalesOrderItem>((productId) => {
    const item = itemsByProductId.get(productId);
    const product = productsById.get(productId);

    return {
      ...item,
      producto_id: productId,
      precio_unitario:
        item && item.precio_unitario > 0
          ? item.precio_unitario
          : product?.precio ?? item?.precio_unitario ?? 0,
      titulo: item?.titulo ?? product?.titulo ?? "",
      imagenes: item?.imagenes?.length ? item.imagenes : product?.imagenes ?? []
    };
  });

  return {
    ...order,
    items: completeItems,
    producto_ids: productIds
  };
}

export async function getSalesOrdersForBuyer(buyerId: string) {
  return getSellerSalesOrdersForBuyer(buyerId);
}

export async function getSalesOrdersForBuyerList(
  buyerId: string,
  options?: Parameters<typeof getSellerSalesOrdersForBuyerList>[1]
) {
  return getSellerSalesOrdersForBuyerList(buyerId, options);
}

export async function getSalesOrderShipping(orderId: string) {
  return getShippingForOrder(orderId);
}
