import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PlacesService } from './places';
import type { CreatePlaceInput, UpdatePlaceInput, PlaceFilters } from '../types/places';

// Mock Supabase client
const mockSupabaseClient = {
  from: vi.fn(),
  auth: {
    getUser: vi.fn(),
  },
};

describe('PlacesService', () => {
  let service: PlacesService;
  const mockUserId = '123e4567-e89b-12d3-a456-426614174001';

  beforeEach(() => {
    vi.clearAllMocks();
    service = new PlacesService(mockSupabaseClient as any);

    // Mock auth to return user ID
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: mockUserId } },
      error: null,
    });
  });

  describe('listPlaces', () => {
    it('should fetch all places for authenticated user', async () => {
      const mockPlaces = [
        { id: '1', name: 'Place 1', category: '식당' },
        { id: '2', name: 'Place 2', category: '카페' },
      ];

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: mockPlaces, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue(mockQuery),
      });

      const result = await service.listPlaces();

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('places');
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', mockUserId);
      expect(mockQuery.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result.data).toEqual(mockPlaces);
      expect(result.error).toBeNull();
    });

    it('should apply filters when provided', async () => {
      const filters: PlaceFilters = {
        category: '식당',
        visit_status: '미방문',
        priority: '🔥 최우선',
      };

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue(mockQuery),
      });

      await service.listPlaces(filters);

      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', mockUserId);
      expect(mockQuery.eq).toHaveBeenCalledWith('category', '식당');
      expect(mockQuery.eq).toHaveBeenCalledWith('visit_status', '미방문');
      expect(mockQuery.eq).toHaveBeenCalledWith('priority', '🔥 최우선');
    });

    it('should apply search filter using ilike', async () => {
      const filters: PlaceFilters = {
        search: 'korean bbq',
      };

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue(mockQuery),
      });

      await service.listPlaces(filters);

      expect(mockQuery.ilike).toHaveBeenCalledWith('name', '%korean bbq%');
    });

    it('should apply pagination when provided', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue(mockQuery),
      });

      await service.listPlaces({}, 1, 20);

      expect(mockQuery.range).toHaveBeenCalledWith(20, 39); // page 1, 20 items = 20-39
    });

    it('should handle authentication error', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      const result = await service.listPlaces();

      expect(result.data).toBeNull();
      expect(result.error).toBeTruthy();
      expect(result.error?.message).toContain('authenticated');
    });

    it('should handle database error', async () => {
      const mockError = { message: 'Database error' };

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      };

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue(mockQuery),
      });

      const result = await service.listPlaces();

      expect(result.data).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });

  describe('getPlace', () => {
    it('should fetch a single place by id', async () => {
      const mockPlace = { id: '1', name: 'Test Place', category: '식당' };

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockPlace, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue(mockQuery),
      });

      const result = await service.getPlace('1');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('places');
      expect(mockQuery.eq).toHaveBeenCalledWith('id', '1');
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', mockUserId);
      expect(result.data).toEqual(mockPlace);
    });

    it('should handle not found error', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Not found', code: 'PGRST116' }
        }),
      };

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue(mockQuery),
      });

      const result = await service.getPlace('999');

      expect(result.data).toBeNull();
      expect(result.error).toBeTruthy();
    });

    it('should verify user ownership', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue(mockQuery),
      });

      await service.getPlace('1');

      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', mockUserId);
    });
  });

  describe('createPlace', () => {
    it('should create a new place with user_id', async () => {
      const input: CreatePlaceInput = {
        name: 'New Place',
        category: '식당',
      };

      const mockCreatedPlace = {
        id: '1',
        user_id: mockUserId,
        ...input,
        visit_status: '미방문',
        priority: '일반',
        record_status: 'draft',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const mockQuery = {
        select: vi.fn().mockResolvedValue({
          data: [mockCreatedPlace],
          error: null
        }),
      };

      mockSupabaseClient.from.mockReturnValue({
        insert: vi.fn().mockReturnValue(mockQuery),
      });

      const result = await service.createPlace(input);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('places');
      expect(result.data).toEqual(mockCreatedPlace);
      expect(result.error).toBeNull();
    });

    it('should validate input before creating', async () => {
      const invalidInput = {
        name: '', // Empty name should fail validation
        category: '식당',
      } as CreatePlaceInput;

      const result = await service.createPlace(invalidInput);

      expect(result.error).toBeTruthy();
      expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });

    it('should handle database constraint violations', async () => {
      const input: CreatePlaceInput = {
        name: 'Test Place',
        category: '식당',
      };

      const mockQuery = {
        select: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Constraint violation', code: '23505' }
        }),
      };

      mockSupabaseClient.from.mockReturnValue({
        insert: vi.fn().mockReturnValue(mockQuery),
      });

      const result = await service.createPlace(input);

      expect(result.data).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });

  describe('updatePlace', () => {
    it('should update an existing place', async () => {
      const placeId = '111e4567-e89b-12d3-a456-426614174111';
      const input: UpdatePlaceInput = {
        id: placeId,
        name: 'Updated Name',
        visit_status: '방문 완료',
      };

      const mockUpdatedPlace = {
        id: placeId,
        name: 'Updated Name',
        visit_status: '방문 완료',
        updated_at: '2024-01-02T00:00:00Z',
      };

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({
          data: [mockUpdatedPlace],
          error: null
        }),
      };

      mockSupabaseClient.from.mockReturnValue({
        update: vi.fn().mockReturnValue(mockQuery),
      });

      const result = await service.updatePlace(input);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('places');
      expect(mockQuery.eq).toHaveBeenCalledWith('id', placeId);
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', mockUserId);
      expect(result.data).toEqual(mockUpdatedPlace);
    });

    it('should validate input before updating', async () => {
      const invalidInput = {
        id: 'not-a-uuid',
        name: 'Updated Name',
      } as UpdatePlaceInput;

      const result = await service.updatePlace(invalidInput);

      expect(result.error).toBeTruthy();
      expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });

    it('should verify user ownership before updating', async () => {
      const placeId = '222e4567-e89b-12d3-a456-426614174222';
      const input: UpdatePlaceInput = {
        id: placeId,
        name: 'Updated',
      };

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue({
        update: vi.fn().mockReturnValue(mockQuery),
      });

      await service.updatePlace(input);

      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', mockUserId);
    });

    it('should handle not found during update', async () => {
      const input: UpdatePlaceInput = {
        id: '999e4567-e89b-12d3-a456-426614174999',
        name: 'Updated',
      };

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({
          data: [],
          error: null
        }),
      };

      mockSupabaseClient.from.mockReturnValue({
        update: vi.fn().mockReturnValue(mockQuery),
      });

      const result = await service.updatePlace(input);

      expect(result.data).toBeNull();
      expect(result.error).toBeTruthy();
      expect(result.error?.message).toContain('not found');
    });
  });

  describe('deletePlace', () => {
    it('should delete a place by id', async () => {
      const placeId = '333e4567-e89b-12d3-a456-426614174333';

      // Create a promise that will be returned by the second .eq() call
      const finalPromise = Promise.resolve({ data: null, error: null });

      const mockQuery = {
        eq: vi.fn()
          .mockReturnValueOnce({ eq: vi.fn().mockReturnValue(finalPromise) })
      };

      mockSupabaseClient.from.mockReturnValue({
        delete: vi.fn().mockReturnValue(mockQuery),
      });

      const result = await service.deletePlace(placeId);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('places');
      expect(mockQuery.eq).toHaveBeenCalledWith('id', placeId);
      expect(result.error).toBeNull();
    });

    it('should verify user ownership before deleting', async () => {
      const placeId = '444e4567-e89b-12d3-a456-426614174444';

      const finalPromise = Promise.resolve({ data: null, error: null });

      const secondEq = vi.fn().mockReturnValue(finalPromise);
      const mockQuery = {
        eq: vi.fn().mockReturnValue({ eq: secondEq })
      };

      mockSupabaseClient.from.mockReturnValue({
        delete: vi.fn().mockReturnValue(mockQuery),
      });

      await service.deletePlace(placeId);

      expect(secondEq).toHaveBeenCalledWith('user_id', mockUserId);
    });

    it('should handle deletion errors', async () => {
      const placeId = '555e4567-e89b-12d3-a456-426614174555';
      const mockError = { message: 'Cannot delete' };

      const finalPromise = Promise.resolve({ data: null, error: mockError });

      const mockQuery = {
        eq: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue(finalPromise) })
      };

      mockSupabaseClient.from.mockReturnValue({
        delete: vi.fn().mockReturnValue(mockQuery),
      });

      const result = await service.deletePlace(placeId);

      expect(result.error).toEqual(mockError);
    });
  });
});
