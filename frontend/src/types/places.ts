import { z } from 'zod';

// Export types from database.ts for reuse
export type {
  Category,
  VisitStatus,
  Priority,
  RecordStatus,
  ParkingInfo,
  Place,
  CreatePlaceInput,
  UpdatePlaceInput,
  PlaceFilters,
} from './database';

// Zod schemas for validation
export const categorySchema = z.enum([
  '식당',
  '카페',
  '문화/여가',
  '명소',
  '팝업/축제',
]);

export const visitStatusSchema = z.enum([
  '미방문',
  '방문 완료',
  '재방문 완료',
]);

export const prioritySchema = z.enum([
  '🔥 최우선',
  '✨ 꼭 가볼 곳',
  '일반',
]);

export const recordStatusSchema = z.enum(['draft', 'published']);

export const parkingInfoSchema = z.enum([
  '매장 주차장',
  '주차 지원',
  '인근 공영/유료',
  '주차 불가',
]);

// Place schema
export const placeSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1),
  category: categorySchema,
  visit_status: visitStatusSchema,
  priority: prioritySchema,
  record_status: recordStatusSchema,
  region_main: z.string().optional(),
  region_sub: z.string().optional(),
  address: z.string().optional(),
  operating_hours: z.string().optional(),
  parking_info: parkingInfoSchema.optional(),
  parking_memo: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  memo: z.string().optional(),
  source_url: z.string().url().optional(),
  cover_image_url: z.string().url().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Create place input schema
export const createPlaceInputSchema = z.object({
  name: z.string().min(1),
  category: categorySchema,
  visit_status: visitStatusSchema.default('미방문'),
  priority: prioritySchema.default('일반'),
  record_status: recordStatusSchema.default('draft'),
  region_main: z.string().optional(),
  region_sub: z.string().optional(),
  address: z.string().optional(),
  operating_hours: z.string().optional(),
  parking_info: parkingInfoSchema.optional(),
  parking_memo: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  memo: z.string().optional(),
  source_url: z.string().url().optional(),
  cover_image_url: z.string().url().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

// Update place input schema
export const updatePlaceInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  category: categorySchema.optional(),
  visit_status: visitStatusSchema.optional(),
  priority: prioritySchema.optional(),
  record_status: recordStatusSchema.optional(),
  region_main: z.string().optional(),
  region_sub: z.string().optional(),
  address: z.string().optional(),
  operating_hours: z.string().optional(),
  parking_info: parkingInfoSchema.optional(),
  parking_memo: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  memo: z.string().optional(),
  source_url: z.string().url().optional(),
  cover_image_url: z.string().url().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

// Place filters schema
export const placeFiltersSchema = z.object({
  category: categorySchema.optional(),
  visit_status: visitStatusSchema.optional(),
  priority: prioritySchema.optional(),
  record_status: recordStatusSchema.optional(),
  region_main: z.string().optional(),
  search: z.string().optional(),
});
