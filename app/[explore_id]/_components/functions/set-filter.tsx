import { useSearchParams, useRouter, usePathname } from "next/navigation";

import type { MarketFilter } from "@/sdk/queries";

export const setFilter = ({ id, value }: MarketFilter) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams.toString());

  const rawFilters = searchParams.get("filters") || "";

  let filters = rawFilters
    .split(",")
    .filter((filter) => filter.includes(":"))
    .map((filter) => {
      const [id, value] = filter.split(":");
      return { id, value };
    });

  let filterExists = false;

  for (let i = 0; i < filters.length; i++) {
    if (filters[i].id === id && filters[i].value === value.toString()) {
      filterExists = true;
      filters.splice(i, 1);
    }
  }

  if (filterExists === false) {
    filters.push({ id, value: value.toString() });
  }

  if (filters.length === 0) {
    params.delete("filters");
    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  } else {
    params.set(
      "filters",
      filters.map((filter) => `${filter.id}:${filter.value}`).join(",")
    );
    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }
};
