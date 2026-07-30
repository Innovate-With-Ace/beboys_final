import { useQuery } from "@tanstack/react-query";
import { Dish } from "@/types/Dish";
import fetchApi from "@/lib/api";

export function useDishes() {
  return useQuery({
    queryKey: ["dishes"],
    queryFn: () => fetchApi<Dish[]>("/api/dishes", { method: "GET" }),
  });
}
