import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import type { CreatePlaceInput, UpdatePlaceInput, PlaceFilters } from '../../../types/places';

// Mock supabase client first
vi.mock('../../../lib/supabase', () => ({
  supabase: {},
}));

// Mock PlacesService
vi.mock('../../../services/places');

// Import after mocks
import {
  usePlaces,
  usePlace,
  useCreatePlace,
  useUpdatePlace,
  useDeletePlace,
} from './usePlaces';
import { PlacesService } from '../../../services/places';

// Get the mocked class
const MockedPlacesService = vi.mocked(PlacesService);

describe('usePlaces hooks', () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: ReactNode }) => JSX.Element;
  let mockServiceInstance: any;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // Create mock service instance
    mockServiceInstance = {
      listPlaces: vi.fn(),
      getPlace: vi.fn(),
      createPlace: vi.fn(),
      updatePlace: vi.fn(),
      deletePlace: vi.fn(),
    };

    MockedPlacesService.mockImplementation(() => mockServiceInstance);

    vi.clearAllMocks();
  });

  describe('usePlaces', () => {
    it('should fetch places list successfully', async () => {
      const mockPlaces = [
        {
          id: '1',
          user_id: 'user-1',
          name: 'Place 1',
          category: '식당' as const,
          visit_status: '미방문' as const,
          priority: '일반' as const,
          record_status: 'published' as const,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          user_id: 'user-1',
          name: 'Place 2',
          category: '카페' as const,
          visit_status: '방문 완료' as const,
          priority: '🔥 최우선' as const,
          record_status: 'draft' as const,
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      ];

      mockServiceInstance.listPlaces.mockResolvedValue({
        data: mockPlaces,
        error: null,
      });

      const { result } = renderHook(() => usePlaces(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockPlaces);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should apply filters when provided', async () => {
      const filters: PlaceFilters = {
        category: '식당',
        visit_status: '미방문',
      };

      mockServiceInstance.listPlaces.mockResolvedValue({
        data: [],
        error: null,
      });

      renderHook(() => usePlaces(filters), { wrapper });

      await waitFor(() => {
        expect(mockServiceInstance.listPlaces).toHaveBeenCalledWith(
          filters,
          expect.any(Number),
          expect.any(Number)
        );
      });
    });

    it('should apply pagination parameters', async () => {
      mockServiceInstance.listPlaces.mockResolvedValue({
        data: [],
        error: null,
      });

      renderHook(() => usePlaces({}, 2, 50), { wrapper });

      await waitFor(() => {
        expect(mockServiceInstance.listPlaces).toHaveBeenCalledWith({}, 2, 50);
      });
    });

    it('should handle errors gracefully', async () => {
      const mockError = { message: 'Failed to fetch places' };

      mockServiceInstance.listPlaces.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const { result } = renderHook(() => usePlaces(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeTruthy();
    });

    it('should have correct query key structure', async () => {
      const filters: PlaceFilters = { category: '식당' };
      const page = 1;
      const pageSize = 20;

      mockServiceInstance.listPlaces.mockResolvedValue({
        data: [],
        error: null,
      });

      renderHook(() => usePlaces(filters, page, pageSize), { wrapper });

      const queryState = queryClient.getQueryState(['places', filters, page, pageSize]);
      expect(queryState).toBeDefined();
    });
  });

  describe('usePlace', () => {
    it('should fetch single place by id', async () => {
      const mockPlace = {
        id: '1',
        user_id: 'user-1',
        name: 'Test Place',
        category: '식당' as const,
        visit_status: '미방문' as const,
        priority: '일반' as const,
        record_status: 'published' as const,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      mockServiceInstance.getPlace.mockResolvedValue({
        data: mockPlace,
        error: null,
      });

      const { result } = renderHook(() => usePlace('1'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockPlace);
      expect(mockServiceInstance.getPlace).toHaveBeenCalledWith('1');
    });

    it('should not fetch when id is undefined', () => {
      const { result } = renderHook(() => usePlace(undefined), { wrapper });

      expect(result.current.data).toBeUndefined();
      expect(mockServiceInstance.getPlace).not.toHaveBeenCalled();
    });

    it('should handle not found error', async () => {
      const mockError = { message: 'Place not found' };

      mockServiceInstance.getPlace.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const { result } = renderHook(() => usePlace('999'), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('useCreatePlace', () => {
    it('should create a new place successfully', async () => {
      const input: CreatePlaceInput = {
        name: 'New Place',
        category: '식당',
      };

      const mockCreatedPlace = {
        id: '1',
        user_id: 'user-1',
        ...input,
        visit_status: '미방문' as const,
        priority: '일반' as const,
        record_status: 'draft' as const,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      mockServiceInstance.createPlace.mockResolvedValue({
        data: mockCreatedPlace,
        error: null,
      });

      const { result } = renderHook(() => useCreatePlace(), { wrapper });

      result.current.mutate(input);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockCreatedPlace);
      expect(mockServiceInstance.createPlace).toHaveBeenCalledWith(input);
    });

    it('should invalidate places query on success', async () => {
      const input: CreatePlaceInput = {
        name: 'New Place',
        category: '식당',
      };

      mockServiceInstance.createPlace.mockResolvedValue({
        data: {} as any,
        error: null,
      });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useCreatePlace(), { wrapper });

      result.current.mutate(input);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['places'],
      });
    });

    it('should handle creation errors', async () => {
      const input: CreatePlaceInput = {
        name: 'New Place',
        category: '식당',
      };

      const mockError = { message: 'Failed to create place' };

      mockServiceInstance.createPlace.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const { result } = renderHook(() => useCreatePlace(), { wrapper });

      result.current.mutate(input);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('useUpdatePlace', () => {
    it('should update a place successfully', async () => {
      const input: UpdatePlaceInput = {
        id: '1',
        name: 'Updated Name',
        visit_status: '방문 완료',
      };

      const mockUpdatedPlace = {
        id: '1',
        user_id: 'user-1',
        name: 'Updated Name',
        category: '식당' as const,
        visit_status: '방문 완료' as const,
        priority: '일반' as const,
        record_status: 'published' as const,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      };

      mockServiceInstance.updatePlace.mockResolvedValue({
        data: mockUpdatedPlace,
        error: null,
      });

      const { result } = renderHook(() => useUpdatePlace(), { wrapper });

      result.current.mutate(input);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockUpdatedPlace);
      expect(mockServiceInstance.updatePlace).toHaveBeenCalledWith(input);
    });

    it('should invalidate relevant queries on success', async () => {
      const input: UpdatePlaceInput = {
        id: '1',
        name: 'Updated',
      };

      mockServiceInstance.updatePlace.mockResolvedValue({
        data: { id: '1' } as any,
        error: null,
      });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useUpdatePlace(), { wrapper });

      result.current.mutate(input);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['places'],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['place', '1'],
      });
    });

    it('should handle update errors', async () => {
      const input: UpdatePlaceInput = {
        id: '1',
        name: 'Updated',
      };

      const mockError = { message: 'Failed to update' };

      mockServiceInstance.updatePlace.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const { result } = renderHook(() => useUpdatePlace(), { wrapper });

      result.current.mutate(input);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('useDeletePlace', () => {
    it('should delete a place successfully', async () => {
      const placeId = '1';

      mockServiceInstance.deletePlace.mockResolvedValue({
        data: null,
        error: null,
      });

      const { result } = renderHook(() => useDeletePlace(), { wrapper });

      result.current.mutate(placeId);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockServiceInstance.deletePlace).toHaveBeenCalledWith(placeId);
    });

    it('should invalidate places queries on success', async () => {
      const placeId = '1';

      mockServiceInstance.deletePlace.mockResolvedValue({
        data: null,
        error: null,
      });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useDeletePlace(), { wrapper });

      result.current.mutate(placeId);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['places'],
      });
    });

    it('should handle deletion errors', async () => {
      const placeId = '1';
      const mockError = { message: 'Failed to delete' };

      mockServiceInstance.deletePlace.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const { result } = renderHook(() => useDeletePlace(), { wrapper });

      result.current.mutate(placeId);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeTruthy();
    });
  });
});
