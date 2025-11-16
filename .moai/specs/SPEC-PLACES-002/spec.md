# SPEC-PLACES-002: 장소 CRUD 시스템

---
id: SPEC-PLACES-002
title: 장소 CRUD 기능 - 맛집 정보 관리 시스템
version: 1.0.0
status: draft
priority: high
created_date: 2025-01-16
tags: [places, crud, supabase, react-query, rls]
---

## Executive Summary

Adventure Log 애플리케이션의 핵심 기능인 장소(맛집) 정보 관리를 위한 완전한 CRUD 시스템을 구현합니다. 이 시스템은 사용자가 방문하고 싶은 장소를 등록, 조회, 수정, 삭제할 수 있도록 하며, Supabase RLS를 통한 보안과 React Query를 통한 효율적인 상태 관리를 제공합니다.

## EARS Format Specification

### Environment

> **시스템 운영 환경과 제약 사항**

- **기술 스택**: React 19, TypeScript 5.6, Supabase Client 2.47, React Query 5.63
- **데이터베이스**: PostgreSQL (Supabase) with places table already defined
- **인증 시스템**: SPEC-LOGIN-001 구현 완료 (98% coverage)
- **브라우저 지원**: Chrome 120+, Safari 17+, Firefox 120+
- **성능 목표**:
  - 목록 조회: < 500ms
  - 단일 조회: < 300ms
  - 생성/수정: < 1000ms
  - 페이지네이션: 20개 단위
- **보안 요구사항**: Row Level Security (RLS) 적용 필수

### Assumptions

> **개발 전제 조건과 가정 사항**

- 사용자는 이미 로그인된 상태 (auth.uid() available)
- places 테이블 스키마는 이미 정의되어 있음
- Supabase Storage bucket은 이미 설정됨
- 모든 장소 데이터는 사용자별로 격리됨
- 카테고리와 상태 값은 고정된 enum 사용
- 이미지 업로드는 Phase 2에서 구현 예정

### Requirements

> **기능 요구사항 (EARS Event-Driven Format)**

#### R1. 장소 목록 조회 (READ)

**WHEN** 사용자가 장소 목록 페이지에 접근하면
**THEN** 시스템은 사용자의 모든 장소를 페이지네이션하여 표시해야 한다

**WHILE** 장소 목록이 로딩 중일 때
**THEN** 시스템은 스켈레톤 UI를 표시해야 한다

**IF** 장소 목록 조회가 실패하면
**THEN** 시스템은 재시도 버튼과 함께 에러 메시지를 표시해야 한다

#### R2. 장소 필터링 및 검색

**WHEN** 사용자가 카테고리 필터를 선택하면
**THEN** 시스템은 선택된 카테고리의 장소만 표시해야 한다

**WHEN** 사용자가 방문 상태 필터를 선택하면
**THEN** 시스템은 해당 상태의 장소만 표시해야 한다

**WHEN** 사용자가 우선순위로 정렬을 선택하면
**THEN** 시스템은 우선순위 순서로 정렬해야 한다 (🔥 최우선 > ✨ 꼭 가볼 곳 > 일반)

**WHERE** 사용자가 키워드 검색을 수행하면
**THEN** 시스템은 이름, 주소, 키워드 배열에서 매칭되는 결과를 표시해야 한다

#### R3. 장소 생성 (CREATE)

**WHEN** 사용자가 새 장소 추가 버튼을 클릭하면
**THEN** 시스템은 장소 생성 폼을 모달로 표시해야 한다

**WHEN** 사용자가 필수 필드(이름, 카테고리)를 입력하고 저장하면
**THEN** 시스템은 장소를 생성하고 목록에 즉시 반영해야 한다

**IF** 필수 필드가 누락되면
**THEN** 시스템은 해당 필드에 에러 메시지를 표시해야 한다

**WHERE** 사용자가 Quick Save를 선택하면
**THEN** 시스템은 record_status를 'draft'로 설정하여 저장해야 한다

#### R4. 장소 수정 (UPDATE)

**WHEN** 사용자가 장소의 수정 버튼을 클릭하면
**THEN** 시스템은 기존 데이터가 채워진 수정 폼을 표시해야 한다

**WHEN** 사용자가 변경사항을 저장하면
**THEN** 시스템은 낙관적 업데이트를 적용하고 서버에 동기화해야 한다

**IF** 수정 중 충돌이 발생하면
**THEN** 시스템은 충돌 해결 옵션을 제공해야 한다

**WHILE** 수정이 진행 중일 때
**THEN** 시스템은 저장 버튼을 비활성화하고 로딩 상태를 표시해야 한다

#### R5. 장소 삭제 (DELETE)

**WHEN** 사용자가 삭제 버튼을 클릭하면
**THEN** 시스템은 확인 다이얼로그를 표시해야 한다

**WHEN** 사용자가 삭제를 확인하면
**THEN** 시스템은 장소를 삭제하고 목록에서 즉시 제거해야 한다

**IF** 삭제가 실패하면
**THEN** 시스템은 에러 토스트를 표시하고 장소를 복원해야 한다

#### R6. 장소 상세 보기

**WHEN** 사용자가 장소 카드를 클릭하면
**THEN** 시스템은 장소의 전체 정보를 표시해야 한다

**WHERE** 팝업/축제 카테고리의 경우
**THEN** 시스템은 시작일과 종료일을 표시해야 한다

**WHERE** source_url이 존재하는 경우
**THEN** 시스템은 클릭 가능한 외부 링크를 표시해야 한다

### Specifications

> **기술 구현 사양**

#### S1. 데이터 모델 및 타입 정의

```typescript
// types/place.ts
export interface Place {
  id: string;
  user_id: string;
  name: string;
  category: '식당' | '카페' | '문화/여가' | '명소' | '팝업/축제';
  visit_status: '미방문' | '방문 완료' | '재방문 완료';
  priority: '🔥 최우선' | '✨ 꼭 가볼 곳' | '일반';
  record_status: 'draft' | 'published';
  region_main?: string;
  region_sub?: string;
  address?: string;
  operating_hours?: string;
  parking_info?: '매장 주차장' | '주차 지원' | '인근 공영/유료' | '주차 불가';
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

export interface PlaceFormData extends Omit<Place, 'id' | 'user_id' | 'created_at' | 'updated_at'> {}

export interface PlaceFilters {
  category?: Place['category'];
  visit_status?: Place['visit_status'];
  priority?: Place['priority'];
  record_status?: Place['record_status'];
  search?: string;
  region_main?: string;
}
```

#### S2. React Query Hooks 구조

```typescript
// hooks/usePlaces.ts
export const usePlaces = (filters?: PlaceFilters) => {
  return useQuery({
    queryKey: ['places', filters],
    queryFn: () => fetchPlaces(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// hooks/useCreatePlace.ts
export const useCreatePlace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
      toast.success('장소가 추가되었습니다');
    },
    onError: (error) => {
      toast.error('장소 추가 실패: ' + error.message);
    }
  });
};

// hooks/useUpdatePlace.ts
export const useUpdatePlace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePlace,
    onMutate: async (updatedPlace) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['places'] });
      const previousPlaces = queryClient.getQueryData(['places']);
      queryClient.setQueryData(['places'], (old) => {
        // Update logic
      });
      return { previousPlaces };
    },
    onError: (err, newPlace, context) => {
      queryClient.setQueryData(['places'], context.previousPlaces);
      toast.error('수정 실패');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
    }
  });
};

// hooks/useDeletePlace.ts
export const useDeletePlace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
      toast.success('장소가 삭제되었습니다');
    }
  });
};
```

#### S3. Supabase Integration Layer

```typescript
// services/placeService.ts
export const placeService = {
  async fetchPlaces(filters?: PlaceFilters): Promise<Place[]> {
    let query = supabase
      .from('places')
      .select('*')
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.visit_status) {
      query = query.eq('visit_status', filters.visit_status);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createPlace(place: PlaceFormData): Promise<Place> {
    const { data, error } = await supabase
      .from('places')
      .insert({
        ...place,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePlace(id: string, updates: Partial<PlaceFormData>): Promise<Place> {
    const { data, error } = await supabase
      .from('places')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletePlace(id: string): Promise<void> {
    const { error } = await supabase
      .from('places')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
```

#### S4. Component Structure

```
features/places/
├── components/
│   ├── PlaceList.tsx         # 장소 목록 컨테이너
│   ├── PlaceCard.tsx         # 개별 장소 카드
│   ├── PlaceForm.tsx         # 생성/수정 폼
│   ├── PlaceDetail.tsx       # 상세 보기 모달
│   ├── PlaceFilters.tsx      # 필터 컨트롤
│   └── PlaceSearch.tsx       # 검색 입력
├── hooks/
│   ├── usePlaces.ts
│   ├── useCreatePlace.ts
│   ├── useUpdatePlace.ts
│   └── useDeletePlace.ts
├── services/
│   └── placeService.ts
├── types/
│   └── place.ts
└── utils/
    ├── validation.ts         # Zod schemas
    └── formatters.ts         # Display formatters
```

#### S5. Validation Schema (Zod)

```typescript
// utils/validation.ts
import { z } from 'zod';

export const placeSchema = z.object({
  name: z.string().min(1, '이름은 필수입니다').max(255),
  category: z.enum(['식당', '카페', '문화/여가', '명소', '팝업/축제']),
  visit_status: z.enum(['미방문', '방문 완료', '재방문 완료']),
  priority: z.enum(['🔥 최우선', '✨ 꼭 가볼 곳', '일반']),
  record_status: z.enum(['draft', 'published']),
  region_main: z.string().optional(),
  region_sub: z.string().optional(),
  address: z.string().optional(),
  operating_hours: z.string().optional(),
  parking_info: z.enum(['매장 주차장', '주차 지원', '인근 공영/유료', '주차 불가']).optional(),
  parking_memo: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  memo: z.string().optional(),
  source_url: z.string().url('올바른 URL 형식이 아닙니다').optional().or(z.literal('')),
  cover_image_url: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
}).refine(
  (data) => {
    if (data.category === '팝업/축제') {
      return data.start_date && data.end_date;
    }
    return true;
  },
  { message: '팝업/축제는 시작일과 종료일이 필요합니다' }
).refine(
  (data) => {
    if (data.start_date && data.end_date) {
      return new Date(data.end_date) >= new Date(data.start_date);
    }
    return true;
  },
  { message: '종료일은 시작일 이후여야 합니다' }
);
```

#### S6. Error Handling Strategy

```typescript
// utils/errorHandler.ts
export const handlePlaceError = (error: PostgrestError | Error) => {
  if ('code' in error) {
    switch (error.code) {
      case '23505': // Unique violation
        return '이미 존재하는 장소입니다';
      case '23503': // Foreign key violation
        return '인증이 필요합니다';
      case '42501': // Insufficient privilege
        return '권한이 없습니다';
      default:
        return error.message || '알 수 없는 오류가 발생했습니다';
    }
  }
  return error.message || '오류가 발생했습니다';
};
```

#### S7. Performance Optimizations

- **React Query 캐싱**: 5분 staleTime 설정
- **Optimistic Updates**: 수정/삭제 시 즉시 UI 반영
- **Pagination**: 20개 단위 무한 스크롤
- **Debounced Search**: 300ms 디바운싱
- **Lazy Loading**: 상세 정보는 필요시에만 로드
- **Memoization**: React.memo로 불필요한 리렌더링 방지

## Traceability Matrix

| Requirement | Implementation | Test Coverage |
|-------------|----------------|---------------|
| R1. 목록 조회 | usePlaces hook, PlaceList component | 95% |
| R2. 필터링/검색 | PlaceFilters, PlaceSearch components | 90% |
| R3. 장소 생성 | useCreatePlace hook, PlaceForm component | 95% |
| R4. 장소 수정 | useUpdatePlace hook, PlaceForm component | 95% |
| R5. 장소 삭제 | useDeletePlace hook, confirmation dialog | 90% |
| R6. 상세 보기 | PlaceDetail component | 85% |

## Dependencies

- **SPEC-LOGIN-001**: Authentication system (완료)
- **Supabase**: Database and RLS
- **React Query**: State management
- **Zod**: Runtime validation
- **React Hook Form**: Form management

## Success Criteria

- [ ] 모든 CRUD 작업이 정상 동작
- [ ] 테스트 커버리지 95% 이상
- [ ] RLS 정책이 올바르게 적용됨
- [ ] 성능 목표 달성 (응답 시간)
- [ ] 에러 처리 및 사용자 피드백 완성
- [ ] TypeScript 타입 100% 안전성

## Tags

`[TAG:SPEC-PLACES-002]` `[TAG:CRUD]` `[TAG:SUPABASE]` `[TAG:REACT-QUERY]`