-- Audit trail for every change to ingredients.stock. Until now a stock
-- edit (manual correction on the Inventory page, or the automatic
-- deduction at dish/batch creation) just overwrote the number with no
-- history — no way to see who changed what, when, or why.
--
-- ingredient_name is denormalized (kept even if the ingredient is later
-- deleted) so the audit trail stays readable historically.

create table if not exists public.stock_adjustments (
  id uuid primary key default gen_random_uuid(),
  ingredient_id uuid references public.ingredients(id) on delete set null,
  ingredient_name text not null,
  change numeric not null,
  previous_stock numeric not null,
  new_stock numeric not null,
  reason text not null,
  note text,
  changed_by text,
  created_at timestamptz not null default now()
);

create index if not exists stock_adjustments_ingredient_id_idx
  on public.stock_adjustments (ingredient_id);
create index if not exists stock_adjustments_created_at_idx
  on public.stock_adjustments (created_at desc);

grant select, insert on public.stock_adjustments to service_role;

-- Recreate create_dish_with_ingredients to also log a
-- 'dish_batch_deduction' row per ingredient consumed, so the automatic
-- deduction at batch-cook time shows up in the same audit trail as
-- manual corrections.
--
-- The new p_changed_by param changes the function's arity, so
-- `create or replace` would leave the old 7-arg overload dangling
-- instead of replacing it — drop it explicitly first.
drop function if exists public.create_dish_with_ingredients(text, numeric, numeric, numeric, uuid, boolean, jsonb);

create or replace function public.create_dish_with_ingredients(
  p_name text,
  p_price numeric,
  p_servings numeric,
  p_servings_left numeric,
  p_category_id uuid,
  p_is_available boolean,
  p_ingredients jsonb, -- [{ "ingredient_id": "...", "quantity": 1.5 }, ...]
  p_changed_by text default null
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_dish_id uuid;
  v_ing jsonb;
  v_ingredient_id uuid;
  v_ingredient_name text;
  v_quantity numeric;
  v_current_stock numeric;
  v_new_stock numeric;
begin
  insert into public.dishes (name, price, servings, servings_left, category_id, is_available, image)
  values (p_name, p_price, p_servings, p_servings_left, p_category_id, p_is_available, null)
  returning id into v_dish_id;

  for v_ing in select * from jsonb_array_elements(p_ingredients)
  loop
    v_ingredient_id := (v_ing->>'ingredient_id')::uuid;
    v_quantity := (v_ing->>'quantity')::numeric;

    insert into public.dish_ingredients (dish_id, ingredient_id, quantity)
    values (v_dish_id, v_ingredient_id, v_quantity);

    -- Lock the ingredient row and deduct stock for this batch.
    select name, stock into v_ingredient_name, v_current_stock
    from public.ingredients
    where id = v_ingredient_id
    for update;

    if not found then
      raise exception 'Ingredient % not found', v_ingredient_id;
    end if;

    v_new_stock := greatest(0, v_current_stock - v_quantity);

    update public.ingredients
    set stock = v_new_stock
    where id = v_ingredient_id;

    insert into public.stock_adjustments
      (ingredient_id, ingredient_name, change, previous_stock, new_stock, reason, note, changed_by)
    values
      (v_ingredient_id, v_ingredient_name, v_new_stock - v_current_stock, v_current_stock, v_new_stock,
       'dish_batch_deduction', 'Batch cooked: ' || p_name, p_changed_by);
  end loop;

  return (select to_jsonb(d) from public.dishes d where d.id = v_dish_id);
end;
$$;

grant execute on function public.create_dish_with_ingredients(text, numeric, numeric, numeric, uuid, boolean, jsonb, text) to service_role;
