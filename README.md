# 맛집 어드벤처 로그 (Adventure Log)

> 인스타그램, 블로그에서 발견한 맛집/카페/명소 정보를 체계적으로 관리하는 개인 웹 애플리케이션

## 📋 프로젝트 개요

**목적**: 흩어진 장소 정보를 하나의 플랫폼에서 관리하고 우선순위 기반으로 방문 계획 수립

**기술 스택**:
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- Backend: Supabase (PostgreSQL + Auth + Storage)
- Testing: Vitest + React Testing Library
- Hosting: Vercel (Frontend)

**개발 상태**: Phase 1 진행 중 (인증 시스템 완료 ✅)

## 🎯 핵심 기능

### Phase 1 - 인증 및 기본 기능 (진행 중)

#### ✅ 완료된 기능
- **Google OAuth 인증** ([SPEC-LOGIN-001](specs/SPEC-LOGIN-001.md))
  - Google 계정으로 간편 로그인
  - 세션 관리 및 자동 로그인
  - 안전한 로그아웃 기능
  - 보호된 라우트 접근 제어
  - **테스트 커버리지**: 98.11% (18개 테스트 통과)

#### 🔨 개발 예정
- ⬜ 장소 CRUD (생성/조회/수정/삭제)
- ⬜ Quick Save (빠른 저장)
- ⬜ 필터링 (카테고리, 지역, 방문상태, 우선순위)
- ⬜ 검색 (이름, 키워드)
- ⬜ 대시보드 (우선순위 기반 표시)
- ⬜ 이미지 업로드

### Phase 2 - 고급 기능 (예정)
- ⬜ 휴지통 시스템
- ⬜ 실시간 영업 중 표시
- ⬜ 지도 뷰
- ⬜ 갤러리 뷰
- ⬜ 캘린더 뷰

## 🏗️ 프로젝트 구조

```
adventure-log/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI/CD
├── .moai/                             # MoAI-ADK 설정 및 프로젝트 문서
│   ├── config/
│   │   └── config.json               # 프로젝트 설정
│   └── project/
│       ├── product.md                # 제품 명세서
│       ├── structure.md              # 프로젝트 구조
│       └── tech.md                   # 기술 명세서
├── docs/                              # 개발 문서
│   ├── 개발계획/
│   ├── 개발일지/
│   ├── 명세서/
│   └── 의사결정기록/
├── frontend/                          # React 애플리케이션
│   ├── src/
│   │   ├── features/
│   │   │   └── auth/                 # 인증 기능
│   │   │       ├── components/       # LoginButton, UserProfile
│   │   │       ├── hooks/            # useAuth
│   │   │       └── index.ts
│   │   └── test/                     # 테스트 설정
│   ├── package.json
│   └── vitest.config.ts              # Vitest 설정
├── database/                          # Supabase 스키마
├── specs/                             # SPEC 문서
│   └── SPEC-LOGIN-001.md             # 사용자 인증 시스템 SPEC
├── HYBRID_STRATEGY.md                 # 하이브리드 개발 전략
├── SETUP_GUIDE.md                     # 개발 환경 설정 가이드
└── README.md
```

## 🧪 테스트 현황

### 전체 테스트 커버리지
```
Test Files: 3 passed (3)
Tests: 18 passed (18)
Coverage: 98.11% (Statements), 85.71% (Branches), 100% (Functions)
```

### 기능별 테스트 커버리지
| 기능 | 커버리지 | 테스트 수 | 상태 |
|-----|---------|----------|------|
| 인증 (Authentication) | 98.11% | 18 | ✅ 완료 |
| LoginButton 컴포넌트 | 100% | 6 | ✅ 완료 |
| UserProfile 컴포넌트 | 90.9% | 3 | ✅ 완료 |
| useAuth 훅 | 100% | 9 | ✅ 완료 |

### 테스트 실행 방법
```bash
# 프론트엔드 디렉토리로 이동
cd frontend

# 전체 테스트 실행
npm test

# 커버리지 포함 테스트
npm run test:coverage

# Watch 모드로 테스트
npm run test:watch
```

## 🚀 시작하기

### 사전 요구사항
- Node.js 18+
- npm 또는 yarn
- Supabase 계정

### 설치 및 실행
자세한 설정 가이드는 [SETUP_GUIDE.md](SETUP_GUIDE.md)를 참조하세요.

```bash
# 저장소 클론
git clone [repository-url]

# 프론트엔드 디렉토리로 이동
cd adventure-log/frontend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에 Supabase 설정 추가

# 개발 서버 실행
npm run dev
```

## 📊 개발 진행 상황

### Phase 1 진행률
- ✅ 프로젝트 초기 설정 (100%)
- ✅ Supabase 연동 (100%)
- ✅ 인증 시스템 구현 (100%)
  - ✅ Google OAuth 통합
  - ✅ 세션 관리
  - ✅ 보호된 라우트
  - ✅ 테스트 작성 (98.11% 커버리지)
- 🔨 장소 관리 CRUD (0%)
- 🔨 필터링/검색 기능 (0%)
- 🔨 대시보드 구현 (0%)

### 최근 업데이트 (2024-11-16)
- ✅ Google OAuth 인증 시스템 완료
- ✅ Vitest + React Testing Library 테스트 인프라 구축
- ✅ useAuth 훅 구현 및 테스트 (100% 커버리지)
- ✅ LoginButton, UserProfile 컴포넌트 구현 및 테스트
- ✅ GitHub Actions CI/CD 파이프라인 구성
- ✅ MoAI-ADK SPEC-First 개발 프로세스 적용

## 📚 관련 문서

### 개발 문서
- [개발 환경 설정 가이드](SETUP_GUIDE.md)
- [하이브리드 개발 전략](HYBRID_STRATEGY.md)
- [프로젝트 구조 상세](/.moai/project/structure.md)
- [기술 명세서](/.moai/project/tech.md)

### SPEC 문서
- [SPEC-LOGIN-001: 사용자 인증 시스템](specs/SPEC-LOGIN-001.md)

### 개발 일지
- [001 - 프로젝트 초기 설정](docs/개발일지/개발일지_001_프로젝트_초기_설정.md)
- [002 - Supabase 프로젝트 생성](docs/개발일지/개발일지_002_Supabase_프로젝트_생성.md)
- [003 - React 프로젝트 초기 설정](docs/개발일지/개발일지_003_React_프로젝트_초기_설정.md)
- [004 - 종합 명세서 작성](docs/개발일지/개발일지_004_종합_명세서_작성.md)

## 🛠️ 기술 스택 상세

### Frontend
- **Framework**: React 18.3.1 + TypeScript 5.6.2
- **Build Tool**: Vite 5.4.11
- **UI**: Tailwind CSS 3.4.15
- **State Management**: TBD (필요시 Zustand/Jotai)
- **Testing**: Vitest 2.1.6 + React Testing Library 16.1.0
- **Linting**: ESLint + Prettier

### Backend (Supabase)
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth (Google OAuth)
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime (선택적)

### DevOps
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel (Frontend)

## 🤝 개발 프로세스

이 프로젝트는 **MoAI-ADK SPEC-First TDD** 방법론을 따릅니다:

1. **SPEC 작성**: EARS 형식으로 요구사항 정의
2. **테스트 작성**: TDD Red-Green-Refactor 사이클
3. **구현**: 테스트를 통과하는 최소 코드 작성
4. **리팩토링**: 코드 품질 개선
5. **문서 동기화**: 자동 문서 생성 및 업데이트

## 👤 개발자

1인 풀스택 개발 (@sungmoon2)

## 📄 라이선스

Private Project

---

**마지막 업데이트**: 2024-11-16  
**현재 버전**: 0.1.0  
**개발 모드**: Personal Project
