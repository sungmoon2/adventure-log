import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FilterProvider, useFilters } from '../FilterContext';
import type { PlaceFilters } from '../../types/places';

// Test component to access the filter context
function TestComponent() {
  const { filters, updateFilters, clearFilters, activeFilterCount } = useFilters();

  return (
    <div>
      <div data-testid="filter-count">{activeFilterCount}</div>
      <div data-testid="category">{filters.category || 'none'}</div>
      <div data-testid="region">{filters.region_main || 'none'}</div>
      <div data-testid="status">{filters.visit_status || 'none'}</div>
      <div data-testid="priority">{filters.priority || 'none'}</div>
      <button onClick={() => updateFilters({ category: 'restaurant' })}>
        Set Category
      </button>
      <button onClick={() => updateFilters({ region_main: 'seoul' })}>
        Set Region
      </button>
      <button onClick={clearFilters}>Clear Filters</button>
    </div>
  );
}

describe('FilterContext', () => {
  beforeEach(() => {
    // Clear URL params before each test
    window.history.replaceState({}, '', '/');
  });

  it('provides default empty filters', () => {
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    expect(screen.getByTestId('filter-count')).toHaveTextContent('0');
    expect(screen.getByTestId('category')).toHaveTextContent('none');
    expect(screen.getByTestId('region')).toHaveTextContent('none');
  });

  it('updates filters correctly', async () => {
    const user = userEvent.setup();
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    await user.click(screen.getByText('Set Category'));
    expect(screen.getByTestId('category')).toHaveTextContent('restaurant');
    expect(screen.getByTestId('filter-count')).toHaveTextContent('1');

    await user.click(screen.getByText('Set Region'));
    expect(screen.getByTestId('region')).toHaveTextContent('seoul');
    expect(screen.getByTestId('filter-count')).toHaveTextContent('2');
  });

  it('clears all filters', async () => {
    const user = userEvent.setup();
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    await user.click(screen.getByText('Set Category'));
    await user.click(screen.getByText('Set Region'));
    expect(screen.getByTestId('filter-count')).toHaveTextContent('2');

    await user.click(screen.getByText('Clear Filters'));
    expect(screen.getByTestId('filter-count')).toHaveTextContent('0');
    expect(screen.getByTestId('category')).toHaveTextContent('none');
    expect(screen.getByTestId('region')).toHaveTextContent('none');
  });

  it('syncs filters to URL params', async () => {
    const user = userEvent.setup();
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    await user.click(screen.getByText('Set Category'));
    await waitFor(() => {
      expect(window.location.search).toContain('category=restaurant');
    });

    await user.click(screen.getByText('Set Region'));
    await waitFor(() => {
      expect(window.location.search).toContain('region_main=seoul');
    });
  });

  it('loads filters from URL params on mount', () => {
    window.history.replaceState({}, '', '/?category=cafe&region_main=busan');

    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    expect(screen.getByTestId('category')).toHaveTextContent('cafe');
    expect(screen.getByTestId('region')).toHaveTextContent('busan');
    expect(screen.getByTestId('filter-count')).toHaveTextContent('2');
  });
});
