import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlacesService } from '../../../services/places';
import { supabase } from '../../../lib/supabase';
import type {
  Place,
  CreatePlaceInput,
  UpdatePlaceInput,
  PlaceFilters,
} from '../../../types/places';

const placesService = new PlacesService(supabase);

/**
 * Hook to fetch a list of places with optional filters and pagination
 */
export function usePlaces(
  filters: PlaceFilters = {},
  page: number = 0,
  pageSize: number = 20
) {
  return useQuery({
    queryKey: ['places', filters, page, pageSize],
    queryFn: async () => {
      const { data, error } = await placesService.listPlaces(
        filters,
        page,
        pageSize
      );

      if (error) {
        throw error;
      }

      return data as Place[];
    },
  });
}

/**
 * Hook to fetch a single place by ID
 */
export function usePlace(id: string | undefined) {
  return useQuery({
    queryKey: ['place', id],
    queryFn: async () => {
      if (!id) {
        return null;
      }

      const { data, error } = await placesService.getPlace(id);

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new place
 */
export function useCreatePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePlaceInput) => {
      const { data, error } = await placesService.createPlace(input);

      if (error) {
        throw error;
      }

      return data as Place;
    },
    onSuccess: () => {
      // Invalidate and refetch places list
      queryClient.invalidateQueries({
        queryKey: ['places'],
      });
    },
  });
}

/**
 * Hook to update an existing place
 */
export function useUpdatePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdatePlaceInput) => {
      const { data, error } = await placesService.updatePlace(input);

      if (error) {
        throw error;
      }

      return data as Place;
    },
    onSuccess: (data) => {
      // Invalidate both the places list and the specific place
      queryClient.invalidateQueries({
        queryKey: ['places'],
      });
      queryClient.invalidateQueries({
        queryKey: ['place', data.id],
      });
    },
  });
}

/**
 * Hook to delete a place
 */
export function useDeletePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await placesService.deletePlace(id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate places list
      queryClient.invalidateQueries({
        queryKey: ['places'],
      });
    },
  });
}
