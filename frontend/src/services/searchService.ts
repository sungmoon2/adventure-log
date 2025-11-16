import Fuse from 'fuse.js';

export interface SearchableAdventure {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  tags: string[];
  date: string;
}

export interface SearchResult {
  item: SearchableAdventure;
  score?: number;
  matches?: readonly Fuse.FuseResultMatch[];
}

const fuseOptions: Fuse.IFuseOptions<SearchableAdventure> = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'location', weight: 0.2 },
    { name: 'tags', weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
};

export class SearchService {
  private fuse: Fuse<SearchableAdventure> | null = null;

  initialize(adventures: SearchableAdventure[]): void {
    this.fuse = new Fuse(adventures, fuseOptions);
  }

  search(query: string): SearchResult[] {
    if (!this.fuse || !query.trim()) {
      return [];
    }

    return this.fuse.search(query);
  }

  update(adventures: SearchableAdventure[]): void {
    this.initialize(adventures);
  }

  clear(): void {
    this.fuse = null;
  }
}

export const searchService = new SearchService();
