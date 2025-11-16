import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useSearch } from '../useSearch';
import { SearchableAdventure } from '../../services/searchService';

const mockAdventures: SearchableAdventure[] = [
  {
    id: '1',
    title: 'Mountain Hiking',
    description: 'Great adventure',
    location: 'Alps',
    tags: ['hiking'],
    date: '2024-01-01',
  },
  {
    id: '2',
    title: 'Beach Trip',
    description: 'Relaxing time',
    location: 'Maldives',
    tags: ['beach'],
    date: '2024-02-01',
  },
];

describe('useSearch', () => {
  it('initializes with empty query', () => {
    const { result } = renderHook(() => useSearch(mockAdventures));
    expect(result.current.query).toBe('');
    expect(result.current.results).toEqual([]);
  });

  it('updates query', () => {
    const { result } = renderHook(() => useSearch(mockAdventures));
    act(() => {
      result.current.setQuery('mountain');
    });
    expect(result.current.query).toBe('mountain');
  });

  it('returns results after debounce', async () => {
    const { result } = renderHook(() => useSearch(mockAdventures, { debounceMs: 100 }));

    act(() => {
      result.current.setQuery('mountain');
    });

    await waitFor(
      () => {
        expect(result.current.results.length).toBeGreaterThan(0);
      },
      { timeout: 500 }
    );
  });

  it('respects minQueryLength', () => {
    const { result } = renderHook(() => useSearch(mockAdventures, { minQueryLength: 3 }));
    act(() => {
      result.current.setQuery('ab');
    });
    expect(result.current.hasQuery).toBe(false);
  });
});
