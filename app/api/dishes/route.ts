import { validateUser } from "@/auth-guard";
import { dishSchema } from "@/lib/schemas/dish";
import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { error } = await validateUser(["org:admin"]);

    if (error) {
      return error;
    }

    const body = await req.json();
    const result = dishSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    // Separate ingredients from dish details
    const { ingredients, ...dishData } = result.data;

    // Insert the dish + its dish_ingredients links, and deduct raw
    // ingredient stock for this batch — atomically. Ingredient stock is
    // consumed here (when the batch is cooked), not at sale time; sale
    // only decrements dishes.servings_left (see app/api/pos/route.ts).
    const { data, error: rpcError } = await supabaseAdmin.rpc(
      "create_dish_with_ingredients",
      {
        p_name: dishData.name,
        p_price: dishData.price,
        p_servings: dishData.servings,
        p_servings_left: dishData.servings_left,
        p_category_id: dishData.category_id,
        p_is_available: dishData.is_available,
        p_ingredients: ingredients ?? [],
      },
    );

    if (rpcError) {
      console.error(rpcError.message);
      return NextResponse.json({ error: rpcError.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { error } = await validateUser(["org:admin", "org:staff"]);

    if (error) {
      return error;
    }
    const { data, error: disheError } = await supabaseAdmin
      .from("dishes")
      .select("*, ingredients:dish_ingredients(ingredient_id, quantity)")
      .order("name", { ascending: false });

    if (disheError) {
      return NextResponse.json({ error: disheError.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
