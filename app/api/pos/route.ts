import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { Dish } from "@/types/Dish";
import { OrderItem } from "@/types/OrderItem";

type Payload = {
  items: { item: Dish; quantity: number }[];
  source: "pos" | "mobile";
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: Payload = await req.json();
  const dishIDs = body.items.map((item) => item.item.id);

  // 1. Fetch current dishes to verify prices and stock
  const { data: dishes, error: dishesError } = await supabaseAdmin
    .from("dishes")
    .select("id, name, price, servings_left")
    .in("id", dishIDs);

  if (!dishes || dishesError) {
    console.log("Error fetching dishes:", dishesError?.message);
    return NextResponse.json(
      { error: "Failed to load dishes" },
      { status: 500 },
    );
  }

  // 2. Map payload to order items and calculate total
  const orderItems: OrderItem[] = [];
  let total = 0;

  for (const i of body.items) {
    const dish = dishes.find((d) => d.id === i.item.id);

    // Validate dish exists
    if (!dish) {
      return NextResponse.json(
        { error: `Dish ${i.item.name} not found.` },
        { status: 404 },
      );
    }

    // Validate sufficient stock
    if (dish.servings_left < i.quantity) {
      return NextResponse.json(
        {
          error: `Not enough stock for ${dish.name}. Only ${dish.servings_left} left.`,
        },
        { status: 400 },
      );
    }

    // Build the order item
    orderItems.push({
      dish_id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: i.quantity,
    });

    total += dish.price * i.quantity;
  }

  // 3. Create the parent order
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      cashier_id: userId,
      total,
      status: body.source === "pos" ? "completed" : "pending",
    })
    .select()
    .single();

  if (!order || orderError) {
    console.log("Error creating order:", orderError?.message);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }

  // 4. Save the order items linked to the new order
  const itemsToInsert = orderItems.map((item) => ({
    order_id: order.id,
    dish_id: item.dish_id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabaseAdmin
    .from("order_items") // <-- Assumes you have an order_items table!
    .insert(itemsToInsert);

  if (itemsError) {
    console.log("Error inserting order items:", itemsError.message);
    return NextResponse.json(
      { error: "Failed to save order details" },
      { status: 500 },
    );
  }

  // 5. Deduct the inventory/servings_left concurrently
  const stockUpdates = orderItems.map((item) => {
    const dish = dishes.find((d) => d.id === item.dish_id);
    return supabaseAdmin
      .from("dishes")
      .update({ servings_left: dish!.servings_left - item.quantity })
      .eq("id", item.dish_id);
  });

  await Promise.all(stockUpdates);

  // 6. Return success!
  return NextResponse.json(order, { status: 201 });
}
