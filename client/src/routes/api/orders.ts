import { createFileRoute } from "@tanstack/react-router";
import { createOrder, getOrder } from "@/backend/services/orders.service";
import { fail, ok } from "@/backend/http/respond";
import { orderInputSchema } from "@/shared/schemas";

export const Route = createFileRoute("/api/orders")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const id = new URL(request.url).searchParams.get("id");
        if (!id) return fail("Thiếu mã đơn hàng", 400);
        const order = getOrder(id);
        if (!order) return fail("Không tìm thấy đơn hàng", 404);
        return ok(order);
      },
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return fail("Body không phải JSON hợp lệ", 400);
        }
        const parsed = orderInputSchema.safeParse(body);
        if (!parsed.success) return fail("Dữ liệu đơn hàng không hợp lệ", 422, parsed.error.flatten());
        try {
          return ok(createOrder(parsed.data), 201);
        } catch (error) {
          return fail(error instanceof Error ? error.message : "Không tạo được đơn hàng", 400);
        }
      },
    },
  },
});
