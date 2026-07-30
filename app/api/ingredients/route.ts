import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  // Validation sooner

  const { data, error } = await supabaseAdmin
    .from('ingredients')
    .select("*")
    .order('name', { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Error on fetching ingredients" }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req : NextRequest) {
    const body = await req.json();
    const {error, data} = await supabaseAdmin.from('ingredients').insert(body).select().single();

    if(error){
        return NextResponse.json({error : "Error on inserting ingredients"}, {status : 500});
    }

    return NextResponse.json(data);
}