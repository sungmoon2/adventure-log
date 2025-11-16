# SPEC-DASHBOARD-006: Implementation Plan

---
**SPEC Metadata:**
- **SPEC ID**: SPEC-DASHBOARD-006
- **Tag**: DASHBOARD-006
- **Owner**: @sungmoon2
- **Status**: Planning
- **Timeline**: 2 Days
- **Complexity**: Medium
- **Priority**: High
---

## 📊 실행 계획 개요

Adventure Log 대시보드 구현을 위한 2일 집중 개발 계획입니다. 우선순위 기반 장소 표시, 통계 위젯, 최근 활동, 빠른 액션 기능을 체계적으로 구현합니다.

## 🎯 전략적 접근

### 핵심 원칙
1. **컴포넌트 우선**: 재사용 가능한 컴포넌트부터 구축
2. **데이터 중심**: Supabase 쿼리 최적화 우선
3. **반응형 설계**: 모바일 퍼스트로 개발
4. **점진적 개선**: MVP 먼저, 그 다음 개선

### 기술 스택 활용
- **Frontend**: React 18 + TypeScript + TailwindCSS
- **State**: Zustand for global state
- **Data Fetching**: TanStack Query + Supabase Client
- **UI Components**: Shadcn/ui + Radix UI
- **Testing**: Vitest + React Testing Library

## 📅 Day 1: 백엔드 & 핵심 컴포넌트

### 🌅 오전 (4시간): 데이터 레이어 & API

#### Milestone 1.1: Supabase 함수 및 쿼리 (2시간)
```sql
-- RPC Function: get_dashboard_data
CREATE OR REPLACE FUNCTION get_dashboard_data(p_user_id UUID)
RETURNS JSON AS $$
BEGIN
  RETURN JSON_BUILD_OBJECT(
    'priorityPlaces', get_priority_places(p_user_id),
    'statistics', get_user_statistics(p_user_id),
    'recentActivities', get_recent_activities(p_user_id),
    'quickStats', get_quick_stats(p_user_id)
  );
END;
$$ LANGUAGE plpgsql;
```

**작업 목록**:
- [ ] `get_priority_places` 함수 작성
- [ ] `get_user_statistics` 함수 작성
- [ ] `get_recent_activities` 함수 작성
- [ ] `get_quick_stats` 함수 작성
- [ ] 인덱스 최적화
- [ ] RLS 정책 검증

#### Milestone 1.2: API 훅 구현 (2시간)
```typescript
// hooks/useDashboard.ts
const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', userId],
    queryFn: () => getDashboardData(userId),
    staleTime: 30000,
    refetchInterval: 60000
  });
};
```

**작업 목록**:
- [ ] `useDashboard` 훅 구현
- [ ] `useRealtimeSubscription` 훅 구현
- [ ] 에러 핸들링 로직
- [ ] 캐싱 전략 수립
- [ ] 타입 정의 완성

### 🌞 오후 (4시간): 우선순위 섹션 & 통계 위젯

#### Milestone 1.3: Priority Section Components (2시간)
```typescript
// components/Dashboard/PrioritySection/
├── MustVisitCards.tsx       // 카드 그리드 레이아웃
├── PriorityCard.tsx         // 개별 카드 컴포넌트
├── SoonToVisitList.tsx      // 리스트 뷰
└── EmptyState.tsx           // 빈 상태 UI
```

**작업 목록**:
- [ ] MustVisitCards 컴포넌트
  - [ ] 반응형 그리드 레이아웃
  - [ ] 이미지 lazy loading
  - [ ] 호버 애니메이션
- [ ] PriorityCard 컴포넌트
  - [ ] 우선순위 배지
  - [ ] 카테고리/지역 태그
  - [ ] 클릭 이벤트 처리
- [ ] SoonToVisitList 컴포넌트
  - [ ] 컴팩트 리스트 뷰
  - [ ] 스와이프 액션 (모바일)
- [ ] EmptyState 온보딩 UI

#### Milestone 1.4: Statistics Widgets (2시간)
```typescript
// components/Dashboard/StatsWidgets/
├── WidgetContainer.tsx      // 공통 위젯 컨테이너
├── TotalPlacesWidget.tsx    // 전체 장소
├── VisitedWidget.tsx        // 방문 완료
├── CategoryWidget.tsx       // 카테고리 차트
└── RegionWidget.tsx         // 지역 분포
```

**작업 목록**:
- [ ] WidgetContainer 공통 컴포넌트
  - [ ] 로딩 상태
  - [ ] 에러 상태
  - [ ] 클릭 가능 영역
- [ ] 개별 위젯 구현
  - [ ] 숫자 애니메이션
  - [ ] 미니 차트 (선택적)
  - [ ] 툴팁 표시
- [ ] 반응형 레이아웃
  - [ ] 모바일: 2x2 그리드
  - [ ] 데스크탑: 1x4 그리드

## 📅 Day 2: 활동 타임라인 & 통합

### 🌅 오전 (4시간): 최근 활동 & 빠른 액션

#### Milestone 2.1: Recent Activity Timeline (2시간)
```typescript
// components/Dashboard/RecentActivity/
├── ActivityTimeline.tsx     // 타임라인 컨테이너
├── ActivityItem.tsx         // 개별 활동 아이템
├── ActivityIcon.tsx         // 활동 타입별 아이콘
└── TimelineLoader.tsx       // 무한 스크롤 로더
```

**작업 목록**:
- [ ] ActivityTimeline 구현
  - [ ] 날짜별 그룹핑
  - [ ] 무한 스크롤
  - [ ] 실시간 업데이트
- [ ] ActivityItem 컴포넌트
  - [ ] 활동 타입별 스타일
  - [ ] 상대 시간 표시
  - [ ] 장소 링크
- [ ] 성능 최적화
  - [ ] Virtual scrolling
  - [ ] Batch updates

#### Milestone 2.2: Quick Actions & FAB (2시간)
```typescript
// components/Dashboard/QuickActions/
├── FloatingActionButton.tsx  // FAB 메인 버튼
├── QuickActionMenu.tsx       // 확장 메뉴
├── QuickAddModal.tsx         // 빠른 추가 모달
└── QuickSearchBar.tsx        // 빠른 검색
```

**작업 목록**:
- [ ] FAB 구현
  - [ ] 위치 고정
  - [ ] 회전 애니메이션
  - [ ] 메뉴 확장/축소
- [ ] Quick Add 모달
  - [ ] URL 입력 폼
  - [ ] 자동 파싱
  - [ ] 즉시 저장
- [ ] Quick Search
  - [ ] 자동완성
  - [ ] 최근 검색어

### 🌞 오후 (4시간): 통합 & 테스트

#### Milestone 2.3: Dashboard Integration (2시간)
```typescript
// pages/Dashboard/index.tsx
const Dashboard = () => {
  const { data, isLoading, error } = useDashboard();

  return (
    <DashboardLayout>
      <PrioritySection data={data?.priorityPlaces} />
      <StatsWidgets data={data?.statistics} />
      <RecentActivity data={data?.recentActivities} />
      <QuickActions />
    </DashboardLayout>
  );
};
```

**작업 목록**:
- [ ] 메인 대시보드 페이지
  - [ ] 레이아웃 구성
  - [ ] 로딩 상태 처리
  - [ ] 에러 바운더리
- [ ] 상태 관리 통합
  - [ ] Zustand store 연결
  - [ ] 실시간 구독 설정
- [ ] 라우팅 설정
  - [ ] 대시보드를 홈으로
  - [ ] 딥링킹 지원

#### Milestone 2.4: Testing & Polish (2시간)
```typescript
// tests/dashboard/
├── Dashboard.test.tsx        // 통합 테스트
├── PrioritySection.test.tsx  // 우선순위 섹션
├── StatsWidgets.test.tsx     // 통계 위젯
└── e2e/dashboard.spec.ts     // E2E 테스트
```

**작업 목록**:
- [ ] 단위 테스트
  - [ ] 컴포넌트 렌더링
  - [ ] 이벤트 처리
  - [ ] 훅 동작
- [ ] 통합 테스트
  - [ ] 데이터 흐름
  - [ ] 상태 변경
- [ ] E2E 테스트
  - [ ] 주요 사용자 시나리오
  - [ ] 성능 벤치마크
- [ ] UI 폴리싱
  - [ ] 애니메이션 미세조정
  - [ ] 다크모드 검증
  - [ ] 접근성 개선

## 🎯 주요 마일스톤

### Day 1 완료 시점
- ✅ 백엔드 API 완성
- ✅ 우선순위 섹션 작동
- ✅ 통계 위젯 표시
- ✅ 기본 레이아웃 완성

### Day 2 완료 시점
- ✅ 최근 활동 타임라인
- ✅ 빠른 액션 기능
- ✅ 전체 통합 완료
- ✅ 테스트 커버리지 90%

## 🚀 기술적 접근 방식

### 아키텍처 결정
1. **컴포넌트 아키텍처**: Atomic Design Pattern
2. **상태 관리**: Local State + Zustand + React Query
3. **스타일링**: TailwindCSS + CSS Modules for complex animations
4. **데이터 페칭**: Supabase Client with React Query

### 성능 최적화 전략
```typescript
// 1. Code Splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));

// 2. Memoization
const MemoizedCard = memo(PriorityCard);

// 3. Virtual Scrolling
<VirtualList items={activities} itemHeight={60} />

// 4. Image Optimization
<img loading="lazy" src={optimizedUrl} />
```

### 코드 품질 기준
- TypeScript strict mode
- ESLint + Prettier
- 90% test coverage
- Lighthouse score > 90

## 🔍 리스크 및 완화 방안

| 리스크 | 영향도 | 완화 방안 |
|--------|--------|-----------|
| Supabase 쿼리 성능 | 높음 | 인덱스 최적화, 캐싱 적극 활용 |
| 실시간 업데이트 부하 | 중간 | Debounce, 배치 업데이트 |
| 모바일 성능 | 중간 | Virtual scrolling, 이미지 최적화 |
| 브라우저 호환성 | 낮음 | Polyfill, 점진적 개선 |

## 📊 검증 기준

### 기능 검증
- [ ] 모든 EARS 요구사항 충족
- [ ] 5초 이내 초기 로딩
- [ ] 실시간 업데이트 1초 이내

### 품질 검증
- [ ] TypeScript 에러 0
- [ ] ESLint 경고 0
- [ ] 테스트 커버리지 90%+
- [ ] Lighthouse 점수 90+

### 사용성 검증
- [ ] 모바일 반응형 완벽
- [ ] 다크모드 지원
- [ ] WCAG 2.1 AA 준수

## 🎬 다음 단계

### 즉시 개선 가능 사항
1. 애니메이션 라이브러리 통합 (Framer Motion)
2. 차트 라이브러리 추가 (Recharts)
3. PWA 지원 추가

### 장기 개선 계획
1. AI 기반 추천 시스템
2. 소셜 공유 기능
3. 고급 분석 대시보드
4. 위젯 커스터마이징

## 📝 참고 자료

### 관련 문서
- [React Query 공식 문서](https://tanstack.com/query/latest)
- [Supabase Realtime 가이드](https://supabase.com/docs/guides/realtime)
- [TailwindCSS 반응형 디자인](https://tailwindcss.com/docs/responsive-design)

### 디자인 레퍼런스
- Material Design Dashboard Patterns
- Ant Design Pro Dashboard Examples
- Vercel Analytics Dashboard

### 코드 예제
- [Priority Queue Implementation](../examples/priority-queue.ts)
- [Real-time Subscription Hook](../examples/realtime-hook.ts)
- [Dashboard Layout Component](../examples/dashboard-layout.tsx)