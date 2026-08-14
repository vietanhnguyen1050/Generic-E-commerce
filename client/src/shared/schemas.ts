import { z } from "zod";

export const productQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  category: z.string().trim().max(80).optional(),
  sort: z.enum(["pho-bien", "moi-nhat", "gia-tang", "gia-giam", "danh-gia"]).optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).max(10_000).optional(),
});

export const orderInputSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{8,15}$/, "Số điện thoại không hợp lệ"),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  address: z.string().trim().min(5).max(300),
  note: z.string().trim().max(500).optional().or(z.literal("")),
  shippingMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["cod", "bank", "momo", "card"]),
  userId: z.string().trim().max(128).optional().or(z.literal("")),
  items: z
    .array(z.object({ id: z.string().trim().min(1).max(120), qty: z.number().int().min(1).max(99) }))
    .min(1)
    .max(50),
});

export const authCredentialsSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ").max(120),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").max(72),
});

export const registerSchema = authCredentialsSchema.extend({
  fullName: z.string().trim().min(2, "Vui lòng nhập họ tên").max(80),
});
