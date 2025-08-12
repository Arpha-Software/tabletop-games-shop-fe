// src/app/catalogue/ui/sections/Filters/Filters.tsx
'use client';

import { useMemo, useState, useCallback } from 'react';
import { PriceFilter } from '../../components/PriceFilter';
import { CheckboxFilter } from '../../components/CheckboxFilter';
import { AvailableFilters } from '@/app/actions/products';
import { Button } from '@/app/ui/components';
import { cn } from '@/utils/helpers';

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

  const handleFilterChange = useCallback((patch: Partial<typeof filters>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    onFiltersChange(next);
  }, [filters, onFiltersChange]);

  const handlePriceApply = useCallback((minVal: number, maxVal: number) => {
    handleFilterChange({ minPrice: minVal, maxPrice: maxVal });
  }, [handleFilterChange]);

  // Map helpers
  const mapOptions = (arr?: string[]) => (arr ?? []).map(v => ({ id: v, value: v }));

  const categoryOptions  = useMemo(() => mapOptions(availableFilters.categories), [availableFilters.categories]);
  const genreOptions     = useMemo(() => mapOptions(availableFilters.genres),     [availableFilters.genres]);
  const mechanicsOptions = useMemo(() => mapOptions(availableFilters.mechanics),  [availableFilters.mechanics]);
  const publisherOptions = useMemo(() => mapOptions(availableFilters.publishers), [availableFilters.publishers]);
  const languageOptions  = useMemo(() => mapOptions(availableFilters.languages),  [availableFilters.languages]);
  const authorOptions    = useMemo(() => mapOptions(availableFilters.authors),    [availableFilters.authors]);

  // Numeric lists
  const minPlayersOptions = useMemo(() => {
    const max = Math.max(availableFilters.maxPlayers || 0, 0);
    return Array.from({ length: Math.max(max, 0) }, (_, i) => String(i + 1)).map(v => ({ id: v, value: v }));
  }, [availableFilters.maxPlayers]);

  const maxPlayersOptions = useMemo(() => {
    const min = Math.max(availableFilters.minPlayers || 1, 1);
    const max = Math.max(availableFilters.maxPlayers || min, min);
    return Array.from({ length: max - min + 1 }, (_, i) => String(min + i)).map(v => ({ id: v, value: v }));
  }, [availableFilters.minPlayers, availableFilters.maxPlayers]);

  const minAgeOptions = useMemo(() => {
    const start = Math.max(availableFilters.minAge || 0, 0);
    const upper = 18;
    return Array.from({ length: upper - start + 1 }, (_, i) => String(start + i)).map(v => ({ id: v, value: v }));
  }, [availableFilters.minAge]);

  // Active chips + counters
  const priceChanged =
    filters.minPrice > (availableFilters.priceRange?.min ?? 0) ||
    filters.maxPrice < (availableFilters.priceRange?.max ?? 0);

  const countActive = [
    filters.categoryNames.length,
    filters.genreNames.length,
    filters.mechanics.length,
    filters.languages.length,
    filters.minPlayerNumberRange.length,
    filters.maxPlayerNumberRange.length,
    filters.minAgeRange.length,
    filters.publisherContains.length,
    filters.authorContains.length,
    priceChanged ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const removeChip = (group: keyof typeof filters, value: string) => {
    const arr = (filters[group] as string[] | number | undefined);
    if (!Array.isArray(arr)) return;
    handleFilterChange({ [group]: arr.filter(v => v !== value) } as Partial<typeof filters>);
  };

  const clearAll = () => {
    const cleared = {
      ...filters,
      minPrice: availableFilters.priceRange.min,
      maxPrice: availableFilters.priceRange.max,
      categoryNames: [],
      genreNames: [],
      mechanics: [],
      languages: [],
      productTypeNames: [],
      nameContains: [],
      minPlayerNumberRange: [],
      maxPlayerNumberRange: [],
      minAgeRange: [],
      publisherContains: [],
      authorContains: [],
    };
    setFilters(cleared);
    onFiltersChange(cleared);
  };

  return (
    <aside
      className={cn(
        'bg-white rounded-2xl border border-gray-100 shadow-card p-5 md:p-6',
        'sticky top-24'
      )}
      aria-label="Фільтри каталогу"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Фільтри</h3>
          {!!countActive && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
              {countActive}
            </span>
          )}
        </div>
        <Button
          variant="secondary"
          className="text-xs px-3 py-1.5"
          onClick={clearAll}
        >
          Очистити все
        </Button>
      </div>

      {/* Active chips */}
      {!!countActive && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {priceChanged && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                {filters.minPrice} – {filters.maxPrice} ₴
                <button
                  type="button"
                  className="hover:text-primary/70"
                  onClick={() =>
                    handleFilterChange({
                      minPrice: availableFilters.priceRange.min,
                      maxPrice: availableFilters.priceRange.max,
                    })
                  }
                >
                  ×
                </button>
              </span>
            )}

            {filters.categoryNames.map((v) => (
              <Chip key={`cat-${v}`} label={v} onRemove={() => removeChip('categoryNames', v)} />
            ))}
            {filters.genreNames.map((v) => (
              <Chip key={`genre-${v}`} label={v} onRemove={() => removeChip('genreNames', v)} />
            ))}
            {filters.mechanics.map((v) => (
              <Chip key={`mech-${v}`} label={v} onRemove={() => removeChip('mechanics', v)} />
            ))}
            {filters.languages.map((v) => (
              <Chip key={`lang-${v}`} label={v} onRemove={() => removeChip('languages', v)} />
            ))}
            {filters.minPlayerNumberRange.map((v) => (
              <Chip key={`minp-${v}`} label={`мін. ${v}`} onRemove={() => removeChip('minPlayerNumberRange', v)} />
            ))}
            {filters.maxPlayerNumberRange.map((v) => (
              <Chip key={`maxp-${v}`} label={`макс. ${v}`} onRemove={() => removeChip('maxPlayerNumberRange', v)} />
            ))}
            {filters.minAgeRange.map((v) => (
              <Chip key={`age-${v}`} label={`${v}+`} onRemove={() => removeChip('minAgeRange', v)} />
            ))}
            {filters.publisherContains.map((v) => (
              <Chip key={`pub-${v}`} label={v} onRemove={() => removeChip('publisherContains', v)} />
            ))}
            {filters.authorContains.map((v) => (
              <Chip key={`auth-${v}`} label={v} onRemove={() => removeChip('authorContains', v)} />
            ))}
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4">
        <CardSection title="Ціна" defaultOpen>
          <PriceFilter
            min={availableFilters.priceRange.min}
            max={availableFilters.priceRange.max}
            minVal={filters.minPrice}
            maxVal={filters.maxPrice}
            onApply={handlePriceApply}
          />
        </CardSection>

        <CardSection title="Категорія" defaultOpen>
          <CheckboxFilter
            title=""
            options={categoryOptions}
            chosenValue={filters.categoryNames}
            onChange={(selected) => handleFilterChange({ categoryNames: selected })}
            isOpenDefault
          />
        </CardSection>

        <CardSection title="Жанр">
          <CheckboxFilter
            title=""
            options={genreOptions}
            chosenValue={filters.genreNames}
            onChange={(selected) => handleFilterChange({ genreNames: selected })}
            isOpenDefault
          />
        </CardSection>

        <CardSection title="Механіки">
          <CheckboxFilter
            title=""
            options={mechanicsOptions}
            chosenValue={filters.mechanics}
            onChange={(selected) => handleFilterChange({ mechanics: selected })}
            isOpenDefault
          />
        </CardSection>

        <CardSection title="Мова">
          <CheckboxFilter
            title=""
            options={languageOptions}
            chosenValue={filters.languages}
            onChange={(selected) => handleFilterChange({ languages: selected })}
            isOpenDefault
          />
        </CardSection>

        <CardSection title="Мін. гравців">
          <CheckboxFilter
            title=""
            options={minPlayersOptions}
            chosenValue={filters.minPlayerNumberRange}
            onChange={(selected) => handleFilterChange({ minPlayerNumberRange: selected })}
            isOpenDefault
          />
        </CardSection>

        <CardSection title="Макс. гравців">
          <CheckboxFilter
            title=""
            options={maxPlayersOptions}
            chosenValue={filters.maxPlayerNumberRange}
            onChange={(selected) => handleFilterChange({ maxPlayerNumberRange: selected })}
            isOpenDefault
          />
        </CardSection>

        <CardSection title="Мін. вік">
          <CheckboxFilter
            title=""
            options={minAgeOptions}
            chosenValue={filters.minAgeRange}
            onChange={(selected) => handleFilterChange({ minAgeRange: selected })}
            isOpenDefault
          />
        </CardSection>

        <CardSection title="Видавець">
          <CheckboxFilter
            title=""
            options={publisherOptions}
            chosenValue={filters.publisherContains}
            onChange={(selected) => handleFilterChange({ publisherContains: selected })}
            isOpenDefault
          />
        </CardSection>

        <CardSection title="Автор">
          <CheckboxFilter
            title=""
            options={authorOptions}
            chosenValue={filters.authorContains}
            onChange={(selected) => handleFilterChange({ authorContains: selected })}
            isOpenDefault
          />
        </CardSection>
      </div>
    </aside>
  );
};

// Small pill chip
const Chip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border border-gray-200">
    {label}
    <button type="button" className="hover:text-gray-500" onClick={onRemove} aria-label={`Прибрати фільтр ${label}`}>
      ×
    </button>
  </span>
);

// Section wrapper with light header and divider
const CardSection = ({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-gray-100">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <span className="text-sm font-medium text-gray-900">{title}</span>
        <span className={cn('text-gray-400 transition-transform', open ? 'rotate-180' : '')}>⌄</span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};
