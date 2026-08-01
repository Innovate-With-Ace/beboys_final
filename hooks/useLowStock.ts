import { useQuery } from "@tanstack/react-query";
import fetchApi from "@/lib/api";
import { Ingredient } from "@/types/Ingredients";

export function useLowStock() {
  return useQuery({
    queryKey: ["low-stock"],
    queryFn: async () => {
      const response = await fetchApi<Ingredient[]>(
        "/api/dashboard/low-stock",
        {
          method: "GET",
        },
      );
      return response;
    },
  });
}
