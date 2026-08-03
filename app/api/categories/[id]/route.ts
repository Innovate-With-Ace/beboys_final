// app/api/categories/[id]/route.ts
import { validateUser } from "@/auth-guard";
import { supabaseAdmin } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { categorySchema } from "@/lib/schemas/category"; // Adjust path as needed

// Create a partial schema for PATCH requests
const patchCategorySchema = categorySchema.partial();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { error } = await validateUser(["org:admin"]);
    if (error) return error;

    const body = await req.json();
    const { id } = await params;

    // Validate incoming body with Zod
    const result = patchCategorySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    const { data, error: categoriesError } = await supabaseAdmin
      .from("categories")
      .update(result.data)
      .eq("id", id)
      .select()
      .single();

    if (categoriesError) {
      return NextResponse.json(
        { error: categoriesError.message },
        { status: 400 },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { error } = await validateUser(["org:admin"]);
    if (error) return error;

    const { id } = await params;

    const { error: categoriesError } = await supabaseAdmin
      .from("categories")
      .delete()
      .eq("id", id);

    if (categoriesError) {
      console.log(categoriesError);
      return NextResponse.json(
        { error: categoriesError.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
