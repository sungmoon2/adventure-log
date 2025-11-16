# SPEC-DASHBOARD-006: 대시보드 - 우선순위 기반 장소 표시 및 통계

---
**SPEC Metadata:**
- **SPEC ID**: SPEC-DASHBOARD-006
- **Tag**: DASHBOARD-006
- **Owner**: @sungmoon2
- **Status**: Draft
- **Created**: 2025-11-16
- **Updated**: 2025-11-16
- **Version**: 1.0.0
---

## 📋 개요

Adventure Log 애플리케이션의 메인 대시보드를 구현하여 사용자가 우선순위 기반으로 장소를 한눈에 파악하고, 주요 통계 정보를 시각적으로 확인할 수 있도록 합니다. 대시보드는 사용자의 첫 화면이며, 가장 중요한 정보를 효과적으로 전달하는 역할을 수행합니다.

## 🎯 목표

### 비즈니스 목표
- 사용자가 다음 방문할 장소를 빠르게 결정할 수 있도록 지원
- 전체 장소 현황을 한눈에 파악할 수 있는 통계 제공
- 최근 활동을 추적하여 사용 패턴 분석 지원
- 주요 기능에 대한 빠른 접근 경로 제공

### 기술적 목표
- 실시간 데이터 동기화로 항상 최신 정보 표시
- 반응형 디자인으로 모바일/데스크탑 완벽 지원
- 효율적인 쿼리로 빠른 로딩 속도 보장
- 컴포넌트 재사용성을 고려한 모듈화 설계

## 📐 EARS 사양 (EARS Specifications)

### Environment (환경)

> **ENV-001**: 시스템은 React 18 + TypeScript 환경에서 작동해야 한다
> **ENV-002**: 시스템은 Supabase PostgreSQL 데이터베이스와 통신해야 한다
> **ENV-003**: 시스템은 Chrome, Safari, Firefox, Edge 최신 버전을 지원해야 한다
> **ENV-004**: 시스템은 모바일(320px)부터 데스크탑(1920px)까지 반응형을 지원해야 한다
> **ENV-005**: 시스템은 한국어 인터페이스를 기본으로 제공해야 한다

### Assumptions (가정)

> **ASM-001**: 사용자는 이미 Google OAuth로 로그인된 상태이다
> **ASM-002**: 사용자는 최소 1개 이상의 장소를 등록했다
> **ASM-003**: 우선순위는 1(높음)부터 5(낮음)까지의 숫자로 표현된다
> **ASM-004**: 통계 데이터는 사용자별로 독립적으로 계산된다
> **ASM-005**: 대시보드는 애플리케이션 로그인 후 첫 화면이다

### Requirements (요구사항)

#### Ubiquitous Requirements (항상 적용)

> **UBQ-001**: 시스템은 우선순위 1-2 장소를 "Must Visit" 섹션에 표시해야 한다
> **UBQ-002**: 시스템은 전체 통계를 4개의 주요 위젯으로 표시해야 한다
> **UBQ-003**: 시스템은 최근 7일간의 활동을 타임라인으로 표시해야 한다
> **UBQ-004**: 시스템은 빠른 액션 버튼을 우측 하단에 고정 표시해야 한다
> **UBQ-005**: 시스템은 5초 이내에 대시보드를 완전히 렌더링해야 한다

#### Event-Driven Requirements (이벤트 기반)

> **WHEN** 사용자가 대시보드에 접속하면
> **THEN** 시스템은 사용자의 모든 장소 데이터를 로드해야 한다

> **WHEN** 사용자가 우선순위 카드를 클릭하면
> **THEN** 시스템은 해당 장소의 상세 페이지로 이동해야 한다

> **WHEN** 사용자가 통계 위젯을 클릭하면
> **THEN** 시스템은 해당 카테고리의 필터링된 목록을 표시해야 한다

> **WHEN** 새로운 장소가 추가되면
> **THEN** 시스템은 실시간으로 대시보드 데이터를 업데이트해야 한다

> **WHEN** 사용자가 빠른 추가 버튼을 클릭하면
> **THEN** 시스템은 Quick Save 모달을 표시해야 한다

#### Unwanted Behavior Prevention (오류 방지)

> **IF** 사용자에게 등록된 장소가 없으면
> **THEN** 시스템은 온보딩 가이드를 표시해야 한다

> **IF** 데이터 로딩이 3초 이상 걸리면
> **THEN** 시스템은 스켈레톤 UI를 표시해야 한다

> **IF** API 호출이 실패하면
> **THEN** 시스템은 재시도 버튼과 함께 에러 메시지를 표시해야 한다

> **IF** 이미지 로딩이 실패하면
> **THEN** 시스템은 기본 플레이스홀더 이미지를 표시해야 한다

> **IF** 네트워크 연결이 끊어지면
> **THEN** 시스템은 오프라인 알림을 표시해야 한다

#### State-Driven Requirements (상태 기반)

> **WHILE** 데이터를 로딩 중인 동안
> 시스템은 로딩 스피너 또는 스켈레톤 UI를 표시해야 한다

> **WHILE** 사용자가 대시보드를 스크롤하는 동안
> 시스템은 상단 네비게이션을 고정 표시해야 한다

> **WHILE** 실시간 구독이 활성화된 동안
> 시스템은 데이터 변경사항을 자동으로 반영해야 한다

> **WHILE** 모바일 화면에서 보는 동안
> 시스템은 카드 레이아웃을 세로 배열로 조정해야 한다

> **WHILE** 다크 모드가 활성화된 동안
> 시스템은 모든 UI 요소를 다크 테마로 표시해야 한다

#### Optional Features (선택적 기능)

> **WHERE** 사용자가 위젯 커스터마이징을 원하면
> 시스템은 위젯 순서 변경 기능을 제공해야 한다

> **WHERE** 사용자가 데이터 내보내기를 원하면
> 시스템은 CSV 다운로드 기능을 제공해야 한다

> **WHERE** 사용자가 상세 통계를 원하면
> 시스템은 확장된 분석 뷰를 제공해야 한다

> **WHERE** 사용자가 알림을 설정하면
> 시스템은 방문 예정 장소 리마인더를 제공해야 한다

> **WHERE** 사용자가 공유를 원하면
> 시스템은 대시보드 스냅샷 공유 기능을 제공해야 한다

### Specifications (세부 명세)

#### 컴포넌트 구조

```
Dashboard/
├── DashboardLayout.tsx          # 메인 레이아웃 컨테이너
├── PrioritySection/              # 우선순위 기반 섹션
│   ├── MustVisitCards.tsx       # 우선순위 1-2 장소 카드
│   ├── SoonToVisit.tsx          # 우선순위 3 장소 리스트
│   └── PriorityBadge.tsx        # 우선순위 표시 배지
├── StatsWidgets/                 # 통계 위젯
│   ├── TotalPlacesWidget.tsx    # 전체 장소 수
│   ├── VisitedWidget.tsx        # 방문 완료 수
│   ├── CategoryWidget.tsx       # 카테고리별 분포
│   └── RegionWidget.tsx         # 지역별 분포
├── RecentActivity/               # 최근 활동
│   ├── ActivityTimeline.tsx     # 활동 타임라인
│   └── ActivityItem.tsx         # 개별 활동 아이템
└── QuickActions/                 # 빠른 액션
    ├── FloatingActionButton.tsx # FAB 버튼
    └── QuickAddModal.tsx        # 빠른 추가 모달
```

#### 데이터 구조

```typescript
interface DashboardData {
  priorityPlaces: {
    mustVisit: Place[];      // 우선순위 1-2
    soonToVisit: Place[];    // 우선순위 3
  };
  statistics: {
    totalPlaces: number;
    visitedCount: number;
    categoryDistribution: CategoryCount[];
    regionDistribution: RegionCount[];
  };
  recentActivities: Activity[];
  quickStats: {
    thisWeekAdded: number;
    thisMonthVisited: number;
    avgRating: number;
  };
}

interface Place {
  id: string;
  name: string;
  category: string;
  region: string;
  priority: 1 | 2 | 3 | 4 | 5;
  visitStatus: 'not_visited' | 'visited';
  imageUrl?: string;
  rating?: number;
  tags: string[];
  createdAt: string;
  lastModified: string;
}

interface Activity {
  id: string;
  type: 'added' | 'visited' | 'edited' | 'rated';
  placeId: string;
  placeName: string;
  timestamp: string;
  details?: string;
}
```

#### API 엔드포인트

```typescript
// Supabase RPC Functions
- get_dashboard_data(user_id: string)
  → Returns: DashboardData

// Realtime Subscriptions
- places_changes
  → Subscribe to: INSERT, UPDATE, DELETE on places table

// Direct Queries
- SELECT * FROM places WHERE user_id = ? AND priority IN (1,2) ORDER BY priority, created_at
- SELECT COUNT(*), category FROM places WHERE user_id = ? GROUP BY category
- SELECT * FROM activities WHERE user_id = ? AND timestamp > NOW() - INTERVAL '7 days'
```

#### UI/UX 명세

**레이아웃**
- 12 컬럼 그리드 시스템 사용
- 데스크탑: 3-4 컬럼 레이아웃
- 태블릿: 2 컬럼 레이아웃
- 모바일: 1 컬럼 레이아웃

**색상 스킴**
- 우선순위 1: 빨간색 (#EF4444)
- 우선순위 2: 주황색 (#F97316)
- 우선순위 3: 노란색 (#EAB308)
- 우선순위 4: 초록색 (#22C55E)
- 우선순위 5: 회색 (#6B7280)

**애니메이션**
- 카드 호버: scale(1.02) + shadow 증가
- 페이지 전환: fade-in 300ms
- 스켈레톤: pulse animation
- FAB 버튼: rotate(45deg) on click

**반응형 브레이크포인트**
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## 🏷️ 추적성 (Traceability)

### 상위 요구사항 연결
- Product.md: "우선순위 대시보드" 기능 (Phase 1)
- SPEC-001: 기본 장소 CRUD
- SPEC-004: 필터링 시스템

### 하위 구현 연결
- Frontend: `src/pages/Dashboard/`
- Backend: `supabase/functions/dashboard/`
- Database: `places`, `activities` 테이블
- Tests: `tests/dashboard/`

### 관련 이슈
- Issue #15: 대시보드 UI 설계
- Issue #16: 통계 쿼리 최적화
- Issue #17: 실시간 업데이트 구현

## ✅ 완료 조건 (Definition of Done)

1. **기능 완성도**
   - [ ] 모든 EARS 요구사항 구현 완료
   - [ ] 우선순위별 장소 표시 정상 작동
   - [ ] 4개 통계 위젯 데이터 정확도 검증
   - [ ] 최근 활동 타임라인 실시간 업데이트

2. **품질 보증**
   - [ ] 단위 테스트 커버리지 90% 이상
   - [ ] E2E 테스트 주요 시나리오 통과
   - [ ] 성능: 5초 이내 초기 로딩
   - [ ] 접근성: WCAG 2.1 AA 준수

3. **문서화**
   - [ ] 컴포넌트 API 문서 작성
   - [ ] Storybook 스토리 생성
   - [ ] 사용자 가이드 업데이트

4. **배포 준비**
   - [ ] 코드 리뷰 승인
   - [ ] 스테이징 환경 테스트 통과
   - [ ] 운영 모니터링 대시보드 설정

## 📝 참고사항

### 성능 고려사항
- 이미지 lazy loading 적용
- 데이터 캐싱 전략 수립
- Virtual scrolling for long lists
- Debounce/throttle for real-time updates

### 보안 고려사항
- Row Level Security (RLS) 적용
- XSS 방지 처리
- Rate limiting on API calls

### 확장성 고려사항
- 컴포넌트 재사용성 극대화
- 상태 관리 중앙화 (Zustand)
- 테마 시스템 지원 준비