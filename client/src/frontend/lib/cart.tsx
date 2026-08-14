// FE — giỏ hàng lưu localStorage. Lưu snapshot sản phẩm để không phải gọi lại API.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/shared/types";

export type CartLine = {
  id: string;
  name: string;
  image: string;
  price: number;
  listPrice: number;
  qty: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  savings: number;
  add: (product: Product, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "zenova.cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: lines.reduce((s, l) => s + l.price * l.qty, 0),
      savings: lines.reduce((s, l) => s + (l.listPrice - l.price) * l.qty, 0),
      add: (product, qty = 1) =>
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
        }),
      setQty: (id, qty) =>
        setLines((prev) =>
          qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
        ),
      remove: (id) => setLines((prev) => prev.filter((l) => l.id !== id)),
      clear: () => setLines([]),
    }),
    [lines],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải dùng bên trong CartProvider");
  return ctx;
}
