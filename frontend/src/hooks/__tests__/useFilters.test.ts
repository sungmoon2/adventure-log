import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilters } from '../useFilters';

describe('useFilters', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('initializes with empty filters', () => {
    const { result } = renderHook(() => useFilters());

    expect(result.current.filters).toEqual({});
    expect(result.current.activeFilterCount).toBe(0);
  });

  it('updates single filter', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.updateFilters({ category: 'restaurant' });
    });

    expect(result.current.filters.category).toBe('restaurant');
    expect(result.current.activeFilterCount).toBe(1);
  });

  it('updates multiple filters', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.updateFilters({
        category: 'restaurant',
        region_main: 'seoul',
        priority: 'high',
      });
    });

    expect(result.current.filters).toEqual({
      category: 'restaurant',
      region_main: 'seoul',
      priority: 'high',
    });
    expect(result.current.activeFilterCount).toBe(3);
  });

  it('merges filters on update', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.updateFilters({ category: 'restaurant' });
    });

    act(() => {
      result.current.updateFilters({ region_main: 'seoul' });
    });

    expect(result.current.filters).toEqual({
      category: 'restaurant',
      region_main: 'seoul',
    });
    expect(result.current.activeFilterCount).toBe(2);
  });

  it('clears all filters', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.updateFilters({
        category: 'restaurant',
        region_main: 'seoul',
        priority: 'high',
      });
    });

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters).toEqual({});
    expect(result.current.activeFilterCount).toBe(0);
  });

  it('removes filter when set to undefined', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.updateFilters({
        category: 'restaurant',
        region_main: 'seoul',
      });
    });

    act(() => {
      result.current.updateFilters({ category: undefined });
    });

    expect(result.current.filters).toEqual({
      region_main: 'seoul',
    });
    expect(result.current.activeFilterCount).toBe(1);
  });

  it('syncs to URL params', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.updateFilters({ category: 'cafe' });
    });

    expect(window.location.search).toContain('category=cafe');
  });

  it('loads from URL params on init', () => {
    window.history.replaceState({}, '', '/?category=restaurant&priority=high');

    const { result } = renderHook(() => useFilters());

    expect(result.current.filters).toEqual({
      category: 'restaurant',
      priority: 'high',
    });
    expect(result.current.activeFilterCount).toBe(2);
  });
});
