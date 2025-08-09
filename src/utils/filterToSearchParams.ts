// tabletop-games-shop-fe/src/utils/filterToSearchParams.ts

import { FiltersProps } from "@/app/catalogue/ui/sections/Filters/Filters";


type CatalogueFiltersState = FiltersProps['initialFilters'] & {
  sort?: string;
  searchQuery?: string;
};

export const filtersToSearchParams = (filters: CatalogueFiltersState): URLSearchParams => {
  const params = new URLSearchParams();

  // Price filters: minPrice and maxPrice from UI determine price.between
  const minPrice = filters.minPrice !== undefined ? filters.minPrice : 0;
  const maxPrice = filters.maxPrice !== undefined ? filters.maxPrice : 20000;
  // Keep minPrice and maxPrice as separate URL params for consistency with UI parsing in page.tsx
  if (minPrice !== 0) { // Only append if not default min
    params.append('minPrice', String(minPrice));
  }
  if (maxPrice !== 20000) { // Only append if not default max
    params.append('maxPrice', String(maxPrice));
  }

  // Sort and Search Query
  if (filters.sort && filters.sort !== "id,asc") params.append('sort', filters.sort);
  if (filters.searchQuery) params.append('searchQuery', filters.searchQuery);

  // Helper to append array values (multiple params with same key for the frontend)
  const appendArrayValues = (key: string, values: string[] | undefined) => {
    values?.forEach(value => {
      if (value !== '' && value !== null && value !== undefined) {
        params.append(key, String(value));
      }
    });
  };

  // Helper to append single values that are stored as string[] in frontend
  const appendSingleValue = (key: string, values: (string | number)[] | undefined) => {
    if (values && values.length > 0 && values[0] !== undefined && values[0] !== null && String(values[0]) !== '') {
      params.append(key, String(values[0]));
    }
  };

  // Append new specific filter parameters using their frontend names
  appendSingleValue('nameContains', filters.nameContains);
  appendSingleValue('language', filters.language);
  appendSingleValue('minPlayerNumberRange', filters.minPlayerNumberRange);
  appendSingleValue('maxPlayerNumberRange', filters.maxPlayerNumberRange);
  appendSingleValue('minPlayTimeRange', filters.minPlayTimeRange);
  appendSingleValue('maxPlayTimeRange', filters.maxPlayTimeRange);
  appendSingleValue('minAgeRange', filters.minAgeRange);
  appendSingleValue('publisherContains', filters.publisherContains);
  appendSingleValue('authorContains', filters.authorContains);
  appendSingleValue('bggRatingRange', filters.bggRatingRange);
  appendSingleValue('complexityRange', filters.complexityRange);
  appendSingleValue('componentsContains', filters.componentsContains);
  appendSingleValue('rulesLinkContains', filters.rulesLinkContains);
  appendSingleValue('averageRatingRange', filters.averageRatingRange);
  appendSingleValue('reviewCountRange', filters.reviewCountRange);
  appendSingleValue('createdAtAfter', filters.createdAtAfter);

  // For dimensions, we will append both values if present, or just one
  appendSingleValue('dimensionWidthRange', filters.dimensionWidthRange);
  appendSingleValue('dimensionLengthRange', filters.dimensionLengthRange);
  appendSingleValue('dimensionHeightRange', filters.dimensionHeightRange);
  appendSingleValue('dimensionWeightRange', filters.dimensionWeightRange);


  // These are multi-select on the frontend and should be appended multiple times for URL
  appendArrayValues('categoryNames', filters.categoryNames);
  appendArrayValues('genreNames', filters.genreNames);
  appendArrayValues('productTypeNames', filters.productTypeNames);
  appendArrayValues('mechanics', filters.mechanics);


  return params;
};
