import type { SupabaseClient } from '@supabase/supabase-js';
import {
  createPlaceInputSchema,
  updatePlaceInputSchema,
  type Place,
  type CreatePlaceInput,
  type UpdatePlaceInput,
  type PlaceFilters,
} from '../types/places';

export class PlacesService {
  constructor(private supabase: SupabaseClient) {}

  async listPlaces(
    filters: PlaceFilters = {},
    page: number = 0,
    pageSize: number = 20
  ): Promise<{ data: Place[] | null; error: any }> {
    try {
      // Get authenticated user
      const {
        data: { user },
        error: authError,
      } = await this.supabase.auth.getUser();

      if (authError || !user) {
        return {
          data: null,
          error: authError || new Error('User not authenticated'),
        };
      }

      // Build query
      let query = this.supabase
        .from('places')
        .select('*')
        .eq('user_id', user.id);

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.visit_status) {
        query = query.eq('visit_status', filters.visit_status);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.record_status) {
        query = query.eq('record_status', filters.record_status);
      }
      if (filters.region_main) {
        query = query.eq('region_main', filters.region_main);
      }
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      // Apply ordering and pagination
      query = query.order('created_at', { ascending: false });

      const start = page * pageSize;
      const end = start + pageSize - 1;
      query = query.range(start, end);

      const { data, error } = await query;

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  async getPlace(
    id: string
  ): Promise<{ data: Place | null; error: any }> {
    try {
      // Get authenticated user
      const {
        data: { user },
        error: authError,
      } = await this.supabase.auth.getUser();

      if (authError || !user) {
        return {
          data: null,
          error: authError || new Error('User not authenticated'),
        };
      }

      const { data, error } = await this.supabase
        .from('places')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  async createPlace(
    input: CreatePlaceInput
  ): Promise<{ data: Place | null; error: any }> {
    try {
      // Validate input
      const validationResult = createPlaceInputSchema.safeParse(input);
      if (!validationResult.success) {
        return {
          data: null,
          error: new Error(
            `Validation failed: ${validationResult.error.message}`
          ),
        };
      }

      // Get authenticated user
      const {
        data: { user },
        error: authError,
      } = await this.supabase.auth.getUser();

      if (authError || !user) {
        return {
          data: null,
          error: authError || new Error('User not authenticated'),
        };
      }

      // Apply defaults from schema
      const validatedInput = validationResult.data;

      const { data, error } = await this.supabase
        .from('places')
        .insert({
          ...validatedInput,
          user_id: user.id,
        })
        .select();

      if (error) {
        return { data: null, error };
      }

      return { data: data[0], error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async updatePlace(
    input: UpdatePlaceInput
  ): Promise<{ data: Place | null; error: any }> {
    try {
      // Validate input
      const validationResult = updatePlaceInputSchema.safeParse(input);
      if (!validationResult.success) {
        return {
          data: null,
          error: new Error(
            `Validation failed: ${validationResult.error.message}`
          ),
        };
      }

      // Get authenticated user
      const {
        data: { user },
        error: authError,
      } = await this.supabase.auth.getUser();

      if (authError || !user) {
        return {
          data: null,
          error: authError || new Error('User not authenticated'),
        };
      }

      const { id, ...updates } = input;

      const { data, error } = await this.supabase
        .from('places')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) {
        return { data: null, error };
      }

      if (!data || data.length === 0) {
        return {
          data: null,
          error: new Error('Place not found or unauthorized'),
        };
      }

      return { data: data[0], error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async deletePlace(id: string): Promise<{ data: null; error: any }> {
    try {
      // Get authenticated user
      const {
        data: { user },
        error: authError,
      } = await this.supabase.auth.getUser();

      if (authError || !user) {
        return {
          data: null,
          error: authError || new Error('User not authenticated'),
        };
      }

      const query = this.supabase
        .from('places')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      const { error } = await query;

      return { data: null, error };
    } catch (error) {
      return { data: null, error };
    }
  }
}
