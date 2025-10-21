// 데이터베이스 타입 정의

export type Category = '식당' | '카페' | '문화/여가' | '명소' | '팝업/축제';

export type VisitStatus = '미방문' | '방문 완료' | '재방문 완료';

export type Priority = '🔥 최우선' | '✨ 꼭 가볼 곳' | '일반';

export type RecordStatus = 'draft' | 'published';

export type ParkingInfo = '매장 주차장' | '주차 지원' | '인근 공영/유료' | '주차 불가';

export interface Place {
  id: string;
  user_id: string;
  name: string;
  category: Category;
  visit_status: VisitStatus;
  priority: Priority;
  record_status: RecordStatus;
  region_main?: string;
  region_sub?: string;
  address?: string;
  operating_hours?: string;
  parking_info?: ParkingInfo;
  parking_memo?: string;
  keywords?: string[];
  memo?: string;
  source_url?: string;
  cover_image_url?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePlaceInput {
  name: string;
  category: Category;
  visit_status?: VisitStatus;
  priority?: Priority;
  record_status?: RecordStatus;
  region_main?: string;
  region_sub?: string;
  address?: string;
  operating_hours?: string;
  parking_info?: ParkingInfo;
  parking_memo?: string;
  keywords?: string[];
  memo?: string;
  source_url?: string;
  cover_image_url?: string;
  start_date?: string;
  end_date?: string;
}

export interface UpdatePlaceInput extends Partial<CreatePlaceInput> {
  id: string;
}

export interface PlaceFilters {
  category?: Category;
  visit_status?: VisitStatus;
  priority?: Priority;
  record_status?: RecordStatus;
  region_main?: string;
  search?: string;
}
