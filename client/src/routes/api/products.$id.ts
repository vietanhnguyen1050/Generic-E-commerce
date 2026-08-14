import { createFileRoute } from "@tanstack/react-router";
import { getProductDetail } from "@/backend/services/products.service";
import { fail, ok } from "@/backend/http/respond";

export const Route = createFileRoute("/api/products/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const detail = getProductDetail(params.id);
        if (!detail) return fail("Không tìm thấy sản phẩm", 404);
        return ok(detail);
      },
    },
  },
});
