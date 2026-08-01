import fetchApi from "@/lib/api";
import { Order } from "@/types/Order";
import { useQuery } from "@tanstack/react-query";

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await fetchApi<Order[]>("/api/dashboard/stats", {
        method: "GET",
      });
      return response;
    },
    staleTime: 1000 * 60,
  });
}
