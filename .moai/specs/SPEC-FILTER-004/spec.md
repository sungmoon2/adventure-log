# SPEC-FILTER-004: 필터링 시스템

## TAG-FILTER-004-001
**Title**: 카테고리, 지역, 방문상태, 우선순위별 필터링 시스템
**Status**: DRAFT
**Priority**: HIGH
**Created**: 2025-11-16
**Author**: spec-builder

## Environment

### 기술 환경
- **Frontend Framework**: React 18+ with TypeScript
- **State Management**: React Query v5 for server state
- **URL Management**: React Router v6 with search params
- **UI Components**: Chip-based filter interface
- **Database**: PostgreSQL with compound indexes

### 비즈니스 환경
- **데이터 규모**: 1000+ 아이템 처리
- **사용자 요구**: 빠른 다중 필터링
- **공유 기능**: URL로 필터 상태 공유 가능
- **접근성**: WCAG 2.1 AA 준수

## Assumptions

### 데이터 구조
- category: 단일 선택 (food, cafe, shopping, entertainment, etc.)
- region_main: 시/도 단위 지역
- region_sub: 구/군 단위 세부 지역
- visit_status: 방문여부 (visited, not_visited, planned)
- priority: 우선순위 (1-5 숫자 또는 high/medium/low)

### 성능 요구사항
- 필터링 응답시간 < 200ms
- 1000+ 아이템 처리 시 UI 블로킹 없음
- 메모리 사용량 최적화

### 사용자 경험
- 칩 기반 인터페이스로 직관적 조작
- 실시간 필터링 결과 업데이트
- 필터 조합 저장 및 공유 가능

## Requirements

### 기능 요구사항

#### FR-001: 카테고리 필터링
**UBIQUITOUS**
- The system SHALL provide category filtering with single selection
- The system SHALL display categories as clickable chips
- The system SHALL highlight selected category chip

**EVENT-DRIVEN**
- WHEN user clicks a category chip, The system SHALL filter items by that category
- WHEN user clicks selected category chip, The system SHALL clear category filter
- WHEN category filter changes, The system SHALL update URL parameters

#### FR-002: 지역 필터링
**UBIQUITOUS**
- The system SHALL provide hierarchical region filtering (main/sub)
- The system SHALL allow multiple region selections
- The system SHALL display selected regions as removable chips

**EVENT-DRIVEN**
- WHEN user selects region_main, The system SHALL load corresponding region_sub options
- WHEN user selects multiple regions, The system SHALL apply OR logic
- WHEN user removes region chip, The system SHALL update filter immediately

**STATE-DRIVEN**
- WHILE region_main is selected, The system SHALL enable region_sub selection
- WHILE no region_main selected, The system SHALL disable region_sub dropdown

#### FR-003: 방문 상태 필터링
**UBIQUITOUS**
- The system SHALL provide visit_status filtering with multiple selection
- The system SHALL display status options: visited, not_visited, planned
- The system SHALL show visit count for each status

**EVENT-DRIVEN**
- WHEN user toggles visit status, The system SHALL update filtered results
- WHEN multiple statuses selected, The system SHALL apply OR logic
- WHEN all statuses deselected, The system SHALL show all items

#### FR-004: 우선순위 필터링
**UBIQUITOUS**
- The system SHALL provide priority range filtering (1-5 or high/medium/low)
- The system SHALL support range selection (e.g., priority 3-5)
- The system SHALL display priority as visual indicator (stars or badges)

**EVENT-DRIVEN**
- WHEN user selects priority range, The system SHALL filter items within range
- WHEN user adjusts range slider, The system SHALL update results in real-time
- WHEN priority filter cleared, The system SHALL show all priorities

#### FR-005: 복합 필터링
**UBIQUITOUS**
- The system SHALL support simultaneous multiple filter types
- The system SHALL apply AND logic between different filter types
- The system SHALL display active filter count badge

**EVENT-DRIVEN**
- WHEN multiple filter types applied, The system SHALL combine with AND logic
- WHEN filter combination results in no items, The system SHALL show empty state
- WHEN user clicks "Clear All", The system SHALL reset all filters

### 비기능 요구사항

#### NFR-001: 성능
**UBIQUITOUS**
- The system SHALL return filtered results within 200ms
- The system SHALL handle 1000+ items without UI lag
- The system SHALL use database indexes for optimization

**UNWANTED BEHAVIOR**
- IF filter processing > 200ms, THEN the system SHALL show loading indicator
- IF memory usage > 100MB, THEN the system SHALL implement pagination
- IF database query > 100ms, THEN the system SHALL optimize indexes

#### NFR-002: 사용성
**UBIQUITOUS**
- The system SHALL provide keyboard navigation for all filters
- The system SHALL maintain filter state during page refresh
- The system SHALL provide filter preset saving

**OPTIONAL**
- WHERE user frequently uses specific filter combination, The system SHALL suggest saving as preset
- WHERE user has saved presets, The system SHALL display quick access buttons

#### NFR-003: 접근성
**UBIQUITOUS**
- The system SHALL provide ARIA labels for all filter controls
- The system SHALL announce filter changes to screen readers
- The system SHALL support keyboard-only operation

## Specifications

### 데이터 모델
```typescript
interface FilterState {
  category?: string;
  regions: {
    main: string[];
    sub: string[];
  };
  visitStatus: VisitStatus[];
  priority: {
    min: number;
    max: number;
  };
}

interface FilterChip {
  id: string;
  type: 'category' | 'region' | 'status' | 'priority';
  label: string;
  value: string | number;
  removable: boolean;
}

interface FilteredResults<T> {
  items: T[];
  totalCount: number;
  appliedFilters: FilterState;
  executionTime: number;
}
```

### API 엔드포인트
```typescript
// GET /api/items/filter
interface FilterRequest {
  category?: string;
  region_main?: string[];
  region_sub?: string[];
  visit_status?: VisitStatus[];
  priority_min?: number;
  priority_max?: number;
  page?: number;
  limit?: number;
}

// Response
interface FilterResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
  filters: {
    applied: FilterState;
    available: AvailableFilters;
  };
  performance: {
    queryTime: number;
    totalTime: number;
  };
}
```

### URL 파라미터 구조
```
/items?category=cafe&region_main=seoul,busan&region_sub=gangnam&visit_status=visited,planned&priority=3-5
```

### 데이터베이스 인덱스
```sql
-- Compound indexes for performance
CREATE INDEX idx_items_category_priority ON items(category, priority);
CREATE INDEX idx_items_region ON items(region_main, region_sub);
CREATE INDEX idx_items_visit_status ON items(visit_status);
CREATE INDEX idx_items_composite ON items(category, region_main, visit_status, priority);
```

### React Query 구현
```typescript
const useFilteredItems = (filters: FilterState) => {
  return useQuery({
    queryKey: ['items', 'filtered', filters],
    queryFn: () => fetchFilteredItems(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData,
  });
};
```

## Constraints

### 기술적 제약
- 브라우저 URL 길이 제한 (2048자)으로 인한 필터 개수 제한
- IndexedDB 사용 시 5MB 스토리지 제한
- 모바일 디바이스에서 메모리 사용량 50MB 이하

### 비즈니스 제약
- 필터 프리셋은 사용자당 최대 10개
- 동시 필터 적용 최대 20개
- 필터링 결과 캐싱 시간 5분

## Dependencies

### 외부 라이브러리
- react-query v5: 서버 상태 관리
- react-router v6: URL 파라미터 관리
- lodash.debounce: 입력 디바운싱
- fuse.js: 클라이언트 사이드 fuzzy 검색 (옵션)

### 내부 의존성
- Component Library: Chip, Dropdown, RangeSlider
- API Client: REST API 통신
- Auth Module: 사용자별 프리셋 저장

## Risks

### 기술적 리스크
- **R001**: 대용량 데이터 필터링 성능 저하
  - Mitigation: 서버 사이드 페이지네이션, 가상 스크롤링
- **R002**: 복잡한 필터 조합으로 인한 쿼리 복잡도
  - Mitigation: 쿼리 최적화, 캐싱 전략

### 비즈니스 리스크
- **R003**: 사용자 필터 프리셋 동기화 실패
  - Mitigation: 로컬 스토리지 백업, 충돌 해결 전략

## Traceability

- **Requirements Source**: Product Requirements Document v2.0
- **Related SPECs**:
  - SPEC-SEARCH-002: 검색 시스템
  - SPEC-UI-003: 칩 컴포넌트 시스템
- **Test Coverage**: TAG-FILTER-004-TEST-*
- **Implementation**: TAG-FILTER-004-IMPL-*