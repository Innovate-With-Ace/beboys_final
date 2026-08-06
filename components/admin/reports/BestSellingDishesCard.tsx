import { Utensils } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";

interface BestSellingDish {
  dish_id: string | null;
  name: string;
  total_sold: number;
  total_revenue: number;
}

export async function BestSellingDishesCard() {
  // Query Supabase and filter by date range if your view supports it
  // CORRECT: Querying a table or a view directly
  const { data, error } = await supabaseAdmin
    .from("best_selling_dishes")
    .select("*")
    .limit(5);

  if (error) {
    console.error("Error fetching best selling dishes:", error.message);
  }

  const dishes: BestSellingDish[] = data || [];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs text-card-foreground flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold tracking-tight">
              Best-Selling Dishes
            </h3>
            <p className="text-xs text-muted-foreground">
              Top items ranked by total quantity sold
            </p>
          </div>
          <div className="p-2 rounded-lg bg-muted/40 text-muted-foreground">
            <Utensils className="h-4 w-4" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground">
                <th className="py-2.5 font-semibold">Dish Name</th>
                <th className="py-2.5 font-semibold text-right">Sold</th>
                <th className="py-2.5 font-semibold text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {dishes.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-4 text-center text-muted-foreground"
                  >
                    No data available for this period.
                  </td>
                </tr>
              ) : (
                dishes.map((dish, i) => (
                  <tr key={dish.dish_id || i} className="hover:bg-muted/20">
                    <td className="py-2.5 font-medium text-foreground">
                      {dish.name}
                    </td>
                    <td className="py-2.5 text-right text-muted-foreground">
                      {dish.total_sold}
                    </td>
                    <td className="py-2.5 text-right font-semibold text-foreground">
                      ₱
                      {Number(dish.total_revenue).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
