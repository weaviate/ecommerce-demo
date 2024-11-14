import { Facet, FacetValue } from "../types/searchResponse";

export const useFacetHandlers = (
  onLoad: boolean,
  onSelectFilter: (filter: Facet, search: boolean) => void,
) => {
  const handleSelectFilter = (
    facet: Facet,
    valueName?: string,
    gte?: number,
    lte?: number,
  ) => {
    if (onLoad) return;

    let search = false;

    if (facet.type === "COLLECTION") {
      facet.values = (facet.values as FacetValue[]).map((value) => ({
        ...value,
        status: value.name === valueName ? "CLICKED" : "CLICKABLE",
      }));
    } else if (
      facet.type === "SINGLE" ||
      facet.type === "MULTI" ||
      facet.type === "CATEGORY"
    ) {
      facet.values = (facet.values as FacetValue[]).map((value) => ({
        ...value,
        status:
          value.name === valueName
            ? value.status === "CLICKED"
              ? "CLICKABLE"
              : "CLICKED"
            : facet.type === "SINGLE"
              ? "CLICKABLE"
              : value.status,
      }));
    } else if (
      facet.type === "RANGE" &&
      gte !== undefined &&
      lte !== undefined
    ) {
      facet.selected_lower = gte;
      facet.selected_upper = lte;
    }

    onSelectFilter(facet, search);
  };

  return { handleSelectFilter };
};
