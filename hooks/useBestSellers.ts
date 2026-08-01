import { useQuery } from "@tanstack/react-query";
import { Order } from "@/types/Order";
import fetchApi from "@/lib/api";

type BestSeller = {
  dish_id: string;
  name: string;
  total_sold: number;
  total_revenue: number;
};

export function useBestSellers() {
  return useQuery({
    queryKey: ["best-sellers"],
    queryFn: async () => {
      const response = await fetchApi<BestSeller[]>(
        "/api/dashboard/best-sellers",
        {
          method: "GET",
        },
      );
      return response;
    },
  });
}
