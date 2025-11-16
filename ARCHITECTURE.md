# 시스템 아키텍처 - Adventure Log

> **자동 생성 문서**: 이 문서는 코드 구조에서 자동으로 동기화됩니다.
> **마지막 업데이트**: 2024-11-16
> **버전**: v0.1.0

## 📋 개요

Adventure Log는 **Jamstack 아키텍처** 기반의 풀스택 웹 애플리케이션입니다.
React 프론트엔드와 Supabase BaaS(Backend-as-a-Service)를 활용하여 빠르고 안정적인 서비스를 제공합니다.

### 핵심 아키텍처 원칙
- **Jamstack**: JavaScript + API + Markup
- **Feature-Based Structure**: 기능 중심 디렉토리 구조
- **Separation of Concerns**: 관심사의 분리
- **SOLID Principles**: 객체지향 설계 원칙 준수

---

## 🏗️ 시스템 구성도

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        사용자 (User)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Vercel CDN (Edge Network)                  │
│               - Static Asset Delivery                        │
│               - Automatic HTTPS                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 React Frontend (SPA)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Presentation Layer (UI Components)                   │  │
│  │  - LoginButton, UserProfile, PlaceList (예정)        │  │
│  └────────────────────┬──────────────────────────────────┘  │
│  ┌────────────────────▼──────────────────────────────────┐  │
│  │  Business Logic Layer (Hooks & State)                 │  │
│  │  - useAuth, usePlaces (예정)                          │  │
│  └────────────────────┬──────────────────────────────────┘  │
│  ┌────────────────────▼──────────────────────────────────┐  │
│  │  Data Access Layer (Supabase Client)                  │  │
│  │  - supabase.auth, supabase.from('places')             │  │
│  └────────────────────┬──────────────────────────────────┘  │
└───────────────────────┼──────────────────────────────────────┘
                        │
                        ▼ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   Supabase BaaS                              │
│  ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Auth Service    │  │  PostgreSQL  │  │  Storage     │  │
│  │  - Google OAuth  │  │  - RLS       │  │  - Images    │  │
│  │  - Session Mgmt  │  │  - Real-time │  │  - CDN       │  │
│  └──────────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 프론트엔드 아키텍처

### 1. Feature-Based Directory Structure

```
frontend/src/
├── features/                    # 기능별 모듈화
│   ├── auth/                   # 인증 기능 ✅ 완료
│   │   ├── components/         # UI 컴포넌트
│   │   │   ├── LoginButton.tsx
│   │   │   └── UserProfile.tsx
│   │   ├── hooks/              # 비즈니스 로직
│   │   │   └── useAuth.ts
│   │   └── index.ts            # Public API
│   │
│   ├── places/                 # 장소 관리 (예정)
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   │
│   └── dashboard/              # 대시보드 (예정)
│       ├── components/
│       ├── hooks/
│       └── index.ts
│
├── lib/                        # 공유 라이브러리
│   ├── supabase.ts            # Supabase 클라이언트 초기화
│   └── utils.ts               # 유틸리티 함수
│
├── test/                       # 테스트 유틸리티
│   ├── setup.ts               # Vitest 설정
│   └── mocks/                 # Mock 객체
│       └── supabase.ts
│
├── App.tsx                     # 루트 컴포넌트
└── main.tsx                    # 엔트리포인트
```

### 2. Component Architecture Pattern

**3-Layer 구조**:

```
┌────────────────────────────────────────┐
│  Presentational Components             │  ← UI만 담당
│  - LoginButton, UserProfile            │
│  - Props로 데이터 수신                  │
│  - 비즈니스 로직 없음                   │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│  Container Components (Hooks)          │  ← 로직 담당
│  - useAuth, usePlaces                  │
│  - 상태 관리                            │
│  - API 호출                             │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│  Service Layer (Supabase Client)       │  ← 데이터 접근
│  - supabase.auth.signIn()              │
│  - supabase.from('places').select()    │
└────────────────────────────────────────┘
```

**예시: useAuth Hook 패턴**

```typescript
// features/auth/hooks/useAuth.ts (Container)
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 비즈니스 로직
  useEffect(() => {
    // Supabase Service Layer 호출
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
  }, []);

  return { user, loading, signIn, signOut };
};

// features/auth/components/LoginButton.tsx (Presentational)
export const LoginButton = () => {
  const { signIn, loading } = useAuth(); // Hook에서 로직 주입

  // UI만 담당
  return (
    <button onClick={signIn} disabled={loading}>
      {loading ? '로그인 중...' : 'Google로 로그인'}
    </button>
  );
};
```

### 3. State Management Strategy

**현재 전략**: **Local State + React Hooks**
- 복잡한 전역 상태 관리 라이브러리 불필요
- useAuth Hook으로 인증 상태 공유
- Context API 사용 최소화 (성능 최적화)

**향후 확장 시**: Zustand 또는 Jotai 도입 검토

```typescript
// 현재 방식 (Local State)
const { user } = useAuth(); // 각 컴포넌트에서 호출

// 향후 확장 시 (Global State - 예정)
import { useAuthStore } from '@/stores/auth';
const user = useAuthStore((state) => state.user);
```

---

## 🗄️ 백엔드 아키텍처 (Supabase)

### 1. Supabase 서비스 구성

```
Supabase Platform
├── Auth Service (인증)
│   ├── Google OAuth Provider ✅
│   ├── Session Management ✅
│   └── JWT Token Generation ✅
│
├── PostgreSQL Database (데이터베이스)
│   ├── users 테이블 (Supabase 자동 관리) ✅
│   ├── places 테이블 (예정)
│   ├── categories 테이블 (예정)
│   └── Row Level Security (RLS) (예정)
│
├── Storage Service (파일 저장소)
│   ├── Images Bucket (예정)
│   └── CDN Integration (예정)
│
└── Real-time Service (실시간 동기화)
    └── Subscriptions (예정)
```

### 2. 데이터베이스 스키마 (예정)

**ERD (Entity Relationship Diagram)**:

```
┌─────────────────────┐
│      users          │  (Supabase Auth 자동 관리)
├─────────────────────┤
│ id (PK, UUID)       │
│ email               │
│ created_at          │
└──────────┬──────────┘
           │ 1
           │
           │ N
┌──────────▼──────────┐
│      places         │  (예정)
├─────────────────────┤
│ id (PK, UUID)       │
│ user_id (FK)        │◄──── RLS: auth.uid() = user_id
│ name                │
│ category            │
│ address             │
│ priority            │
│ visited             │
│ created_at          │
│ updated_at          │
└─────────────────────┘
           │ N
           │
           │ 1
┌──────────▼──────────┐
│    categories       │  (예정)
├─────────────────────┤
│ id (PK, UUID)       │
│ name                │
│ icon                │
└─────────────────────┘
```

### 3. Row Level Security (RLS) 정책 (예정)

**보안 정책**:
```sql
-- users 테이블: 본인 데이터만 조회
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- places 테이블: 본인이 생성한 장소만 관리
CREATE POLICY "Users can manage own places"
  ON places FOR ALL
  USING (auth.uid() = user_id);

-- 삽입 시 user_id 자동 설정
CREATE POLICY "Users can insert own places"
  ON places FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**RLS 활성화**:
```sql
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
```

---

## 🔐 인증 플로우

### Google OAuth 로그인 시퀀스 다이어그램

```
사용자          프론트엔드          Supabase Auth       Google OAuth
  │                │                    │                   │
  │  Click Login   │                    │                   │
  ├───────────────►│                    │                   │
  │                │  signInWithOAuth() │                   │
  │                ├───────────────────►│                   │
  │                │                    │  Redirect to      │
  │                │                    │  Google           │
  │                │◄───────────────────┤                   │
  │                │                    │                   │
  │  Redirect      │                    │                   │
  ├────────────────┴────────────────────┴──────────────────►│
  │                                                          │
  │  Google Login Page                                      │
  │  (계정 선택 & 권한 승인)                                 │
  │◄─────────────────────────────────────────────────────────┤
  │                                                          │
  │  Callback with Auth Code                                │
  ├──────────────────────────────────────────────────────────►
  │                                                          │
  │                    │  Exchange Code  │                   │
  │                    │  for Token      │                   │
  │                    ├────────────────►│                   │
  │                    │                 │  Verify with      │
  │                    │                 │  Google           │
  │                    │                 ├──────────────────►│
  │                    │                 │◄──────────────────┤
  │                    │  Session +      │                   │
  │                    │  JWT Token      │                   │
  │                    │◄────────────────┤                   │
  │  Redirect to       │                 │                   │
  │  Dashboard         │                 │                   │
  │◄───────────────────┤                 │                   │
  │                    │                 │                   │
  │  UserProfile       │                 │                   │
  │  Displayed         │                 │                   │
  │                    │                 │                   │
```

### 세션 관리 플로우

**초기 로드 시**:
```
1. 페이지 로드
2. useAuth Hook 실행
3. supabase.auth.getSession() 호출
4. 세션 있으면 → user 상태 설정, 없으면 → null
5. loading = false
```

**인증 상태 변경 감지**:
```
1. onAuthStateChange 구독
2. 다른 탭에서 로그인/로그아웃 시
3. 이벤트 발생 → 모든 탭의 user 상태 동기화
```

**세션 만료 처리**:
```
1. JWT 토큰 만료 (기본: 1시간)
2. Supabase가 자동으로 Refresh Token 사용하여 갱신
3. 갱신 실패 시 → SIGNED_OUT 이벤트
4. 사용자 로그인 페이지로 리다이렉트
```

---

## 🚀 배포 아키텍처

### Vercel Deployment Pipeline

```
GitHub Repository
       │
       │ git push
       ▼
┌──────────────────────┐
│  Vercel Build        │
│  1. npm install      │
│  2. npm run build    │
│  3. Optimize Assets  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Vercel Edge Network │
│  - CDN Distribution  │
│  - Auto HTTPS        │
│  - Serverless        │
└──────────┬───────────┘
           │
           ▼
      사용자 (전 세계)
```

**배포 환경**:
- **Production**: `main` 브랜치 자동 배포
- **Preview**: PR마다 프리뷰 환경 생성
- **Development**: 로컬 개발 환경

---

## 📦 빌드 & 번들링

### Vite Build Process

```
src/ (TypeScript + React)
       │
       │ Vite Transpile
       ▼
dist/ (JavaScript + HTML + CSS)
       │
       │ Tree Shaking + Minification
       ▼
Optimized Bundle
       │
       │ Code Splitting
       ▼
┌──────────────────────┐
│  main-[hash].js      │  ← 핵심 로직
│  auth-[hash].js      │  ← 인증 모듈 (lazy load)
│  places-[hash].js    │  ← 장소 모듈 (lazy load, 예정)
└──────────────────────┘
```

**최적화 전략**:
- **Code Splitting**: 라우트별 지연 로딩
- **Tree Shaking**: 미사용 코드 제거
- **Minification**: 코드 압축
- **Asset Optimization**: 이미지 최적화 (예정)

---

## 🧪 테스트 아키텍처

### Test Pyramid

```
           ┌──────────────┐
           │  E2E Tests   │  ← Playwright (예정)
           │  (전체 플로우) │
           └──────┬───────┘
                  │
         ┌────────▼────────┐
         │ Integration     │  ← React Testing Library
         │ Tests           │     (컴포넌트 통합, 예정)
         └────────┬────────┘
                  │
     ┌────────────▼─────────────┐
     │  Unit Tests              │  ← Vitest ✅
     │  - useAuth (9 tests)     │
     │  - LoginButton (6 tests) │
     │  - UserProfile (3 tests) │
     └──────────────────────────┘
```

**테스트 전략**:
- **Unit Tests** (현재): Hook & Component 단위 테스트
- **Integration Tests** (예정): API 연동 테스트
- **E2E Tests** (예정): 전체 사용자 플로우 테스트

---

## 🔧 개발 환경 설정

### 로컬 개발 환경

```
개발자 머신
├── Node.js 18+
├── npm 또는 yarn
├── VS Code (권장)
│   ├── ESLint Extension
│   ├── Prettier Extension
│   └── TypeScript Extension
│
└── 환경 변수 (.env)
    ├── VITE_SUPABASE_URL
    └── VITE_SUPABASE_ANON_KEY
```

**개발 서버 실행**:
```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
```

---

## 📊 성능 모니터링 (예정)

### 예정 모니터링 스택
- **Vercel Analytics**: 페이지 로드 성능
- **Sentry**: 에러 트래킹
- **Supabase Logs**: API 호출 모니터링

---

## 🔮 향후 아키텍처 확장 계획

### Phase 2 확장
1. **Places CRUD API**: Supabase PostgreSQL 활용
2. **Image Upload**: Supabase Storage 연동
3. **Real-time Sync**: Supabase Real-time Subscriptions
4. **PWA 지원**: Service Worker + Offline Mode

### Phase 3 확장
1. **마이크로 프론트엔드**: Module Federation 검토
2. **서버리스 함수**: Vercel Edge Functions 활용
3. **GraphQL API**: Hasura 또는 Apollo 도입 검토

---

## 🔗 관련 문서

- [API Reference](./API.md)
- [SPEC-LOGIN-001](../.moai/specs/SPEC-LOGIN-001/spec.md)
- [프로젝트 README](./README.md)
- [CLAUDE.md - 프로젝트 가이드](../CLAUDE.md)

---

**버전**: v0.1.0
**마지막 업데이트**: 2024-11-16
**담당자**: @sungmoon2
**자동 동기화**: Living Documentation
