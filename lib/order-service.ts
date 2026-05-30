import {
  createSalesOrder as createSellerSalesOrder,
  getSalesOrderById as getSellerSalesOrderById,
  getSalesOrdersForBuyer as getSellerSalesOrdersForBuyer,
  getSalesOrdersForBuyerList as getSellerSalesOrdersForBuyerList,
  getSalesOrderStatus as getSellerSalesOrderStatus
} from "@/lib/seller-service";
import { getShippingForOrder } from "@/lib/shipping-service";

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
