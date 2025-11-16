import { describe, it, expect } from 'vitest';
import {
  placeSchema,
  createPlaceInputSchema,
  updatePlaceInputSchema,
  placeFiltersSchema,
} from './places';
import type { Place, CreatePlaceInput, UpdatePlaceInput, PlaceFilters } from './places';

describe('Place Type Validation', () => {
  describe('placeSchema', () => {
    it('should validate a complete valid place object', () => {
      const validPlace: Place = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Test Restaurant',
        category: '식당',
        visit_status: '미방문',
        priority: '🔥 최우선',
        record_status: 'published',
        region_main: 'Seoul',
        region_sub: 'Gangnam',
        address: '123 Test Street',
        operating_hours: '10:00-22:00',
        parking_info: '매장 주차장',
        parking_memo: 'Free parking',
        keywords: ['korean', 'bbq'],
        memo: 'Great place',
        source_url: 'https://example.com',
        cover_image_url: 'https://example.com/image.jpg',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const result = placeSchema.safeParse(validPlace);
      expect(result.success).toBe(true);
    });

    it('should validate a minimal valid place object', () => {
      const minimalPlace = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Minimal Place',
        category: '카페',
        visit_status: '미방문',
        priority: '일반',
        record_status: 'draft',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const result = placeSchema.safeParse(minimalPlace);
      expect(result.success).toBe(true);
    });

    it('should reject invalid category', () => {
      const invalidPlace = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Test Place',
        category: 'invalid-category',
        visit_status: '미방문',
        priority: '일반',
        record_status: 'draft',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const result = placeSchema.safeParse(invalidPlace);
      expect(result.success).toBe(false);
    });

    it('should reject missing required fields', () => {
      const incompletePlace = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Place',
      };

      const result = placeSchema.safeParse(incompletePlace);
      expect(result.success).toBe(false);
    });

    it('should reject invalid UUID format', () => {
      const invalidUUID = {
        id: 'not-a-uuid',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Test Place',
        category: '식당',
        visit_status: '미방문',
        priority: '일반',
        record_status: 'draft',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const result = placeSchema.safeParse(invalidUUID);
      expect(result.success).toBe(false);
    });

    it('should reject invalid URL format', () => {
      const invalidURL = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Test Place',
        category: '식당',
        visit_status: '미방문',
        priority: '일반',
        record_status: 'draft',
        source_url: 'not-a-url',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const result = placeSchema.safeParse(invalidURL);
      expect(result.success).toBe(false);
    });
  });

  describe('createPlaceInputSchema', () => {
    it('should validate minimal create input with required fields only', () => {
      const minimalInput: CreatePlaceInput = {
        name: 'New Place',
        category: '식당',
      };

      const result = createPlaceInputSchema.safeParse(minimalInput);
      expect(result.success).toBe(true);
    });

    it('should validate complete create input with all fields', () => {
      const completeInput: CreatePlaceInput = {
        name: 'Complete Place',
        category: '명소',
        visit_status: '방문 완료',
        priority: '✨ 꼭 가볼 곳',
        record_status: 'published',
        region_main: 'Seoul',
        region_sub: 'Gangnam',
        address: '123 Test Street',
        operating_hours: '09:00-21:00',
        parking_info: '주차 지원',
        parking_memo: 'Valet parking available',
        keywords: ['tourist', 'popular'],
        memo: 'Must visit',
        source_url: 'https://example.com',
        cover_image_url: 'https://example.com/cover.jpg',
        start_date: '2024-06-01',
        end_date: '2024-08-31',
      };

      const result = createPlaceInputSchema.safeParse(completeInput);
      expect(result.success).toBe(true);
    });

    it('should reject create input without required name', () => {
      const invalidInput = {
        category: '카페',
      };

      const result = createPlaceInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject create input without required category', () => {
      const invalidInput = {
        name: 'Test Place',
      };

      const result = createPlaceInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should apply default values for optional fields', () => {
      const input = {
        name: 'Test Place',
        category: '식당',
      };

      const result = createPlaceInputSchema.parse(input);
      expect(result.visit_status).toBe('미방문');
      expect(result.priority).toBe('일반');
      expect(result.record_status).toBe('draft');
    });
  });

  describe('updatePlaceInputSchema', () => {
    it('should validate update with id and partial fields', () => {
      const updateInput: UpdatePlaceInput = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Updated Name',
      };

      const result = updatePlaceInputSchema.safeParse(updateInput);
      expect(result.success).toBe(true);
    });

    it('should validate update with multiple fields', () => {
      const updateInput: UpdatePlaceInput = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Updated Name',
        category: '문화/여가',
        visit_status: '재방문 완료',
        memo: 'Updated memo',
      };

      const result = updatePlaceInputSchema.safeParse(updateInput);
      expect(result.success).toBe(true);
    });

    it('should reject update without required id', () => {
      const invalidUpdate = {
        name: 'Updated Name',
      };

      const result = updatePlaceInputSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });

    it('should reject update with invalid id format', () => {
      const invalidUpdate = {
        id: 'not-a-uuid',
        name: 'Updated Name',
      };

      const result = updatePlaceInputSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });

    it('should allow empty partial update (only id)', () => {
      const minimalUpdate = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = updatePlaceInputSchema.safeParse(minimalUpdate);
      expect(result.success).toBe(true);
    });
  });

  describe('placeFiltersSchema', () => {
    it('should validate empty filters', () => {
      const emptyFilters: PlaceFilters = {};

      const result = placeFiltersSchema.safeParse(emptyFilters);
      expect(result.success).toBe(true);
    });

    it('should validate filters with single field', () => {
      const categoryFilter: PlaceFilters = {
        category: '식당',
      };

      const result = placeFiltersSchema.safeParse(categoryFilter);
      expect(result.success).toBe(true);
    });

    it('should validate filters with multiple fields', () => {
      const multipleFilters: PlaceFilters = {
        category: '카페',
        visit_status: '미방문',
        priority: '🔥 최우선',
        region_main: 'Seoul',
        search: 'coffee',
      };

      const result = placeFiltersSchema.safeParse(multipleFilters);
      expect(result.success).toBe(true);
    });

    it('should reject filters with invalid category', () => {
      const invalidFilter = {
        category: 'invalid',
      };

      const result = placeFiltersSchema.safeParse(invalidFilter);
      expect(result.success).toBe(false);
    });

    it('should allow search string', () => {
      const searchFilter: PlaceFilters = {
        search: 'korean bbq restaurant',
      };

      const result = placeFiltersSchema.safeParse(searchFilter);
      expect(result.success).toBe(true);
    });
  });
});
