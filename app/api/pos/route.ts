import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { OrderItem } from "@/types/OrderItem";
import { validateUser } from "@/auth-guard";
import { orderInputSchema } from "@/lib/schemas/order";

export async function POST(req: NextRequest) {
  try {
    const { error, userId } = await validateUser(["org:admin", "org:staff"]);

    if (error) {
      return error;
    }

    const body = await req.json();

    // 1. Validate incoming payload using Zod (lightweight input schema)
    const result = orderInputSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    const validBody = result.data;
    const dishIDs = validBody.items.map((item) => item.item.id);

    const { data: dishes, error: dishesError } = await supabaseAdmin
      .from("dishes")
      .select("id, name, price, servings_left")
      .in("id", dishIDs);

    if (!dishes || dishesError) {
      return NextResponse.json(
        { error: "Failed to load dishes" },
        { status: 500 },
      );
    }

    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const i of validBody.items) {
      const dish = dishes.find((d) => d.id === i.item.id);

      if (!dish) {
        return NextResponse.json(
          { error: `Dish ${i.item.name ?? "Unknown"} not found.` },
          { status: 404 },
        );
      }

      if (dish.servings_left < i.quantity) {
        return NextResponse.json(
          {
            error: `Not enough stock for ${dish.name}. Only ${dish.servings_left} left.`,
          },
          { status: 400 },
        );
      }

      orderItems.push({
        dish_id: dish.id,
        name: dish.name,
        price: dish.price,
        quantity: i.quantity,
      });

      total += dish.price * i.quantity;
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        cashier_id: userId,
        total,
        status: validBody.source === "pos" ? "completed" : "pending",
      })
      .select()
      .single();

    if (!order || orderError) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 },
      );
    }

    const itemsToInsert = orderItems.map((item) => ({
      order_id: order.id,
      dish_id: item.dish_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(itemsToInsert);

    if (itemsError) {
      return NextResponse.json(
        { error: "Failed to save order details" },
        { status: 500 },
      );
    }

    const stockUpdates = orderItems.map((item) => {
      const dish = dishes.find((d) => d.id === item.dish_id);
      return supabaseAdmin
        .from("dishes")
        .update({ servings_left: dish!.servings_left - item.quantity })
        .eq("id", item.dish_id);
    });

    await Promise.all(stockUpdates);

    const { data: recipes, error: recipeError } = await supabaseAdmin
      .from("dish_ingredients")
      .select("dish_id, ingredient_id, quantity")
      .in("dish_id", dishIDs);

    if (recipeError) {
      return NextResponse.json(
        { error: "Failed to load recipes" },
        { status: 500 },
      );
    }

    const ingredientIDs = [
      ...new Set((recipes ?? []).map((r) => r.ingredient_id)),
    ];

    if (ingredientIDs.length > 0) {
      const { data: ingredients, error: ingredientsError } = await supabaseAdmin
        .from("ingredients")
        .select("id, stock")
        .in("id", ingredientIDs);

      if (ingredientsError) {
        return NextResponse.json(
          { error: "Failed to load ingredients" },
          { status: 500 },
        );
      }

      const consumption: Record<string, number> = {};

      for (const item of orderItems) {
        const dishRecipe = (recipes ?? []).filter(
          (r) => r.dish_id === item.dish_id,
        );

        for (const recipeRow of dishRecipe) {
          const consumed = recipeRow.quantity * item.quantity;
          consumption[recipeRow.ingredient_id] =
            (consumption[recipeRow.ingredient_id] ?? 0) + consumed;
        }
      }

      const ingredientUpdates = Object.entries(consumption).map(
        ([ingredientId, consumedAmount]) => {
          const ingredient = (ingredients ?? []).find(
            (i) => i.id === ingredientId,
          );
          const newStock = Math.max(
            0,
            (ingredient?.stock ?? 0) - consumedAmount,
          );

          return supabaseAdmin
            .from("ingredients")
            .update({ stock: newStock })
            .eq("id", ingredientId);
        },
      );

      await Promise.all(ingredientUpdates);
    }

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
