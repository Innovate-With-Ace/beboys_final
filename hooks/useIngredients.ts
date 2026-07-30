import { useQuery } from "@tanstack/react-query";
import fetchApi from "@/lib/api";
import { Ingredient } from "@/types/Ingredients";

export function useIngredients() {
  return useQuery({
    queryKey: ["ingredients"],
    queryFn: () =>
      fetchApi<Ingredient[]>("/api/ingredients", { method: "GET" }),
  });
}
