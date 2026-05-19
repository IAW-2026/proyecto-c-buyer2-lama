import {
  createOrder as createMockOrder,
  getOrderStatus as getMockOrderStatus,
  getOrdersForBuyer as getMockOrdersForBuyer,
  getShippingForOrder as getMockShippingForOrder
} from "@/lib/mock-external";

export type CreateSalesOrderInput = {
  clerkUserId: string;
  productIds: string[];
  total: number;
  direccionEnvio: string;
};

export async function createSalesOrder(input: CreateSalesOrderInput) {
  return createMockOrder(input);
}

export async function getSalesOrderStatus(orderId: string) {
  return getMockOrderStatus(orderId);
}

export async function getSalesOrdersForBuyer(buyerId: string) {
  return getMockOrdersForBuyer(buyerId);
}

export async function getSalesOrderShipping(orderId: string) {
  return getMockShippingForOrder(orderId);
}
