// tabletop-games-shop-fe/src/utils/filterMappers.ts

import { ProductFilters } from '@/app/actions/products'; // Import the backend filter type
import { FiltersProps } from '@/app/catalogue/ui/sections/Filters/Filters'; // Import the frontend filter type

type FrontendFilters = FiltersProps['initialFilters'];

export const mapFiltersToApi = (frontendFilters: FrontendFilters): ProductFilters => {
  const apiFilters: ProductFilters = {};

  // Price filter: map minPrice to price.gte and maxPrice to price.lte
  if (frontendFilters.minPrice !== undefined && frontendFilters.minPrice !== 0) {
    apiFilters['price.gte'] = frontendFilters.minPrice;
  }
  if (frontendFilters.maxPrice !== undefined && frontendFilters.maxPrice !== 20000) { // Assuming 20000 is default max
    apiFilters['price.lte'] = frontendFilters.maxPrice;
  }

  // Helper for converting string[] to a single string (taking the first element if available)
  const mapSingleString = (arr: string[] | undefined): string | undefined => {
    return arr && arr.length > 0 ? arr[0] : undefined;
  };

  // Helper for converting string[] to a single number (taking the first element if available and converting)
  const mapSingleNumber = (arr: string[] | undefined): number | undefined => {
    return arr && arr.length > 0 && !isNaN(Number(arr[0])) ? Number(arr[0]) : undefined;
  };

  // Helper for converting string[] to a comma-separated string (for 'in' filters)
  const mapCommaSeparated = (arr: string[] | undefined): string | undefined => {
    return arr && arr.length > 0 ? arr.join(',') : undefined;
  };

  // Helper for converting string[] to a between range (taking first two elements)
  const mapBetweenRange = (arr: string[] | undefined): string | undefined => {
    if (arr && arr.length >= 2) {
      const val1 = Number(arr[0]);
      const val2 = Number(arr[1]);
      if (!isNaN(val1) && !isNaN(val2)) {
        return `${Math.min(val1, val2)},${Math.max(val1, val2)}`;
      }
    } else if (arr && arr.length === 1 && !isNaN(Number(arr[0]))) {
        // If only one value, treat as exact for between fields
        return `${Number(arr[0])},${Number(arr[0])}`;
    }
    return undefined;
  };


  // Map string[] filters to API string parameters
  apiFilters['name.contains'] = mapSingleString(frontendFilters.nameContains);
  apiFilters['language.eq'] = mapSingleString(frontendFilters.language); // Assuming single language selection

  apiFilters['publisher.contains'] = mapSingleString(frontendFilters.publisherContains);
  apiFilters['author.contains'] = mapSingleString(frontendFilters.authorContains);
  apiFilters['components.contains'] = mapSingleString(frontendFilters.componentsContains);
  apiFilters['rulesLink.contains'] = mapSingleString(frontendFilters.rulesLinkContains);
  apiFilters['createdAt.gte'] = mapSingleString(frontendFilters.createdAtAfter); // Assuming a single date string

  // Map string[] to numerical range (gte/lte)
  apiFilters['minPlayerNumber.gte'] = mapSingleNumber(frontendFilters.minPlayerNumberRange);
  apiFilters['maxPlayerNumber.lte'] = mapSingleNumber(frontendFilters.maxPlayerNumberRange);
  apiFilters['minPlayTime.gte'] = mapSingleNumber(frontendFilters.minPlayTimeRange);
  apiFilters['maxPlayTime.lte'] = mapSingleNumber(frontendFilters.maxPlayTimeRange);
  apiFilters['minAge.gte'] = mapSingleNumber(frontendFilters.minAgeRange);
  apiFilters['reviewCount.gte'] = mapSingleNumber(frontendFilters.reviewCountRange); // Assuming gte for reviewCount

  // For dimensions, we will map to gte/lte if values are present.
  apiFilters['dimension.width.gte'] = mapSingleNumber(frontendFilters.dimensionWidthRange.slice(0,1));
  apiFilters['dimension.width.lte'] = mapSingleNumber(frontendFilters.dimensionWidthRange.slice(1,2));
  apiFilters['dimension.length.gte'] = mapSingleNumber(frontendFilters.dimensionLengthRange.slice(0,1));
  apiFilters['dimension.length.lte'] = mapSingleNumber(frontendFilters.dimensionLengthRange.slice(1,2));
  apiFilters['dimension.height.gte'] = mapSingleNumber(frontendFilters.dimensionHeightRange.slice(0,1));
  apiFilters['dimension.height.lte'] = mapSingleNumber(frontendFilters.dimensionHeightRange.slice(1,2));
  apiFilters['dimension.weight.gte'] = mapSingleNumber(frontendFilters.dimensionWeightRange.slice(0,1));
  apiFilters['dimension.weight.lte'] = mapSingleNumber(frontendFilters.dimensionWeightRange.slice(1,2));


  // Map string[] to 'between' ranges for BGG Rating, Complexity, Average Rating
  apiFilters['bggRating.between'] = mapBetweenRange(frontendFilters.bggRatingRange);
  apiFilters['complexity.between'] = mapBetweenRange(frontendFilters.complexityRange);
  apiFilters['averageRating.between'] = mapBetweenRange(frontendFilters.averageRatingRange);


  // Map string[] to comma-separated 'in' lists
  apiFilters['categories.name.in'] = mapCommaSeparated(frontendFilters.categoryNames);
  apiFilters['genres.name.in'] = mapCommaSeparated(frontendFilters.genreNames);
  apiFilters['type.name.eq'] = mapSingleString(frontendFilters.productTypeNames); // Assuming single type selection for type.name.eq
  apiFilters['mechanics.in'] = mapCommaSeparated(frontendFilters.mechanics);


  return apiFilters;
};
