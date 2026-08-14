// BE — nghiệp vụ đơn hàng. Giá luôn được tính lại ở server, không tin dữ liệu client.
import { findProductById } from "@/backend/repositories/products.repository";
import { calcShippingFee } from "@/shared/constants";
import type { Order, OrderInput } from "@/shared/types";

const orders = new Map<string, Order>();

export function createOrder(input: OrderInput): Order {
  const items = input.items.map((line) => {
    const product = findProductById(line.id);
    if (!product) throw new Error(`Không tìm thấy sản phẩm: ${line.id}`);
    return {
      id: product.id,
      name: product.name,
      image: product.image,
      qty: line.qty,
      price: product.price,
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingFee = calcShippingFee(subtotal, input.shippingMethod);
  const { items: _ignored, ...customer } = input;

  const order: Order = {
    id: `ZN${Date.now().toString().slice(-8)}`,
    createdAt: new Date().toISOString(),
    customer,
    items,
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
  };

  orders.set(order.id, order);
  return order;
}

export function getOrder(id: string): Order | undefined {
  return orders.get(id);
}
