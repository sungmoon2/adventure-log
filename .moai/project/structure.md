# 시스템 구조 명세서 (System Architecture)

## 🏗️ 전체 아키텍처 개요

### 아키텍처 타입: **서버리스 BaaS (Backend as a Service)**

Adventure Log는 서버리스 아키텍처를 채택하여 인프라 관리 부담을 최소화하고, 빠른 개발과 확장성을 확보합니다.

```
┌─────────────────────────────────────────────────────┐
│                   Client Layer                      │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐  │
│  │   Desktop   │  │   Mobile    │  │   PWA    │  │
│  │   Browser   │  │   Browser   │  │   App    │  │
│  └─────────────┘  └─────────────┘  └──────────┘  │
└─────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│                Frontend Application                 │
│                                                     │
│  ┌──────────────────────────────────────────────┐ │
│  │         React 19.1 + TypeScript 5.9          │ │
│  ├──────────────────────────────────────────────┤ │
│  │  Components │ Pages │ Hooks │ Services       │ │
│  ├──────────────────────────────────────────────┤ │
│  │  React Router │ React Query │ React Hook Form│ │
│  └──────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                           │
                      Supabase SDK
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│                  Supabase Platform                  │
│                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────────┐ │
│  │   Auth    │  │  Database │  │    Storage    │ │
│  │  Service  │  │PostgreSQL │  │  Object Store │ │
│  └───────────┘  └───────────┘  └───────────────┘ │
│                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────────┐ │
│  │ Realtime  │  │   Edge    │  │   Triggers    │ │
│  │  Updates  │  │ Functions │  │  & Functions  │ │
│  └───────────┘  └───────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────┘
                           │
                    Optional (Phase 2)
                           ▼
┌─────────────────────────────────────────────────────┐
│              External Services (Future)             │
│                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────────┐ │
│  │  Maps API │  │    AI     │  │   Analytics   │ │
│  │  (Kakao)  │  │  Service  │  │   (Google)    │ │
│  └───────────┘  └───────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────┘
```

## 📁 디렉토리 구조

```
adventure-log/
├── .moai/                    # MoAI-ADK 설정 및 메타데이터
│   ├── config/
│   │   └── config.json      # 프로젝트 설정
│   ├── project/
│   │   ├── product.md       # 제품 명세서
│   │   ├── structure.md     # 구조 명세서 (현재 문서)
│   │   └── tech.md          # 기술 명세서
│   └── sessions/            # 에이전트 세션 데이터
│
├── frontend/                 # React 애플리케이션
│   ├── src/
│   │   ├── components/      # 재사용 가능한 UI 컴포넌트
│   │   │   ├── common/     # 공통 컴포넌트
│   │   │   ├── layout/     # 레이아웃 컴포넌트
│   │   │   └── features/   # 기능별 컴포넌트
│   │   ├── pages/          # 라우트별 페이지 컴포넌트
│   │   │   ├── Landing.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Places.tsx
│   │   │   └── Settings.tsx
│   │   ├── hooks/          # Custom React Hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── usePlaces.ts
│   │   │   └── useFilters.ts
│   │   ├── lib/            # 외부 라이브러리 설정
│   │   │   ├── supabase.ts
│   │   │   └── api.ts
│   │   ├── services/       # 비즈니스 로직
│   │   │   ├── auth.service.ts
│   │   │   ├── places.service.ts
│   │   │   └── storage.service.ts
│   │   ├── types/          # TypeScript 타입 정의
│   │   │   ├── database.types.ts
│   │   │   ├── api.types.ts
│   │   │   └── ui.types.ts
│   │   ├── utils/          # 유틸리티 함수
│   │   ├── styles/         # 글로벌 스타일
│   │   └── assets/         # 정적 자원
│   ├── public/             # 정적 파일
│   └── tests/              # 테스트 파일
│
├── database/                # 데이터베이스 관련
│   ├── migrations/         # DB 마이그레이션
│   │   ├── 001_initial_schema.sql
│   │   └── 002_add_priority.sql
│   ├── seeds/              # 시드 데이터
│   └── policies/           # Row Level Security 정책
│
├── specs/                   # SPEC 문서
│   ├── SPEC-LOGIN-001.md
│   ├── SPEC-PLACES-002.md
│   └── SPEC-FILTER-003.md
│
├── docs/                    # 프로젝트 문서
│   ├── 개발일지/           # 개발 진행 기록
│   ├── api/                # API 문서 (자동생성)
│   └── guides/             # 사용자 가이드
│
├── .github/                 # GitHub 설정
│   ├── workflows/          # CI/CD 파이프라인
│   │   ├── ci.yml
│   │   └── deploy.yml
│   └── ISSUE_TEMPLATE/
│
└── scripts/                 # 유틸리티 스크립트
    ├── setup.sh
    └── deploy.sh
```

## 🔗 주요 모듈 및 컴포넌트

### Frontend 모듈

#### 1. 인증 모듈 (Auth Module)
- **책임**: 사용자 인증 및 세션 관리
- **위치**: `frontend/src/services/auth.service.ts`
- **주요 기능**:
  - Google OAuth 로그인/로그아웃
  - 세션 상태 관리
  - Protected Route 제어

#### 2. 장소 관리 모듈 (Places Module)
- **책임**: 맛집 정보 CRUD 및 관리
- **위치**: `frontend/src/services/places.service.ts`
- **주요 기능**:
  - 장소 추가/수정/삭제
  - 필터링 및 검색
  - 우선순위 관리

#### 3. 스토리지 모듈 (Storage Module)
- **책임**: 이미지 및 파일 관리
- **위치**: `frontend/src/services/storage.service.ts`
- **주요 기능**:
  - 이미지 업로드/다운로드
  - 썸네일 생성
  - 파일 메타데이터 관리

#### 4. UI 컴포넌트 라이브러리
- **책임**: 재사용 가능한 UI 요소 제공
- **위치**: `frontend/src/components/`
- **주요 컴포넌트**:
  - PlaceCard: 장소 카드 UI
  - FilterBar: 필터링 인터페이스
  - PriorityBadge: 우선순위 표시

### Backend 모듈 (Supabase)

#### 1. 데이터베이스 스키마
```sql
-- Users 테이블
users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP
)

-- Places 테이블
places (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  category TEXT,
  region TEXT,
  address TEXT,
  url TEXT,
  priority INTEGER (1-5),
  visited BOOLEAN,
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Images 테이블
images (
  id UUID PRIMARY KEY,
  place_id UUID REFERENCES places(id),
  url TEXT,
  caption TEXT,
  uploaded_at TIMESTAMP
)

-- Tags 테이블 (Phase 2)
tags (
  id UUID PRIMARY KEY,
  place_id UUID REFERENCES places(id),
  tag_name TEXT,
  created_at TIMESTAMP
)
```

#### 2. Row Level Security (RLS)
- 사용자는 자신의 데이터만 접근 가능
- 모든 테이블에 `user_id` 기반 정책 적용
- 공개 데이터는 별도 정책으로 관리

## 🔄 데이터 흐름

### 1. 인증 플로우
```
사용자 → Google OAuth → Supabase Auth → JWT Token → Frontend Session
```

### 2. 데이터 CRUD 플로우
```
Frontend Form → Validation → Supabase SDK → PostgreSQL → RLS Check → Response
```

### 3. 이미지 업로드 플로우
```
File Select → Compression → Supabase Storage → URL Generation → Database Link
```

### 4. 실시간 업데이트 플로우
```
Database Change → Supabase Realtime → WebSocket → Frontend Update
```

## 🔌 외부 시스템 통합

### 현재 통합 (Phase 1)
1. **Supabase Platform**
   - Authentication Service
   - PostgreSQL Database
   - Object Storage
   - Realtime Subscriptions

2. **Vercel**
   - Frontend 호스팅
   - Edge Functions
   - Analytics

3. **GitHub**
   - 소스 코드 관리
   - CI/CD 파이프라인
   - 이슈 트래킹

### 계획된 통합 (Phase 2)
1. **Kakao Maps API**
   - 지도 표시
   - 위치 검색
   - 경로 안내

2. **OpenAI API**
   - 맛집 추천
   - 리뷰 요약
   - 태그 자동 생성

3. **Google Analytics**
   - 사용자 행동 분석
   - 성능 모니터링
   - 전환율 추적

## 📐 아키텍처 결정 사항

### 1. 서버리스 선택 이유
- **장점**:
  - 인프라 관리 불필요
  - 자동 확장성
  - 사용량 기반 과금
  - 빠른 개발 속도
- **단점 대응**:
  - 벤더 락인 → 추상화 레이어 구축
  - 콜드 스타트 → 웜업 전략 적용

### 2. Supabase 선택 이유
- **장점**:
  - PostgreSQL 기반 안정성
  - 내장 인증 시스템
  - 실시간 기능 제공
  - 무료 티어 제공
- **단점 대응**:
  - 제한된 커스터마이징 → Edge Functions 활용
  - 무료 티어 제한 → 사용량 모니터링

### 3. React + TypeScript 선택
- **장점**:
  - 타입 안정성
  - 풍부한 생태계
  - 컴포넌트 재사용성
  - 개발자 경험
- **단점 대응**:
  - 번들 크기 → Code Splitting 적용
  - SEO → SSG/ISR 고려

## 🎯 비기능 요구사항

### 성능 요구사항
- **페이지 로드**: < 2초 (3G 네트워크)
- **API 응답**: < 500ms (P95)
- **이미지 로드**: Progressive Loading 적용
- **검색 속도**: < 200ms

### 확장성 요구사항
- **동시 사용자**: 최대 1,000명
- **데이터 용량**: 사용자당 1GB
- **이미지 저장**: 장소당 최대 10장
- **검색 인덱스**: 10,000개 항목

### 보안 요구사항
- **인증**: OAuth 2.0 + JWT
- **권한**: Row Level Security
- **암호화**: HTTPS 필수
- **데이터**: GDPR 준수

### 가용성 요구사항
- **목표**: 99.9% uptime
- **백업**: 일일 자동 백업
- **복구**: RTO < 1시간, RPO < 24시간
- **모니터링**: 실시간 알림

## 🔮 향후 확장 계획

### Phase 2 아키텍처 진화
1. **마이크로서비스 고려**
   - 복잡한 비즈니스 로직 분리
   - FastAPI 백엔드 추가
   - 독립적 배포 및 확장

2. **캐싱 레이어 추가**
   - Redis 도입
   - CDN 최적화
   - Service Worker 캐싱

3. **모바일 앱 아키텍처**
   - React Native 또는 Flutter
   - 오프라인 우선 설계
   - 로컬 데이터베이스 동기화

---

**문서 버전**: 1.0.0
**작성일**: 2025-11-16
**작성자**: MoAI Project Manager Agent
**다음 검토일**: 2025-12-01