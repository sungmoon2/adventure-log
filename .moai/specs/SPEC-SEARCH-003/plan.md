# SPEC-SEARCH-003: Implementation Plan

---
id: SPEC-SEARCH-003
title: 검색 기능 구현 계획서
version: 1.0.0
status: draft
priority: high
created_date: 2025-01-16
tags: [SPEC-SEARCH-003, implementation, timeline, milestones]
---

## Executive Summary

실시간 검색 시스템을 2일간 구현합니다. Day 1은 핵심 검색 로직과 UI 컴포넌트 개발에 집중하고, Day 2는 고급 기능(자동완성, 필터, 키보드 네비게이션)과 최적화에 집중합니다.

## Implementation Timeline

### Day 1: Core Search Implementation (핵심 검색 기능)

#### Phase 1.1: Foundation Setup (2시간)

**목표**: 검색 시스템 기반 구조 설정

**작업 내용**:
1. 패키지 설치 및 설정
   ```bash
   npm install fuse.js@7.0
   npm install @types/fuse.js --save-dev
   npm install use-debounce
   ```

2. Supabase RPC 함수 생성
   ```sql
   -- search_places function
   CREATE OR REPLACE FUNCTION search_places(
     search_query TEXT,
     limit_count INT DEFAULT 50
   )
   RETURNS TABLE(
     id UUID,
     name TEXT,
     keywords TEXT[],
     region_main TEXT,
     region_sub TEXT,
     category TEXT,
     status TEXT,
     rating INT
   )
   LANGUAGE plpgsql
   AS $$
   BEGIN
     RETURN QUERY
     SELECT p.id, p.name, p.keywords, p.region_main, p.region_sub,
            p.category, p.status, p.rating
     FROM places p
     WHERE p.user_id = auth.uid()
       AND (
         p.name ILIKE '%' || search_query || '%'
         OR EXISTS (
           SELECT 1 FROM unnest(p.keywords) AS k
           WHERE k ILIKE '%' || search_query || '%'
         )
         OR p.region_main ILIKE '%' || search_query || '%'
         OR p.region_sub ILIKE '%' || search_query || '%'
       )
     ORDER BY p.created_at DESC
     LIMIT limit_count;
   END;
   $$;
   ```

3. 타입 정의 생성
   ```typescript
   // types/search.types.ts
   export interface SearchResult {
     id: string;
     name: string;
     keywords: string[];
     region_main: string;
     region_sub: string;
     category: PlaceCategory;
     status: PlaceStatus;
     rating?: number;
     score?: number; // Fuse.js relevance score
   }
   ```

#### Phase 1.2: Search Hook Development (3시간)

**목표**: 핵심 검색 로직 구현

**작업 내용**:

1. **useFuseSearch Hook**
   ```typescript
   // hooks/useFuseSearch.ts
   - Fuse.js 인스턴스 초기화
   - 검색 옵션 설정
   - 퍼지 매칭 로직 구현
   - 스코어 기반 정렬
   ```

2. **useSearchQuery Hook**
   ```typescript
   // hooks/useSearchQuery.ts
   - React Query 통합
   - 캐싱 전략 구현
   - 에러 처리
   - 로딩 상태 관리
   ```

3. **useDebounceSearch Hook**
   ```typescript
   // hooks/useDebounceSearch.ts
   - 300ms debounce 구현
   - 이전 요청 취소 로직
   - 최소 2자 검증
   ```

#### Phase 1.3: Core UI Components (3시간)

**목표**: 기본 검색 UI 컴포넌트 개발

**작업 내용**:

1. **SearchInput Component**
   ```typescript
   // components/search/SearchInput.tsx
   - 검색 입력 필드
   - 로딩 인디케이터
   - 클리어 버튼
   - 포커스 관리
   ```

2. **SearchResults Component**
   ```typescript
   // components/search/SearchResults.tsx
   - 결과 목록 렌더링
   - 스코어 기반 하이라이팅
   - 결과 아이템 클릭 처리
   - 빈 결과 상태
   ```

3. **SearchProvider Context**
   ```typescript
   // contexts/SearchContext.tsx
   - 전역 검색 상태 관리
   - 검색 히스토리 관리
   - 결과 선택 처리
   ```

#### Phase 1.4: Basic Testing (2시간)

**목표**: 핵심 기능 테스트

**테스트 케이스**:
1. 검색 입력 debounce 동작 검증
2. 최소 2자 입력 검증
3. 검색 결과 렌더링 검증
4. 캐시 동작 검증
5. 에러 처리 검증

---

### Day 2: Advanced Features & Optimization (고급 기능 및 최적화)

#### Phase 2.1: Search History & localStorage (2시간)

**목표**: 검색 히스토리 기능 구현

**작업 내용**:

1. **useSearchHistory Hook**
   ```typescript
   // hooks/useSearchHistory.ts
   - localStorage 읽기/쓰기
   - 히스토리 추가/삭제
   - 최대 10개 유지 (FIFO)
   - 타임스탬프 관리
   ```

2. **SearchHistory Component**
   ```typescript
   // components/search/SearchHistory.tsx
   - 최근 검색어 표시
   - 히스토리 아이템 클릭
   - 개별 삭제 버튼
   - 전체 삭제 옵션
   ```

#### Phase 2.2: AutoComplete & Suggestions (3시간)

**목표**: 자동완성 및 제안 기능

**작업 내용**:

1. **AutoComplete Component**
   ```typescript
   // components/search/AutoComplete.tsx
   - 드롭다운 UI
   - 최근 검색어 섹션
   - 인기 검색어 섹션
   - 실시간 제안어
   ```

2. **useSuggestions Hook**
   ```typescript
   // hooks/useSuggestions.ts
   - 제안어 생성 로직
   - 인기 키워드 집계
   - 유사 검색어 추출
   ```

#### Phase 2.3: Filters & Keyboard Navigation (2시간)

**목표**: 검색 필터 및 키보드 제어

**작업 내용**:

1. **SearchFilters Component**
   ```typescript
   // components/search/SearchFilters.tsx
   - 카테고리 필터
   - 상태 필터
   - 평점 필터
   - 지역 필터
   ```

2. **useKeyboardNavigation Hook**
   ```typescript
   // hooks/useKeyboardNavigation.ts
   - 화살표 키 네비게이션
   - Enter/Esc 키 처리
   - 포커스 트랩
   - 접근성 ARIA 속성
   ```

#### Phase 2.4: Performance Optimization (2시간)

**목표**: 성능 최적화 및 모니터링

**작업 내용**:

1. **성능 최적화**
   - React.memo 적용
   - useMemo/useCallback 최적화
   - 가상 스크롤링 (50+ 결과)
   - 이미지 lazy loading

2. **검색 메트릭스**
   ```typescript
   // utils/searchMetrics.ts
   - 응답 시간 측정
   - 캐시 히트율 계산
   - 사용 패턴 분석
   - 성능 로깅
   ```

#### Phase 2.5: Integration Testing (1시간)

**목표**: 통합 테스트 및 E2E 테스트

**테스트 시나리오**:
1. 전체 검색 플로우 테스트
2. 필터 조합 테스트
3. 키보드 네비게이션 테스트
4. 모바일 반응형 테스트
5. 성능 벤치마크 테스트

## Technical Architecture

### Component Tree

```
SearchContainer
├── SearchInput
│   ├── InputField
│   ├── LoadingSpinner
│   └── ClearButton
├── AutoComplete
│   ├── RecentSearches
│   ├── PopularSearches
│   └── Suggestions
├── SearchFilters
│   ├── CategoryFilter
│   ├── StatusFilter
│   ├── RatingFilter
│   └── RegionFilter
├── SearchResults
│   ├── ResultsList
│   ├── ResultItem
│   └── EmptyState
└── SearchMetrics (hidden)
```

### Data Flow

```
User Input → Debounce → Query Validation → Cache Check
                                              ↓
                                         Cache Hit?
                                         Yes ↓  No ↓
                                    Return Cached  Fetch Data
                                              ↓
                                         Fuse.js Processing
                                              ↓
                                         Apply Filters
                                              ↓
                                         Update UI
                                              ↓
                                    Save to History (on select)
```

## Risk Mitigation Strategies

### Risk 1: Performance with Large Datasets

**Mitigation**:
- 서버 사이드 초기 필터링 (RPC)
- 클라이언트 50개 제한
- 가상 스크롤링 구현
- 점진적 로딩

### Risk 2: Korean Fuzzy Matching Accuracy

**Mitigation**:
- 초성 검색 알고리즘 추가
- 커스텀 한글 토크나이저
- 동의어 사전 구축
- 사용자 피드백 수집

### Risk 3: Mobile Performance

**Mitigation**:
- 터치 최적화 디바운스 (500ms)
- 모바일 전용 UI 간소화
- 제스처 기반 네비게이션
- 결과 수 제한 (20개)

## Testing Strategy

### Unit Tests (Coverage Target: 95%)

```typescript
// 각 Hook에 대한 단위 테스트
describe('useFuseSearch', () => {
  test('should return fuzzy matched results');
  test('should apply correct weights');
  test('should handle empty queries');
});

describe('useSearchQuery', () => {
  test('should cache results');
  test('should invalidate stale data');
  test('should handle errors');
});
```

### Integration Tests

```typescript
// 컴포넌트 통합 테스트
describe('Search Flow', () => {
  test('complete search interaction');
  test('filter application');
  test('keyboard navigation');
});
```

### E2E Tests

```typescript
// Playwright E2E 테스트
test('user can search and select a place', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="search-input"]', '강남');
  await page.waitForSelector('[data-testid="search-results"]');
  await page.click('[data-testid="result-item-0"]');
  // Verify navigation
});
```

## Deliverables Checklist

### Day 1 Deliverables
- [ ] Supabase RPC function deployed
- [ ] Core search hooks implemented
- [ ] Basic UI components working
- [ ] Debounce and caching functional
- [ ] Basic tests passing (>80% coverage)

### Day 2 Deliverables
- [ ] Search history functional
- [ ] AutoComplete working
- [ ] Filters applied correctly
- [ ] Keyboard navigation smooth
- [ ] Performance optimized (<200ms)
- [ ] All tests passing (>90% coverage)

## Success Metrics

1. **Performance**
   - Search response: <200ms (cached)
   - First search: <500ms
   - AutoComplete: <100ms

2. **Quality**
   - Test coverage: >90%
   - No critical bugs
   - Accessibility: WCAG 2.1 AA

3. **User Experience**
   - Intuitive interface
   - Mobile responsive
   - Keyboard accessible

## Dependencies & Blockers

### Dependencies
- ✅ SPEC-LOGIN-001: Authentication (Complete)
- ✅ SPEC-PLACES-002: CRUD System (Complete)
- ⏳ Supabase RPC function deployment

### Potential Blockers
- Supabase rate limiting
- Fuse.js Korean language support
- React Query cache synchronization

## Notes for Implementation

1. **Start with mobile-first design** - 대부분 사용자가 모바일
2. **Implement progressive enhancement** - 기본 기능 먼저, 고급 기능 추가
3. **Focus on perceived performance** - 스켈레톤 로딩, 낙관적 업데이트
4. **Consider accessibility from start** - ARIA labels, keyboard support
5. **Document as you code** - JSDoc comments, README updates

## Next Steps After Completion

1. **Performance Monitoring** - 실사용 데이터 수집
2. **User Feedback** - 검색 경험 개선점 파악
3. **AI Integration Prep** - 검색 패턴 분석 for SPEC-AI-005
4. **Map Integration** - SPEC-MAP-004와 연동
5. **Voice Search** - Phase 2 음성 검색 준비