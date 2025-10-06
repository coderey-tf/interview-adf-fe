// lib/models/product.ts
import { z } from "zod";

export type NewProduct = {
    sku: string
    name: string
    stock: number
}
export type Product = {
    id: number; sku: string; name: string; stock: number;
    created_at: string; updated_at: string;
};

export const ProductCreateSchema = z.object({
    sku: z.string().min(1, "SKU wajib diisi"),
    name: z.string().min(1, "Nama wajib diisi"),
    stock: z.number().int().nonnegative("Stock minimal 0")
});
export const StockMoveSchema = z.object({
    product_id: z.number().int().positive(),
    qty: z.number().int().positive("Qty harus > 0")
});
