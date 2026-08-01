import { useQuery } from "@tanstack/react-query";
import { Order } from "@/types/Order";
import fetchApi from "@/lib/api";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetchApi<Order[]>("/api/orders", {
        method: "GET",
      });
      return response;
    },
    staleTime: 1000 * 60,
  });
}
