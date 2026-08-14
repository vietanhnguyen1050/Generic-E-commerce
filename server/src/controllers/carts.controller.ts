import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

// Helper: Tìm hoặc tạo giỏ hàng theo sessionToken hoặc userId
async function getOrCreateCart(sessionToken?: string, userId?: string) {
  let cart = null;

  // 1. Tìm theo sessionToken nếu có
  if (sessionToken?.trim()) {
    cart = await prisma.carts.findUnique({
      where: { sessionToken: sessionToken.trim() },
      include: {
        cartItems: {
          include: { product: true },
          orderBy: { id: "asc" },
        },
      },
    });
  }

  // 2. Nếu tìm thấy cart, trả về
  if (cart) return cart;

  // 3. Nếu chưa có, tạo sessionToken mới
  const validSessionToken = sessionToken?.trim() || `st_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  // 4. Đảm bảo Role & User tồn tại để gán foreign key userId
  const defaultRole = await prisma.roles.upsert({
    where: { Role: "CUSTOMER" },
    update: {},
    create: { Role: "CUSTOMER" },
  });

  let dbUser = null;
  if (userId?.trim()) {
    dbUser = await prisma.users.findUnique({ where: { firebase_Uid: userId.trim() } });
  }

  if (!dbUser) {
    const guestPhone = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    dbUser = await prisma.users.create({
      data: {
        roleId: defaultRole.id,
        firebase_Uid: `guest_cart_${validSessionToken}`,
        email: `${validSessionToken}@cart.local`,
        displayName: "Khách hàng",
        phoneNumber: guestPhone,
      },
    });
  }

  // 5. Tạo Carts mới
  cart = await prisma.carts.create({
    data: {
      userId: dbUser.id,
      sessionToken: validSessionToken,
    },
    include: {
      cartItems: {
        include: { product: true },
        orderBy: { id: "asc" },
      },
    },
  });

  return cart;
}

// Helper format dữ liệu cart trả về cho client
function formatCartResponse(cart: Awaited<ReturnType<typeof getOrCreateCart>>) {
  const items = cart.cartItems.map((ci) => ({
    id: String(ci.productId),
    name: ci.product.name,
    image: ci.product.imageUrl,
    price: ci.product.discountPrice,
    listPrice: ci.product.actualPrice > 0 ? ci.product.actualPrice : ci.product.discountPrice,
    qty: ci.quantity,
  }));

  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const savings = items.reduce((sum, item) => sum + (item.listPrice - item.price) * item.qty, 0);

  return {
    id: cart.id,
    sessionToken: cart.sessionToken,
    items,
    count,
    subtotal,
    savings,
  };
}

// ─── GET /api/cart ────────────────────────────────────────────────────────────

export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionToken = (req.headers["x-session-token"] as string) || (req.query.sessionToken as string);
    const userId = req.query.userId as string | undefined;

    const cart = await getOrCreateCart(sessionToken, userId);
    res.status(200).json(formatCartResponse(cart));
  } catch (error) {
    next(error);
  }
}

// ─── POST /api/cart/items ─────────────────────────────────────────────────────

export async function addToCart(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionToken = (req.headers["x-session-token"] as string) || (req.query.sessionToken as string);
    const { productId, qty = 1 } = req.body as { productId: string | number; qty?: number };

    const numericProductId = Number(productId);
    if (!Number.isInteger(numericProductId) || numericProductId <= 0) {
      res.status(400).json({ message: "ID sản phẩm không hợp lệ." });
      return;
    }

    const addQty = Math.max(1, Number(qty) || 1);

    // Kiểm tra sản phẩm có trong Postgres không
    const product = await prisma.products.findUnique({
      where: { id: numericProductId },
    });
    if (!product) {
      res.status(404).json({ message: "Sản phẩm không tồn tại." });
      return;
    }

    const cart = await getOrCreateCart(sessionToken);

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingItem = await prisma.cartItems.findFirst({
      where: {
        cartId: cart.id,
        productId: numericProductId,
      },
    });

    if (existingItem) {
      await prisma.cartItems.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + addQty },
      });
    } else {
      await prisma.cartItems.create({
        data: {
          cartId: cart.id,
          productId: numericProductId,
          quantity: addQty,
        },
      });
    }

    // Lấy lại giỏ hàng mới nhất
    const updatedCart = await prisma.carts.findUniqueOrThrow({
      where: { id: cart.id },
      include: {
        cartItems: {
          include: { product: true },
          orderBy: { id: "asc" },
        },
      },
    });

    res.status(200).json(formatCartResponse(updatedCart));
  } catch (error) {
    next(error);
  }
}

// ─── PATCH /api/cart/items/:productId ─────────────────────────────────────────

export async function updateCartItem(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionToken = (req.headers["x-session-token"] as string) || (req.query.sessionToken as string);
    const numericProductId = Number(req.params.productId);
    const { qty } = req.body as { qty: number };

    if (!Number.isInteger(numericProductId) || numericProductId <= 0) {
      res.status(400).json({ message: "ID sản phẩm không hợp lệ." });
      return;
    }

    const cart = await getOrCreateCart(sessionToken);
    const existingItem = await prisma.cartItems.findFirst({
      where: {
        cartId: cart.id,
        productId: numericProductId,
      },
    });

    if (existingItem) {
      if (qty <= 0) {
        await prisma.cartItems.delete({ where: { id: existingItem.id } });
      } else {
        await prisma.cartItems.update({
          where: { id: existingItem.id },
          data: { quantity: qty },
        });
      }
    }

    const updatedCart = await prisma.carts.findUniqueOrThrow({
      where: { id: cart.id },
      include: {
        cartItems: {
          include: { product: true },
          orderBy: { id: "asc" },
        },
      },
    });

    res.status(200).json(formatCartResponse(updatedCart));
  } catch (error) {
    next(error);
  }
}

// ─── DELETE /api/cart/items/:productId ────────────────────────────────────────

export async function removeCartItem(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionToken = (req.headers["x-session-token"] as string) || (req.query.sessionToken as string);
    const numericProductId = Number(req.params.productId);

    if (!Number.isInteger(numericProductId) || numericProductId <= 0) {
      res.status(400).json({ message: "ID sản phẩm không hợp lệ." });
      return;
    }

    const cart = await getOrCreateCart(sessionToken);

    await prisma.cartItems.deleteMany({
      where: {
        cartId: cart.id,
        productId: numericProductId,
      },
    });

    const updatedCart = await prisma.carts.findUniqueOrThrow({
      where: { id: cart.id },
      include: {
        cartItems: {
          include: { product: true },
          orderBy: { id: "asc" },
        },
      },
    });

    res.status(200).json(formatCartResponse(updatedCart));
  } catch (error) {
    next(error);
  }
}

// ─── DELETE /api/cart ─────────────────────────────────────────────────────────

export async function clearCart(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionToken = (req.headers["x-session-token"] as string) || (req.query.sessionToken as string);
    const cart = await getOrCreateCart(sessionToken);

    await prisma.cartItems.deleteMany({
      where: { cartId: cart.id },
    });

    const updatedCart = await prisma.carts.findUniqueOrThrow({
      where: { id: cart.id },
      include: {
        cartItems: {
          include: { product: true },
          orderBy: { id: "asc" },
        },
      },
    });

    res.status(200).json(formatCartResponse(updatedCart));
  } catch (error) {
    next(error);
  }
}
