import { z } from "zod";

const recipeRowSchema = z.object({
  ingredient_id: z.string(),
  quantity: z.number().nonnegative("Ingredient Quantity must not be negative"),
});

export const dishSchema = z.object({
  name: z
    .string()
    .min(1, "dish name field is required")
    .max(50, "Dish name is too long"),
  price: z.number().nonnegative("price cannot be negative"),
  servings: z.number().nonnegative("servings cannot be negative"), // Fixed error message typo too!
  servings_left: z.number().nonnegative("servings left cannot be negative"),
  category_id: z.string(),
  ingredients: z.array(recipeRowSchema).optional().default([]),
  is_available: z.boolean(),
});
