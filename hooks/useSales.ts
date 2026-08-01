import { useQuery } from "@tanstack/react-query";
import fetchApi from "@/lib/api";

type SalesData = {
  day: string;
  total_sales: number;
  order_count: number;
};

export function useSales() {
  return useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const response = await fetchApi<SalesData[]>(
        "/api/dashboard/sales-charts",
        {
          method: "GET",
        },
      );
      return response;
    },
  });
}
