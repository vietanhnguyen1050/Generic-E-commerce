import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

// Hằng số tính phí ship (đồng bộ với frontend)
const FREE_SHIPPING_THRESHOLD = 500_000;
const SHIPPING_FEE_STANDARD = 25_000;
const SHIPPING_FEE_EXPRESS = 55_000;

function calcShippingFee(subtotal: number, method: string) {
  if (method === "express") return SHIPPING_FEE_EXPRESS;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE_STANDARD;
}

// ─── POST /api/orders ─────────────────────────────────────────────────────────

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      fullName,
      phone,
      email,
      address,
      note,
      shippingMethod = "standard",
      paymentMethod = "cod",
      items,
      userId,
    } = req.body as {
      fullName?: string;
      phone?: string;
      email?: string;
      address?: string;
      note?: string;
      shippingMethod?: string;
      paymentMethod?: string;
      items?: { id: string | number; qty: number }[];
      userId?: string;
    };

    // 1. Kiểm tra đầu vào cơ bản
    if (!fullName?.trim() || !phone?.trim() || !address?.trim()) {
      res.status(400).json({ message: "Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ giao hàng." });
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "Đơn hàng phải có ít nhất một sản phẩm." });
      return;
    }

    // 2. Lấy thông tin & giá sản phẩm từ PostgreSQL
    const productIds = items
      .map((i) => Number(i.id))
      .filter((id) => Number.isInteger(id) && id > 0);

    const dbProducts = await prisma.products.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    const orderItemsData: {
      productId: number;
      name: string;
      image: string;
      qty: number;
      price: number;
    }[] = [];

    let subtotal = 0;

    for (const item of items) {
      const pId = Number(item.id);
      const product = productMap.get(pId);
      if (!product) {
        res.status(404).json({ message: `Không tìm thấy sản phẩm có ID: ${item.id}` });
        return;
      }

      const qty = Math.max(1, Number(item.qty) || 1);
      const price = product.discountPrice;
      subtotal += price * qty;

      orderItemsData.push({
        productId: product.id,
        name: product.name,
        image: product.imageUrl,
        qty,
        price,
      });
    }

    const shippingFee = calcShippingFee(subtotal, shippingMethod);
    const totalAmount = subtotal + shippingFee;

    // 3. Đảm bảo vai trò (Role) trong DB
    const defaultRole = await prisma.roles.upsert({
      where: { Role: "CUSTOMER" },
      update: {},
      create: { Role: "CUSTOMER" },
    });

    // 4. Tìm hoặc tạo người dùng trong PostgreSQL
    let dbUser = null;
    const cleanPhone = phone.trim();
    const cleanEmail = email?.trim() || `guest_${cleanPhone}@guest.local`;
    const firebaseUid = userId?.trim() || `guest_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    if (userId?.trim()) {
      dbUser = await prisma.users.findUnique({ where: { firebase_Uid: userId.trim() } });
    }

    if (!dbUser && cleanEmail) {
      dbUser = await prisma.users.findUnique({ where: { email: cleanEmail } });
    }

    if (!dbUser && cleanPhone) {
      dbUser = await prisma.users.findUnique({ where: { phoneNumber: cleanPhone } });
    }

    if (!dbUser) {
      dbUser = await prisma.users.create({
        data: {
          roleId: defaultRole.id,
          firebase_Uid: firebaseUid,
          email: cleanEmail,
          displayName: fullName.trim(),
          phoneNumber: cleanPhone,
          totalValuePurchased: totalAmount,
        },
      });
    } else {
      // Cập nhật tổng giá trị mua hàng của người dùng
      await prisma.users.update({
        where: { id: dbUser.id },
        data: {
          totalValuePurchased: { increment: totalAmount },
        },
      });
    }

    // 5. Lưu đơn hàng & chi tiết đơn hàng vào PostgreSQL qua Transaction
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const newOrder = await prisma.orders.create({
      data: {
        userId: dbUser.id,
        totalAmount,
        status: "PENDING",
        orderItems: {
          create: orderItemsData.map((item) => ({
            productId: item.productId,
            quantity: item.qty,
            priceAtPurchase: item.price,
          })),
        },
        payments: {
          create: {
            transactionId,
            paymentMethod: paymentMethod.toUpperCase(),
            status: paymentMethod.toLowerCase() === "cod" ? "PENDING" : "CONFIRMED",
            gatewayResponse: "ORDER_CREATED_SUCCESSFULLY",
            amount: totalAmount,
          },
        },
      },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    // 6. Trả về đúng format Order cho Frontend
    const responsePayload = {
      id: `ZN${String(newOrder.id).padStart(6, "0")}`,
      createdAt: newOrder.createdAt.toISOString(),
      customer: {
        fullName: fullName.trim(),
        phone: cleanPhone,
        email: email?.trim(),
        address: address.trim(),
        note: note?.trim(),
        shippingMethod: shippingMethod as "standard" | "express",
        paymentMethod: paymentMethod as "cod" | "bank" | "momo" | "card",
        userId: dbUser.firebase_Uid,
      },
      items: orderItemsData.map((item) => ({
        id: String(item.productId),
        name: item.name,
        image: item.image,
        qty: item.qty,
        price: item.price,
      })),
      subtotal,
      shippingFee,
      total: totalAmount,
    };

    res.status(201).json(responsePayload);
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/orders/:id hoặc /api/orders?id=... ──────────────────────────────

export async function getOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const rawId = req.params.id || (req.query.id as string);
    if (!rawId) {
      res.status(400).json({ message: "Thiếu ID đơn hàng." });
      return;
    }

    // Parse 'ZN000001' hoặc '1' -> 1
    const numericId = Number(rawId.replace(/^ZN/i, ""));
    if (!Number.isInteger(numericId) || numericId <= 0) {
      res.status(400).json({ message: "ID đơn hàng không hợp lệ." });
      return;
    }

    const order = await prisma.orders.findUnique({
      where: { id: numericId },
      include: {
        user: true,
        orderItems: {
          include: { product: true },
        },
        payments: true,
      },
    });

    if (!order) {
      res.status(404).json({ message: "Không tìm thấy đơn hàng." });
      return;
    }

    const items = order.orderItems.map((oi) => ({
      id: String(oi.productId),
      name: oi.product.name,
      image: oi.product.imageUrl,
      qty: oi.quantity,
      price: oi.priceAtPurchase,
    }));

    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const shippingFee = Math.max(0, order.totalAmount - subtotal);
    const payment = order.payments[0];

    const responsePayload = {
      id: `ZN${String(order.id).padStart(6, "0")}`,
      createdAt: order.createdAt.toISOString(),
      customer: {
        fullName: order.user.displayName,
        phone: order.user.phoneNumber,
        email: order.user.email,
        address: "",
        shippingMethod: (shippingFee > 25000 ? "express" : "standard") as "standard" | "express",
        paymentMethod: (payment?.paymentMethod.toLowerCase() || "cod") as "cod" | "bank" | "momo" | "card",
        userId: order.user.firebase_Uid,
      },
      items,
      subtotal,
      shippingFee,
      total: order.totalAmount,
    };

    res.status(200).json(responsePayload);
  } catch (error) {
    next(error);
  }
}
