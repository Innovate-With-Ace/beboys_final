-- This eatery cooks in batches: raw ingredient stock is consumed when a
-- dish (a cooked batch) is CREATED, not per sale — the food is already
-- cooked by the time it's sold. servings_left tracks how many portions of
-- that cooked batch remain and DOES decrement per sale, since that's a
-- different thing (remaining portions, not raw ingredient inventory).
--
-- What this migration actually fixes is issue #1 from the review: no
-- transactional integrity on multi-step writes. Dish creation was
-- insert dish -> insert dish_ingredients -> update ingredient stock as
-- separate sequential awaits with no rollback; order creation had the
-- same shape. Both are now single Postgres functions called via
-- supabase.rpc(), so either everything commits or nothing does.

-- 1. Create a dish (a cooked batch): inserts the dish, links its
--    dish_ingredients, and deducts ingredient stock by recipe quantity —
--    all in one transaction. This is where raw ingredient stock moves.
create or replace function public.create_dish_with_ingredients(
  p_name text,
  p_price numeric,
  p_servings numeric,
  p_servings_left numeric,
  p_category_id uuid,
  p_is_available boolean,
  p_ingredients jsonb -- [{ "ingredient_id": "...", "quantity": 1.5 }, ...]
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_dish_id uuid;
  v_ing jsonb;
  v_ingredient_id uuid;
  v_quantity numeric;
  v_current_stock numeric;
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
    select stock into v_current_stock
    from public.ingredients
    where id = v_ingredient_id
    for update;

    if not found then
      raise exception 'Ingredient % not found', v_ingredient_id;
    end if;

    update public.ingredients
    set stock = greatest(0, v_current_stock - v_quantity)
    where id = v_ingredient_id;
  end loop;

  return (select to_jsonb(d) from public.dishes d where d.id = v_dish_id);
end;
$$;

-- 2. Create a POS/mobile order: validates servings_left, inserts the
--    order + order_items, and decrements dishes.servings_left (portions
--    of the already-cooked batch remaining) — NOT ingredient stock, which
--    was already deducted when the dish was created. Dish rows are
--    locked (FOR UPDATE) so two concurrent sales can't oversell the same
--    batch.
create or replace function public.create_pos_order(
  p_cashier_id text,
  p_source text,
  p_items jsonb -- [{ "dish_id": "...", "quantity": 2 }, ...]
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_order_id uuid;
  v_total numeric := 0;
  v_status text := case when p_source = 'pos' then 'completed' else 'pending' end;
  v_item jsonb;
  v_dish record;
  v_qty int;
begin
  if jsonb_array_length(p_items) = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  -- Pass 1: lock the dish rows and validate remaining portions + total.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::int;

    select id, name, price, servings_left into v_dish
    from public.dishes
    where id = (v_item->>'dish_id')::uuid
    for update;

    if not found then
      raise exception 'Dish % not found', (v_item->>'dish_id');
    end if;

    if v_dish.servings_left < v_qty then
      raise exception 'Not enough stock for %. Only % left.', v_dish.name, v_dish.servings_left;
    end if;

    v_total := v_total + v_dish.price * v_qty;
  end loop;

  insert into public.orders (cashier_id, total, status)
  values (p_cashier_id, v_total, v_status)
  returning id into v_order_id;

  -- Pass 2: write order_items and decrement remaining portions.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::int;

    select id, name, price into v_dish
    from public.dishes
    where id = (v_item->>'dish_id')::uuid;

    insert into public.order_items (order_id, dish_id, name, price, quantity)
    values (v_order_id, v_dish.id, v_dish.name, v_dish.price, v_qty);

    update public.dishes
    set servings_left = greatest(0, servings_left - v_qty)
    where id = v_dish.id;
  end loop;

  return jsonb_build_object('id', v_order_id, 'total', v_total, 'status', v_status);
end;
$$;

grant execute on function public.create_dish_with_ingredients(text, numeric, numeric, numeric, uuid, boolean, jsonb) to service_role;
grant execute on function public.create_pos_order(text, text, jsonb) to service_role;
