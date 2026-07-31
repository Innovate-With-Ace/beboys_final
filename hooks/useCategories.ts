import { useQuery } from "@tanstack/react-query";
import { Categories } from "@/types/Categories";
import fetchApi from "@/lib/api";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchApi<Categories[]>("/api/categories", { method: "GET" }),
  });
}
