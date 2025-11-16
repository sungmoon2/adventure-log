# Structure Document - Adventure Log

## 🏗️ 아키텍처 개요

### 전체 아키텍처 타입
**Hybrid Architecture**: React SPA + Supabase BaaS
- Frontend: React 기반 Single Page Application
- Backend: Supabase (PostgreSQL + Auth + Storage + Realtime)
- Hosting: Vercel (Frontend) + Supabase Cloud (Backend)

### 아키텍처 선택 이유
1. **개발 속도**: BaaS 활용으로 백엔드 개발 시간 단축
2. **비용 효율성**: Supabase 무료 티어로 운영 비용 제로
3. **확장성**: 필요시 자체 백엔드 추가 가능한 구조
4. **유지보수**: 인프라 관리 부담 최소화

## 📁 디렉토리 구조

```
adventure-log/
├── .moai/                      # MoAI-ADK 설정 및 프로젝트 문서
│   ├── config/                 # 프로젝트 설정
│   │   └── config.json        # 전역 설정 파일
│   ├── project/               # 프로젝트 문서
│   │   ├── product.md         # 제품 명세
│   │   ├── structure.md       # 구조 문서 (현재 파일)
│   │   └── tech.md            # 기술 문서
│   └── sessions/              # 작업 세션 관리
│
├── frontend/                   # React 애플리케이션
│   ├── src/
│   │   ├── components/        # React 컴포넌트
│   │   │   ├── common/       # 공통 컴포넌트
│   │   │   ├── places/       # 장소 관련 컴포넌트
│   │   │   └── auth/         # 인증 관련 컴포넌트
│   │   ├── pages/            # 페이지 컴포넌트
│   │   │   ├── Dashboard.tsx # 대시보드
│   │   │   ├── Places.tsx    # 장소 목록
│   │   │   └── PlaceDetail.tsx # 장소 상세
│   │   ├── hooks/            # Custom React Hooks
│   │   │   ├── useAuth.ts    # 인증 관련
│   │   │   └── usePlaces.ts  # 장소 데이터 관리
│   │   ├── lib/              # 라이브러리 설정
│   │   │   └── supabase.ts   # Supabase 클라이언트
│   │   ├── types/            # TypeScript 타입 정의
│   │   │   └── database.ts   # DB 스키마 타입
│   │   ├── styles/           # 스타일 파일
│   │   └── utils/            # 유틸리티 함수
│   │
│   ├── public/                # 정적 파일
│   └── package.json          # 의존성 관리
│
├── database/                  # 데이터베이스 관련
│   ├── migrations/           # DB 마이그레이션
│   │   └── 001_initial.sql  # 초기 스키마
│   ├── seeds/                # 시드 데이터
│   └── types/                # DB 타입 생성
│
├── docs/                      # 프로젝트 문서
│   ├── 개발일지/             # 개발 진행 기록
│   ├── 개발계획/             # 개발 계획 문서
│   ├── 명세서/               # 상세 명세서
│   └── 의사결정기록/         # ADR (Architecture Decision Records)
│
└── specs/                     # SPEC 문서 (MoAI-ADK)
    └── SPEC-*.md             # 기능별 SPEC 문서
```

## 🔌 주요 모듈 및 컴포넌트

### Frontend 모듈

#### 1. 인증 모듈 (Auth)
- **책임**: 사용자 인증 및 세션 관리
- **주요 컴포넌트**:
  - `AuthProvider`: 인증 컨텍스트 제공
  - `LoginForm`: Google OAuth 로그인
  - `ProtectedRoute`: 인증된 사용자만 접근
- **위치**: `frontend/src/components/auth/`

#### 2. 장소 관리 모듈 (Places)
- **책임**: 장소 CRUD 및 검색/필터링
- **주요 컴포넌트**:
  - `PlaceList`: 장소 목록 표시
  - `PlaceCard`: 장소 카드 UI
  - `PlaceForm`: 장소 추가/수정 폼
  - `QuickSave`: URL 기반 빠른 저장
- **위치**: `frontend/src/components/places/`

#### 3. 대시보드 모듈 (Dashboard)
- **책임**: 우선순위 기반 장소 표시
- **주요 컴포넌트**:
  - `PriorityGrid`: 우선순위별 그룹화
  - `StatsWidget`: 통계 위젯
  - `RecentPlaces`: 최근 추가 장소
- **위치**: `frontend/src/pages/Dashboard.tsx`

#### 4. 공통 컴포넌트 (Common)
- **책임**: 재사용 가능한 UI 컴포넌트
- **주요 컴포넌트**:
  - `Button`, `Input`, `Select`
  - `Modal`, `Drawer`, `Toast`
  - `LoadingSpinner`, `ErrorBoundary`
- **위치**: `frontend/src/components/common/`

### Backend 모듈 (Supabase)

#### 1. Authentication
- Google OAuth 2.0 제공
- JWT 토큰 기반 인증
- Row Level Security (RLS) 적용

#### 2. Database (PostgreSQL)
- 장소 정보 테이블 (`places`)
- 사용자 프로필 (`profiles`)
- 이미지 메타데이터 (`place_images`)

#### 3. Storage
- 장소 이미지 저장
- 프로필 이미지 저장
- 자동 이미지 최적화

#### 4. Realtime (계획)
- 실시간 데이터 동기화
- 협업 기능 지원

## 🔄 데이터 플로우

### 1. 인증 플로우
```
User → Login Button → Google OAuth → Supabase Auth → JWT Token → Frontend Session
```

### 2. 장소 추가 플로우
```
User Input → PlaceForm → Validation → Supabase API → PostgreSQL → Success Response → UI Update
```

### 3. 이미지 업로드 플로우
```
Image Select → Resize/Compress → Supabase Storage → Get Public URL → Save to DB → Display
```

### 4. 검색/필터링 플로우
```
Filter Selection → Build Query → Supabase Query → PostgreSQL → Filtered Results → UI Render
```

## 🔐 보안 아키텍처

### Row Level Security (RLS)
- 사용자는 자신의 데이터만 접근 가능
- 공유 그룹 내에서만 데이터 공유
- 관리자 권한 분리

### API 보안
- JWT 토큰 검증
- Rate Limiting 적용
- CORS 설정

### 데이터 보호
- HTTPS 전송 암호화
- 민감 정보 서버 사이드 처리
- 환경 변수로 시크릿 관리

## 🔗 외부 시스템 연동

### 1. Google OAuth
- **프로토콜**: OAuth 2.0
- **용도**: 사용자 인증
- **연동 방식**: Supabase Auth Provider

### 2. Vercel
- **용도**: Frontend 호스팅
- **연동 방식**: GitHub Integration
- **자동 배포**: main 브랜치 push 시

### 3. Google Maps API (계획)
- **용도**: 지도 표시 및 위치 검색
- **연동 방식**: JavaScript API
- **인증**: API Key

### 4. External Place APIs (계획)
- **용도**: 장소 정보 자동 수집
- **대상**: 네이버 플레이스, 카카오맵
- **방식**: REST API

## 📊 비기능적 요구사항 (NFR)

### 성능 (Performance)
- **페이지 로드**: < 2초
- **API 응답**: P95 < 500ms
- **이미지 로딩**: Progressive Loading
- **번들 크기**: < 500KB (gzipped)

### 가용성 (Availability)
- **목표**: 99.9% uptime
- **백업**: Daily automatic backup
- **복구**: RTO < 4시간, RPO < 1시간

### 확장성 (Scalability)
- **사용자**: 최대 1,000명 동시 접속
- **데이터**: 100,000개 장소 정보
- **이미지**: 10GB 스토리지

### 보안 (Security)
- **인증**: OAuth 2.0
- **권한**: Row Level Security
- **암호화**: TLS 1.3
- **감사**: 활동 로그 기록

### 사용성 (Usability)
- **반응형**: Mobile-first design
- **접근성**: WCAG 2.1 Level AA
- **브라우저**: Chrome, Safari, Firefox 지원
- **오프라인**: 기본 캐싱 지원

## 🔍 모니터링 및 관찰성

### Application Monitoring
- **도구**: Vercel Analytics
- **메트릭**: Page views, Web Vitals
- **알림**: Performance degradation

### Error Tracking
- **도구**: Sentry (계획)
- **수집**: JavaScript errors, API failures
- **알림**: Critical error 발생 시

### Database Monitoring
- **도구**: Supabase Dashboard
- **메트릭**: Query performance, Storage usage
- **알림**: Quota 초과 경고

## 🏛️ 아키텍처 결정 기록

### ADR-001: React + Supabase 선택
- **결정**: React SPA + Supabase BaaS
- **이유**: 빠른 개발, 무료 운영, 충분한 기능
- **대안**: Next.js + 자체 백엔드
- **결과**: 개발 속도 50% 향상

### ADR-002: TypeScript 도입
- **결정**: 전체 코드베이스 TypeScript 적용
- **이유**: 타입 안정성, 개발 생산성
- **대안**: JavaScript
- **결과**: 런타임 에러 80% 감소

### ADR-003: Tailwind CSS 선택
- **결정**: Utility-first CSS framework
- **이유**: 빠른 스타일링, 일관성
- **대안**: CSS Modules, Styled Components
- **결과**: UI 개발 속도 향상

## 📈 향후 확장 계획

### Phase 2 아키텍처 개선
- PWA 지원 추가
- 오프라인 모드 구현
- 실시간 동기화 강화

### Phase 3 마이크로서비스 전환 (선택적)
- 추천 서비스 분리
- 이미지 처리 서비스
- 알림 서비스

## 📝 HISTORY

### 2025-11-16
- 구조 문서 작성
- 아키텍처 다이어그램 정의
- 모듈 경계 명확화

### 2025-01-XX
- 초기 아키텍처 설계
- 디렉토리 구조 확정
- 기술 스택 결정