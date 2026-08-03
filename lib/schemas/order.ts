import { z } from "zod";

const recipeRowSchema = z.object({
  quantity: z.number().nonnegative("Quantity must not be negative"),
  ingredient_id: z.string(),
});

const dishItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  servings: z.number().nonnegative(),
  servings_left: z.number().nonnegative(),
  image: z.string().nullable(),
  category_id: z.string(),
  is_available: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  ingredients: z.array(recipeRowSchema),
});

const orderItemSchema = z.object({
  item: dishItemSchema,
  quantity: z.number().int().positive("Item quantity must be at least 1"),
});

// Full schema (e.g., when returning from the database with full dish objects)
export const orderSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, "Order must contain at least one item"),
  source: z.enum(["pos", "mobile"]),
});

// Input schema for client-submitted orders (expects item to have id and name)
export const orderInputSchema = z.object({
  items: z
    .array(
      z.object({
        item: z.object({
          id: z.string(),
          name: z.string().optional(),
        }),
        quantity: z.number().int().positive("Item quantity must be at least 1"),
      }),
    )
    .min(1, "Order must contain at least one item"),
  source: z.enum(["pos", "mobile"]),
});
