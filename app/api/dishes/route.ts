import { validateUser } from "@/auth-guard";
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

    if (
      !body.name ||
      !body.price ||
      !body.servings ||
      !body.servings_left ||
      !body.category_id ||
      body.is_available === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { data, error: dishError } = await supabaseAdmin
      .from("dishes")
      .insert({
        name: body.name,
        price: body.price,
        servings: body.servings,
        servings_left: body.servings_left,
        image: body.image,
        category_id: body.category_id,
        is_available: body.is_available,
      })
      .select()
      .single();

    if (dishError) {
      console.log(dishError.message);
      return NextResponse.json({ error: dishError.message }, { status: 400 });
    }

    for (const ing of body.ingredients ?? []) {
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
