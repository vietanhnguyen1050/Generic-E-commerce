import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Tạo slug từ tên danh mục (lowercase, khoảng trắng → dấu gạch ngang). */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── GET /api/products ────────────────────────────────────────────────────────

export async function listProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      q,
      category,
      sort = "pho-bien",
      minPrice,
      maxPrice,
      limit = 20,
      offset = 0,
    } = req.query as Record<string, string | undefined>;

    const take = Math.min(Number(limit) || 20, 100);
    const skip = Number(offset) || 0;

    // ── Build WHERE ───────────────────────────────────────────────────────────
    const where: Prisma.ProductsWhereInput = { available: true };

    if (q) {
      where.name = { contains: q, mode: "insensitive" };
    }

    if (category) {
      where.mainCategory = { mainCategory: { equals: category, mode: "insensitive" } };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.discountPrice = {};
      if (minPrice !== undefined) where.discountPrice.gte = Number(minPrice);
      if (maxPrice !== undefined) where.discountPrice.lte = Number(maxPrice);
    }

    // ── Build ORDER BY ────────────────────────────────────────────────────────
    let orderBy: Prisma.ProductsOrderByWithRelationInput = {};
    switch (sort) {
      case "moi-nhat":
        orderBy = { updatedAt: "desc" };
        break;
      case "gia-tang":
        orderBy = { discountPrice: "asc" };
        break;
      case "gia-giam":
        orderBy = { discountPrice: "desc" };
        break;
      case "danh-gia":
        orderBy = { ratings: "desc" };
        break;
      default: // pho-bien
        orderBy = { numberOfRatings: "desc" };
    }

    // ── Queries chạy song song ─────────────────────────────────────────────
    const [items, total, allMainCategories, priceAgg] = await Promise.all([
      prisma.products.findMany({
        where,
        orderBy,
        take,
        skip,
        include: {
          mainCategory: true,
          subCategory: true,
        },
      }),
      prisma.products.count({ where }),
      prisma.mainCategories.findMany({
        include: { subCategories: true },
      }),
      prisma.products.aggregate({
        where: { available: true },
        _min: { discountPrice: true },
        _max: { discountPrice: true },
      }),
    ]);

    // ── Đếm sản phẩm theo danh mục (bỏ qua filter category hiện tại) ────────
    const whereForCounts: Prisma.ProductsWhereInput = { available: true };
    if (q) whereForCounts.name = where.name;
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereForCounts.discountPrice = where.discountPrice;
    }

    const categoryCountsRaw = await prisma.products.groupBy({
      by: ["mainCategoryId"],
      where: whereForCounts,
      _count: { id: true },
    });

    // Map mainCategoryId → slug
    const mainCatMap = new Map(allMainCategories.map((c) => [c.id, c]));
    const categoryCounts: Record<string, number> = {};
    for (const row of categoryCountsRaw) {
      const cat = mainCatMap.get(row.mainCategoryId);
      if (cat) {
        categoryCounts[cat.mainCategory] = row._count.id;
      }
    }

    // ── Format response ───────────────────────────────────────────────────────
    const categories = allMainCategories.map((mc) => ({
      slug: mc.mainCategory,
      name: mc.mainCategory,
      icon: "",
      sub: mc.subCategories.map((sc) => ({
        slug: sc.subCategory,
        name: sc.subCategory,
      })),
    }));

    const responseItems = items.map((p) => ({
      id: String(p.id),
      name: p.name,
      brand: "",
      category: p.mainCategory.mainCategory,
      subcategory: p.subCategory.subCategory,
      price: p.discountPrice,
      listPrice: p.actualPrice,
      image: p.imageUrl,
      rating: p.ratings,
      reviews: p.numberOfRatings,
      sold: 0,
      stock: p.quantity,
      freeShip: false,
      description: "",
      highlights: [] as string[],
    }));

    res.status(200).json({
      items: responseItems,
      total,
      offset: skip,
      hasMore: skip + items.length < total,
      categories,
      priceBounds: {
        min: priceAgg._min.discountPrice ?? 0,
        max: priceAgg._max.discountPrice ?? 0,
      },
      categoryCounts,
    });
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/products/:id ────────────────────────────────────────────────────

export async function getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: "ID sản phẩm không hợp lệ." });
      return;
    }

    const product = await prisma.products.findUnique({
      where: { id },
      include: {
        mainCategory: { include: { subCategories: true } },
        subCategory: true,
      },
    });

    if (!product) {
      res.status(404).json({ message: "Không tìm thấy sản phẩm." });
      return;
    }

    // Related: cùng mainCategory, khác sản phẩm, tối đa 8
    const relatedRaw = await prisma.products.findMany({
      where: {
        mainCategoryId: product.mainCategoryId,
        id: { not: product.id },
        available: true,
      },
      orderBy: { numberOfRatings: "desc" },
      take: 8,
      include: { mainCategory: true, subCategory: true },
    });

    const toProductItem = (p: typeof product) => ({
      id: String(p.id),
      name: p.name,
      brand: "",
      category: p.mainCategory.mainCategory,
      subcategory: p.subCategory.subCategory,
      price: p.discountPrice,
      listPrice: p.actualPrice,
      image: p.imageUrl,
      rating: p.ratings,
      reviews: p.numberOfRatings,
      sold: 0,
      stock: p.quantity,
      freeShip: false,
      description: "",
      highlights: [] as string[],
    });

    const mainCat = product.mainCategory;

    res.status(200).json({
      product: toProductItem(product),
      related: relatedRaw.map((p) => toProductItem(p as typeof product)),
      mainCategory: {
        slug: mainCat.mainCategory,
        name: mainCat.mainCategory,
        icon: "",
        sub: mainCat.subCategories.map((sc) => ({
          slug: sc.subCategory,
          name: sc.subCategory,
        })),
      },
      subcategory: {
        slug: product.subCategory.subCategory,
        name: product.subCategory.subCategory,
      },
    });
  } catch (error) {
    next(error);
  }
}
