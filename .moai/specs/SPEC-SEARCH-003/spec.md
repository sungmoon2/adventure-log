# SPEC-SEARCH-003: 실시간 검색 시스템

---
id: SPEC-SEARCH-003
title: 검색 기능 - 장소 이름, 키워드, 지역별 실시간 검색
version: 1.0.0
status: draft
priority: high
created_date: 2025-01-16
tags: [search, real-time, fuzzy-matching, autocomplete, react-query, fuse.js]
---

## Executive Summary

Adventure Log 애플리케이션의 핵심 사용자 경험인 실시간 검색 기능을 구현합니다. 사용자가 장소 이름, 키워드, 지역을 기준으로 빠르고 직관적으로 원하는 맛집을 찾을 수 있도록 하며, Fuse.js를 통한 퍼지 매칭, React Query를 통한 효율적인 캐싱, 그리고 자동완성 기능을 제공합니다.

## EARS Format Specification

### Environment

> **시스템 운영 환경과 제약 사항**

- **기술 스택**:
  - React 19, TypeScript 5.6
  - React Query 5.63 (캐싱 및 상태 관리)
  - Fuse.js 7.0 (퍼지 검색)
  - Supabase Client 2.47 (데이터 페칭)
- **데이터베이스**: PostgreSQL with places table
  - Fields: name (text), keywords (text[]), region_main (text), region_sub (text)
  - Full-text search indexes configured
- **성능 목표**:
  - 검색 응답: < 200ms (캐시된 결과)
  - 첫 검색: < 500ms (DB 쿼리)
  - 자동완성: < 100ms
  - Debounce: 300ms
- **UX 요구사항**:
  - 최소 2자 이상 입력시 검색 시작
  - 실시간 검색 결과 표시
  - 검색 히스토리 최대 10개 저장
  - 키보드 네비게이션 지원 (↑↓ Enter Esc)

### Assumptions

> **개발 전제 조건과 가정 사항**

- SPEC-LOGIN-001 인증 시스템 구현 완료
- SPEC-PLACES-002 CRUD 시스템 구현 완료
- places 테이블에 충분한 데이터 존재 (10+ records)
- 사용자별 검색 히스토리는 localStorage에 저장
- 검색 결과는 최대 50개까지만 표시
- 모바일 환경에서도 동일한 UX 제공
- 한글/영문 모두 퍼지 매칭 지원

### Requirements

> **기능 요구사항 (EARS Event-Driven Format)**

#### R1. 실시간 검색 트리거 (EVENT-DRIVEN)

**WHEN** 사용자가 검색 입력창에 2자 이상 입력
**The system SHALL** 300ms debounce 후 검색 실행
**AND** 이전 검색 요청이 있다면 취소
**AND** 로딩 인디케이터 표시

#### R2. 다중 필드 검색 (UBIQUITOUS)

**The system SHALL** 다음 필드를 동시에 검색:
- 장소 이름 (name) - 가중치 1.0
- 키워드 배열 (keywords[]) - 가중치 0.8
- 메인 지역 (region_main) - 가중치 0.6
- 서브 지역 (region_sub) - 가중치 0.4

#### R3. 퍼지 매칭 (STATE-DRIVEN)

**WHILE** 검색이 진행 중
**The system SHALL** Fuse.js를 사용하여:
- threshold: 0.4 (40% 유사도)
- minMatchCharLength: 2
- includeScore: true (관련도 점수 포함)
- 오타 허용 및 유사 단어 매칭

#### R4. 검색 결과 캐싱 (UBIQUITOUS)

**The system SHALL** React Query를 사용하여:
- 검색 결과 5분간 캐싱 (staleTime: 5min)
- 백그라운드 재검증 (cacheTime: 10min)
- 동일 검색어는 즉시 캐시 반환

#### R5. 자동완성 제안 (OPTIONAL)

**WHERE** 사용자가 검색 입력창에 포커스
**The system SHALL** 다음을 표시:
- 최근 검색어 (최대 5개)
- 인기 검색어 (최대 5개)
- 입력 중 매칭되는 제안어

#### R6. 검색 히스토리 관리 (EVENT-DRIVEN)

**WHEN** 사용자가 검색 결과 클릭 또는 Enter 입력
**The system SHALL** localStorage에 저장:
- 검색어
- 타임스탬프
- 선택한 결과 (있는 경우)
- 최대 10개 유지 (FIFO)

#### R7. 빈 결과 처리 (UNWANTED BEHAVIOR)

**IF** 검색 결과가 없음
**THEN the system SHALL**:
- "검색 결과가 없습니다" 메시지 표시
- 유사한 검색어 제안 (있는 경우)
- 새 장소 추가 버튼 표시

#### R8. 검색 필터 적용 (OPTIONAL)

**WHERE** 사용자가 필터 옵션 선택
**The system SHALL** 추가 필터링:
- 카테고리별 (한식/중식/일식/양식/기타)
- 방문 상태별 (방문 예정/방문 완료)
- 평점별 (별점 기준)
- 지역별 (region_main 그룹핑)

#### R9. 키보드 네비게이션 (STATE-DRIVEN)

**WHILE** 검색 결과가 표시됨
**The system SHALL** 키보드 제어:
- ↓: 다음 결과로 이동
- ↑: 이전 결과로 이동
- Enter: 선택된 결과로 이동
- Esc: 검색 결과 닫기

#### R10. 검색 성능 모니터링 (UBIQUITOUS)

**The system SHALL** 추적:
- 검색 응답 시간
- 캐시 히트율
- 사용자 검색 패턴
- 인기 검색어 통계

### Specifications

> **상세 기술 사양**

#### S1. 검색 컴포넌트 구조

```typescript
interface SearchComponentProps {
  onResultSelect: (place: Place) => void;
  placeholder?: string;
  autoFocus?: boolean;
  maxResults?: number;
}

interface SearchState {
  query: string;
  results: Place[];
  isLoading: boolean;
  suggestions: string[];
  selectedIndex: number;
}
```

#### S2. Fuse.js 설정

```typescript
const fuseOptions = {
  keys: [
    { name: 'name', weight: 1.0 },
    { name: 'keywords', weight: 0.8 },
    { name: 'region_main', weight: 0.6 },
    { name: 'region_sub', weight: 0.4 }
  ],
  threshold: 0.4,
  minMatchCharLength: 2,
  includeScore: true,
  useExtendedSearch: true
};
```

#### S3. React Query 설정

```typescript
const searchQueryOptions = {
  queryKey: ['search', query],
  queryFn: () => searchPlaces(query),
  staleTime: 5 * 60 * 1000, // 5분
  cacheTime: 10 * 60 * 1000, // 10분
  enabled: query.length >= 2
};
```

#### S4. localStorage 구조

```typescript
interface SearchHistory {
  query: string;
  timestamp: string;
  selectedResult?: {
    id: string;
    name: string;
  };
}

// Key: 'adventure-log-search-history'
// Value: SearchHistory[] (max 10)
```

#### S5. 검색 API 엔드포인트

```typescript
// Supabase RPC function
async function searchPlaces(query: string): Promise<Place[]> {
  const { data, error } = await supabase
    .rpc('search_places', {
      search_query: query,
      limit: 50
    });

  if (error) throw error;
  return data;
}
```

## Traceability Matrix

| Requirement | Implementation | Test Case | Documentation |
|-------------|---------------|-----------|---------------|
| R1 | SearchInput.tsx | TC01-TC03 | API.md#search |
| R2 | useFuseSearch.ts | TC04-TC06 | SEARCH.md |
| R3 | FuseProvider.tsx | TC07-TC09 | FUZZY.md |
| R4 | useSearchQuery.ts | TC10-TC12 | CACHE.md |
| R5 | AutoComplete.tsx | TC13-TC15 | UI.md#autocomplete |
| R6 | useSearchHistory.ts | TC16-TC18 | STORAGE.md |
| R7 | EmptyResults.tsx | TC19-TC20 | UI.md#empty |
| R8 | SearchFilters.tsx | TC21-TC23 | FILTER.md |
| R9 | useKeyboardNav.ts | TC24-TC26 | KEYBOARD.md |
| R10 | SearchMetrics.ts | TC27-TC28 | METRICS.md |

## Dependencies

- **Upstream**: SPEC-LOGIN-001 (인증), SPEC-PLACES-002 (데이터)
- **Downstream**: SPEC-MAP-004 (지도 연동), SPEC-AI-005 (추천)
- **External**: Fuse.js, React Query, Supabase

## Success Criteria

1. ✅ 검색 응답 시간 < 200ms (캐시)
2. ✅ 퍼지 매칭 정확도 > 85%
3. ✅ 사용자 만족도 > 90%
4. ✅ 테스트 커버리지 > 90%
5. ✅ 모바일 호환성 100%

## Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| 대용량 데이터 성능 저하 | High | 페이지네이션, 인덱싱, 가상 스크롤 |
| 한글 퍼지 매칭 부정확 | Medium | 초성 검색 추가, 커스텀 토크나이저 |
| 캐시 동기화 문제 | Low | 수동 무효화, 백그라운드 재검증 |

## Notes

- Fuse.js는 클라이언트 사이드 검색에 최적화
- 대용량 데이터(1000+)의 경우 서버 사이드 검색 고려
- 검색 분석 데이터는 향후 AI 추천에 활용
- Phase 2에서 음성 검색 기능 추가 예정