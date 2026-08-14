// FE — giỏ hàng lưu vào PostgreSQL database qua API.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  fetchCart,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
  type CartLine,
} from "@/frontend/api/cart.api";
import type { Product } from "@/shared/types";

export type { CartLine };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  savings: number;
  isLoading: boolean;
  add: (product: Product, qty?: number) => Promise<void>;
  setQty: (id: string, qty: number) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tải giỏ hàng từ PostgreSQL khi khởi chạy
  const loadCart = async () => {
    try {
      const data = await fetchCart();
      if (data && Array.isArray(data.items)) {
        setLines(data.items);
      }
    } catch (err) {
      console.error("Không thể tải giỏ hàng từ database:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCart();
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      isLoading,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: lines.reduce((s, l) => s + l.price * l.qty, 0),
      savings: lines.reduce((s, l) => s + (l.listPrice - l.price) * l.qty, 0),
      refresh: loadCart,

      // Thêm sản phẩm vào database
      add: async (product: Product, qty = 1) => {
        // Cập nhật giao diện tức thì (Optimistic update)
        setLines((prev) => {
          const found = prev.find((l) => l.id === product.id);
          if (found) {
            return prev.map((l) => (l.id === product.id ? { ...l, qty: l.qty + qty } : l));
          }
          return [
            ...prev,
            {
              id: product.id,
              name: product.name,
              image: product.image,
              price: product.price,
              listPrice: product.listPrice,
              qty,
            },
          ];
        });

        // Đồng bộ lưu vào PostgreSQL database
        try {
          const res = await addToCartApi(product.id, qty);
          if (res?.items) setLines(res.items);
        } catch (err) {
          console.error("Lỗi khi thêm sản phẩm vào database:", err);
          void loadCart(); // Tải lại dữ liệu chuẩn nếu lỗi
        }
      },

      // Thay đổi số lượng sản phẩm trong database
      setQty: async (id: string, qty: number) => {
        setLines((prev) =>
          qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
        );

        try {
          const res = await updateCartItemApi(id, qty);
          if (res?.items) setLines(res.items);
        } catch (err) {
          console.error("Lỗi khi cập nhật số lượng trong database:", err);
          void loadCart();
        }
      },

      // Xoá sản phẩm khỏi database
      remove: async (id: string) => {
        setLines((prev) => prev.filter((l) => l.id !== id));

        try {
          const res = await removeCartItemApi(id);
          if (res?.items) setLines(res.items);
        } catch (err) {
          console.error("Lỗi khi xoá sản phẩm trong database:", err);
          void loadCart();
        }
      },

      // Xoá toàn bộ giỏ hàng trong database
      clear: async () => {
        setLines([]);

        try {
          const res = await clearCartApi();
          if (res?.items) setLines(res.items);
        } catch (err) {
          console.error("Lỗi khi dọn giỏ hàng trong database:", err);
        }
      },
    }),
    [lines, isLoading],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải dùng bên trong CartProvider");
  return ctx;
}
