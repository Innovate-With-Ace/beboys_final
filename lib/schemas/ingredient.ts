import { z } from "zod";

export const ingredientSchema = z.object({
  name: z
    .string()
    .min(1, "Name of ingredient is required")
    .max(50, "Ingredient name is too long"),
  unit: z.enum(["kg", "l", "pcs"]),
  stock: z.number().nonnegative("Stock cannot be negative"),
  low_stock_threshold: z.number().nonnegative("Threshold cannot be negative"),
});
