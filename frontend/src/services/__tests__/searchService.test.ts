import { describe, it, expect, beforeEach } from 'vitest';
import { SearchService, SearchableAdventure } from '../searchService';

describe('SearchService', () => {
  let searchService: SearchService;
  const mockAdventures: SearchableAdventure[] = [
    {
      id: '1',
      title: 'Hiking in the Alps',
      description: 'Amazing mountain adventure',
      location: 'Switzerland',
      tags: ['hiking', 'mountains'],
      date: '2024-01-01',
    },
    {
      id: '2',
      title: 'Beach Vacation',
      description: 'Relaxing by the ocean',
      location: 'Hawaii',
      tags: ['beach', 'relaxation'],
      date: '2024-02-01',
    },
    {
      id: '3',
      title: 'City Tour in Paris',
      description: 'Exploring the city of lights',
      location: 'France',
      tags: ['city', 'culture'],
      date: '2024-03-01',
    },
  ];

  beforeEach(() => {
    searchService = new SearchService();
  });

  it('initializes with adventures', () => {
    searchService.initialize(mockAdventures);
    const results = searchService.search('hiking');
    expect(results.length).toBeGreaterThan(0);
  });

  it('returns empty array for empty query', () => {
    searchService.initialize(mockAdventures);
    const results = searchService.search('');
    expect(results).toEqual([]);
  });

  it('searches by title', () => {
    searchService.initialize(mockAdventures);
    const results = searchService.search('hiking');
    expect(results[0].item.title).toContain('Hiking');
  });

  it('searches by location', () => {
    searchService.initialize(mockAdventures);
    const results = searchService.search('Hawaii');
    expect(results[0].item.location).toBe('Hawaii');
  });

  it('updates adventure list', () => {
    searchService.initialize(mockAdventures);
    const newAdventures = [mockAdventures[0]];
    searchService.update(newAdventures);
    const results = searchService.search('beach');
    expect(results.length).toBe(0);
  });

  it('clears search index', () => {
    searchService.initialize(mockAdventures);
    searchService.clear();
    const results = searchService.search('hiking');
    expect(results).toEqual([]);
  });
});
