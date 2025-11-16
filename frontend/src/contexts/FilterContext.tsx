import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { PlaceFilters } from '../types/places';

interface FilterContextValue {
  filters: PlaceFilters;
  updateFilters: (updates: Partial<PlaceFilters>) => void;
  clearFilters: () => void;
  activeFilterCount: number;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

function parseFiltersFromURL(): PlaceFilters {
  const params = new URLSearchParams(window.location.search);
  const filters: PlaceFilters = {};

  const category = params.get('category');
  if (category) filters.category = category;

  const regionMain = params.get('region_main');
  if (regionMain) filters.region_main = regionMain;

  const visitStatus = params.get('visit_status');
  if (visitStatus) filters.visit_status = visitStatus;

  const priority = params.get('priority');
  if (priority) filters.priority = priority;

  const recordStatus = params.get('record_status');
  if (recordStatus) filters.record_status = recordStatus;

  const search = params.get('search');
  if (search) filters.search = search;

  return filters;
}

function syncFiltersToURL(filters: PlaceFilters): void {
  const params = new URLSearchParams();

  if (filters.category) params.set('category', filters.category);
  if (filters.region_main) params.set('region_main', filters.region_main);
  if (filters.visit_status) params.set('visit_status', filters.visit_status);
  if (filters.priority) params.set('priority', filters.priority);
  if (filters.record_status) params.set('record_status', filters.record_status);
  if (filters.search) params.set('search', filters.search);

  const newURL = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;

  window.history.replaceState({}, '', newURL);
}

function countActiveFilters(filters: PlaceFilters): number {
  return Object.values(filters).filter((value) => value !== undefined && value !== '').length;
}

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<PlaceFilters>(() =>
    parseFiltersFromURL()
  );

  const updateFilters = (updates: Partial<PlaceFilters>) => {
    setFilters((prev) => {
      const newFilters = { ...prev, ...updates };

      // Remove undefined values
      Object.keys(newFilters).forEach((key) => {
        if (newFilters[key as keyof PlaceFilters] === undefined) {
          delete newFilters[key as keyof PlaceFilters];
        }
      });

      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  useEffect(() => {
    syncFiltersToURL(filters);
  }, [filters]);

  const activeFilterCount = countActiveFilters(filters);

  return (
    <FilterContext.Provider
      value={{ filters, updateFilters, clearFilters, activeFilterCount }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters(): FilterContextValue {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
