import { useQuery } from "@tanstack/react-query";
import { Categories } from "@/types/Categories";
import fetchApi from "@/lib/api";

export function useCategories() {
  return useQuery({
    queryKey: ["dishes"],
    queryFn: () => fetchApi<Categories[]>("/api/dishes", { method: "GET" }),
  });
}
