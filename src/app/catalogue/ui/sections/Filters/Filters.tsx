// src/app/catalogue/ui/sections/Filters/Filters.tsx
'use client';

import { useState, useMemo } from 'react';
import { PriceFilter } from '../../components/PriceFilter';
import { CheckboxFilter } from '../../components/CheckboxFilter';
import { AvailableFilters } from '@/app/actions/products';

export interface FiltersProps {
  initialFilters: {
    minPrice: number;
    maxPrice: number;

    categoryNames: string[];
    genreNames: string[];
    mechanics: string[];
    languages: string[];

    productTypeNames: string[];

    nameContains: string[];

    minPlayerNumberRange: string[];
    maxPlayerNumberRange: string[];
    minAgeRange: string[];

    publisherContains: string[];
    authorContains: string[];
  };
  onFiltersChange: (filters: FiltersProps['initialFilters']) => void;
  availableFilters: AvailableFilters;
}

export const Filters = ({ availableFilters, initialFilters, onFiltersChange }: FiltersProps) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (patch: Partial<typeof filters>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    onFiltersChange(next);
  };

  const handlePriceApply = (minVal: number, maxVal: number) => {
    handleFilterChange({ minPrice: minVal, maxPrice: maxVal });
  };

  // Масиви з бекенду -> опції
  const mapOptions = (arr?: string[]) => (arr ?? []).map(v => ({ id: v, value: v }));

  const categoryOptions  = useMemo(() => mapOptions(availableFilters.categories), [availableFilters.categories]);
  const genreOptions     = useMemo(() => mapOptions(availableFilters.genres),     [availableFilters.genres]);
  const mechanicsOptions = useMemo(() => mapOptions(availableFilters.mechanics),  [availableFilters.mechanics]);
  const publisherOptions = useMemo(() => mapOptions(availableFilters.publishers), [availableFilters.publishers]);
  const languageOptions  = useMemo(() => mapOptions(availableFilters.languages),  [availableFilters.languages]);
  const authorOptions    = useMemo(() => mapOptions(availableFilters.authors),    [availableFilters.authors]);

  // Числові діапазони як чекбокси
  const minPlayersOptions = useMemo(() => {
    const max = Math.max(availableFilters.maxPlayers || 0, 0);
    return Array.from({ length: Math.max(max, 0) }, (_, i) => String(i + 1))
      .map(v => ({ id: v, value: v }));
  }, [availableFilters.maxPlayers]);

  const maxPlayersOptions = useMemo(() => {
    const min = Math.max(availableFilters.minPlayers || 1, 1);
    const max = Math.max(availableFilters.maxPlayers || min, min);
    return Array.from({ length: max - min + 1 }, (_, i) => String(min + i))
      .map(v => ({ id: v, value: v }));
  }, [availableFilters.minPlayers, availableFilters.maxPlayers]);

  const minAgeOptions = useMemo(() => {
    const start = Math.max(availableFilters.minAge || 0, 0);
    const upper = 18;
    return Array.from({ length: upper - start + 1 }, (_, i) => String(start + i))
      .map(v => ({ id: v, value: v }));
  }, [availableFilters.minAge]);

  return (
    <div className="mt-10 divide-y space-y-6">
      <PriceFilter
        min={availableFilters.priceRange.min}
        max={availableFilters.priceRange.max}
        className="mb-8"
        minVal={filters.minPrice}
        maxVal={filters.maxPrice}
        onApply={handlePriceApply}
      />

      <CheckboxFilter
        title="Категорія"
        options={categoryOptions}
        chosenValue={filters.categoryNames}
        onChange={(selected) => handleFilterChange({ categoryNames: selected })}
        isOpenDefault
      />

      <CheckboxFilter
        title="Жанр"
        options={genreOptions}
        chosenValue={filters.genreNames}
        onChange={(selected) => handleFilterChange({ genreNames: selected })}
      />

      <CheckboxFilter
        title="Механіки"
        options={mechanicsOptions}
        chosenValue={filters.mechanics}
        onChange={(selected) => handleFilterChange({ mechanics: selected })}
      />

      <CheckboxFilter
        title="Мова"
        options={languageOptions}
        chosenValue={filters.languages}
        onChange={(selected) => handleFilterChange({ languages: selected })}
      />

      <CheckboxFilter
        title="Мін. гравців"
        options={minPlayersOptions}
        chosenValue={filters.minPlayerNumberRange}
        onChange={(selected) => handleFilterChange({ minPlayerNumberRange: selected })}
      />

      <CheckboxFilter
        title="Макс. гравців"
        options={maxPlayersOptions}
        chosenValue={filters.maxPlayerNumberRange}
        onChange={(selected) => handleFilterChange({ maxPlayerNumberRange: selected })}
      />

      <CheckboxFilter
        title="Мін. вік"
        options={minAgeOptions}
        chosenValue={filters.minAgeRange}
        onChange={(selected) => handleFilterChange({ minAgeRange: selected })}
      />

      <CheckboxFilter
        title="Видавець"
        options={publisherOptions}
        chosenValue={filters.publisherContains}
        onChange={(selected) => handleFilterChange({ publisherContains: selected })}
      />

      <CheckboxFilter
        title="Автор"
        options={authorOptions}
        chosenValue={filters.authorContains}
        onChange={(selected) => handleFilterChange({ authorContains: selected })}
      />
    </div>
  );
};
