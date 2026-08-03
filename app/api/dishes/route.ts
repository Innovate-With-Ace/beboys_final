import { validateUser } from "@/auth-guard";
import { dishSchema } from "@/lib/schemas/dish";
import { supabaseAdmin } from "@/lib/supabase/server";
import { Dish } from "@/types/Dish";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { error } = await validateUser(["org:admin"]);

    if (error) {
      return error;
    }
    const body: Dish = await req.json();

    const result = dishSchema.safeParse(body);

    if (!result.success) {
      console.log(result.error.issues[0].message);
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    // Separate ingredients from dish details
    const { ingredients, ...dishData } = result.data;

    // 1. Insert the dish (Spread dishData properly instead of wrapping it)
    const { data, error: dishError } = await supabaseAdmin
      .from("dishes")
      .insert({ ...dishData, image: null })
      .select()
      .single();

    if (dishError) {
      console.log(dishError.message);
      return NextResponse.json({ error: dishError.message }, { status: 400 });
    }

    // 2. Loop through the validated ingredients and insert/upsert them
    for (const ing of ingredients ?? []) {
      const { error: ingError } = await supabaseAdmin
        .from("dish_ingredients")
        .upsert({
          dish_id: data.id,
          ingredient_id: ing.ingredient_id,
          quantity: ing.quantity,
        });

      if (ingError) {
        console.log(ingError.message);
        return NextResponse.json({ error: ingError.message }, { status: 400 });
      }
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
