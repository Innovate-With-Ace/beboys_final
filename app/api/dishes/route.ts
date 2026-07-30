import { supabaseAdmin } from "@/lib/supabase/server";
import { Dish } from "@/types/Dish";
import { NextResponse, NextRequest } from "next/server";



export async function POST(req : NextRequest){
    const body : Dish = await req.json();

    const {data, error} = await supabaseAdmin.from('dishes').insert({
        name : body.name,
        price : body.price,
        servings : body.servings,
        servings_left : body.servings_left,
        image : body.image,
        category_id : body.category_id,
        is_available : body.is_available
    }).select().maybeSingle();

    if(error){
        console.log(error);
        return NextResponse.json({error : error.message}, {status : 500 });
    }

    return NextResponse.json({success : true});
}


export async function GET(){
    const {data, error} = await supabaseAdmin.from('dishes').select('*').order('name', {ascending : false});

    if(error){
        return NextResponse.json({error : error.message}, {status : 500});
    }

    return NextResponse.json(data);
}