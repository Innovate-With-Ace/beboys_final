import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const body = await req.json();
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("dishes")
    .update({
      name: body.name,
      price: body.price,
      servings: body.servings,
      servings_left: body.servings_left,
      image: body.image,
      category_id: body.category_id,
      is_available: body.is_available,
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req : NextRequest, {params} : {params : Promise<{id : string}>}) {
    const {id} = await params;


    const {error} = await supabaseAdmin.from('dishes').delete().eq('id', id);

    if(error){
        console.log(error);
        return NextResponse.json({error : error.message}, {status : 500});
    }

    return NextResponse.json({success : true});
}
