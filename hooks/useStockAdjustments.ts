import { useQuery } from "@tanstack/react-query";
import fetchApi from "@/lib/api";
import { StockAdjustment } from "@/types/Ingredients";

export function useStockAdjustments(ingredientId?: string) {
  return useQuery({
    queryKey: ["stock-adjustments", ingredientId ?? "all"],
    queryFn: () =>
      fetchApi<StockAdjustment[]>(
        `/api/stock-adjustments${
          ingredientId
            ? `?ingredient_id=${encodeURIComponent(ingredientId)}`
            : ""
        }`,
        { method: "GET" },
      ),
  });
}
