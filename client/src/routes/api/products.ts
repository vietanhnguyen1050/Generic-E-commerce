import { createFileRoute } from "@tanstack/react-router";
import { listProducts } from "@/backend/services/products.service";
import { fail, ok } from "@/backend/http/respond";
import { productQuerySchema } from "@/shared/schemas";

export const Route = createFileRoute("/api/products")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const parsed = productQuerySchema.safeParse(Object.fromEntries(url.searchParams));
        if (!parsed.success) return fail("Tham số không hợp lệ", 400, parsed.error.flatten());
        return ok(listProducts(parsed.data));
      },
    },
  },
});
