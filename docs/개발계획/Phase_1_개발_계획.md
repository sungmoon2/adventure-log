# Phase 1 개발 계획 v1.0

**작성일**: 2025-01-XX
**목표**: MVP (Minimum Viable Product) 완성
**개발 방식**: 단계별 확인 후 진행 (Option A)
**커밋 규칙**: 각 Task 완료 후 개발일지 작성 및 커밋

---

## ⚠️ 중요 공지

**이 문서는 실제 구현할 작업 목록입니다.**

- 추정 없음: 확정된 기능만 기록
- 순서 중요: 위에서 아래로 순차 진행
- 의존성 고려: 이전 Task 완료 후 다음 진행
- 커밋 필수: 각 Task 완료 시 개발일지 작성 및 Git 커밋

---

## 1. Phase 1 범위

### 1.1 필수 기능 (반드시 구현)

**Group A: CRUD**
- ✅ 장소 생성 (Create)
- ✅ 장소 조회 (Read)
- ✅ 장소 수정 (Update)
- ✅ 장소 삭제 (Delete)

**Group B: 필터링 및 검색**
- ✅ 카테고리 필터 (식당, 카페, 문화/여가, 명소, 팝업/축제)
- ✅ 방문 상태 필터 (미방문, 방문 완료, 재방문 완료)
- ✅ 우선순위 필터 (🔥 최우선, ✨ 꼭 가볼 곳, 일반)
- ✅ 지역 필터 (시/도, 구/군)
- ✅ 키워드 검색
- ✅ 통합 검색 (이름 + 지역 + 키워드)

**Group C: 모든 입력 필드 지원**
- ✅ 기본 정보 (이름, 카테고리)
- ✅ 상태 정보 (방문 상태, 우선순위)
- ✅ 지역 정보 (시/도, 구/군, 주소)
- ✅ 영업 정보 (영업시간 텍스트)
- ✅ 주차 정보 (주차 타입, 메모)
- ✅ 추가 정보 (키워드, 메모, 출처 URL)
- ✅ 이미지 업로드 (cover_image_url)
- ✅ 팝업/축제 (시작일, 종료일)

**Group D: 추가 기능**
- ✅ Google OAuth 로그인
- ✅ Quick Save 모달 (최소 필드만)
- ✅ 대시보드 (우선순위 기반 표시)

### 1.2 제외 기능 (Phase 2 이후)

```
- 휴지통 시스템
- 실시간 영업 중 표시 (JSONB operating_hours)
- 지도 뷰
- 갤러리 뷰
- 캘린더 뷰
- 다크 모드
- PWA (오프라인 지원)
```

---

## 2. 개발 단계

### 2.1 전체 단계 개요

```
✅ Step 0: 프로젝트 초기 설정 (완료)
✅ Step 1: Supabase 프로젝트 생성 (완료)
✅ Step 2: React 프론트엔드 초기 설정 (완료)
✅ Step 3: 문서화 (완료)

⬜ Step 4: 인증 시스템 구현
⬜ Step 5: 기본 레이아웃 구현
⬜ Step 6: 장소 조회 구현
⬜ Step 7: 장소 생성 구현 (전체 폼)
⬜ Step 8: Quick Save 구현
⬜ Step 9: 장소 수정 구현
⬜ Step 10: 장소 삭제 구현
⬜ Step 11: 필터링 및 검색 구현
⬜ Step 12: 이미지 업로드 구현
⬜ Step 13: 대시보드 구현
⬜ Step 14: UI/UX 개선
⬜ Step 15: 테스트 및 버그 수정
⬜ Step 16: Vercel 배포
```

---

## 3. Step 4: 인증 시스템 구현

### 3.1 Task 4-1: Google OAuth 설정

**파일**: Supabase Dashboard

**작업**:
1. Supabase Dashboard → Authentication → Providers
2. Google 활성화
3. Google Cloud Console에서 OAuth 클라이언트 생성
   - Authorized redirect URIs: `https://hrmtuwuxbspudguecyrp.supabase.co/auth/v1/callback`
4. Client ID 및 Secret을 Supabase에 입력
5. `.env`에 추가 (필요 시):
   ```env
   VITE_GOOGLE_CLIENT_ID=...
   ```

**완료 조건**:
- [ ] Supabase에서 Google OAuth 활성화됨
- [ ] 테스트 로그인 성공

**커밋**: `feat: Google OAuth 설정 완료`

---

### 3.2 Task 4-2: useAuth 훅 구현

**파일**: `frontend/src/hooks/useAuth.ts`

**구현 내용**:
```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 세션 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**완료 조건**:
- [ ] `useAuth.ts` 파일 생성됨
- [ ] TypeScript 컴파일 에러 없음

**커밋**: `feat: useAuth 훅 구현`

---

### 3.3 Task 4-3: 로그인 페이지 구현

**파일**: `frontend/src/pages/auth/LoginPage.tsx`

**구현 내용**:
```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function LoginPage() {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🍜 맛집 어드벤처 로그
        </h1>
        <p className="text-gray-600 mb-8">
          나만의 장소 관리 플랫폼
        </p>

        <button
          onClick={signInWithGoogle}
          className="w-full bg-white border-2 border-gray-300 rounded-lg p-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
          <span className="font-semibold">Google로 로그인</span>
        </button>

        <p className="mt-6 text-xs text-gray-500 text-center">
          로그인하면 Google 계정으로 인증됩니다.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
```

**완료 조건**:
- [ ] `LoginPage.tsx` 파일 생성됨
- [ ] `/login` 접속 시 페이지 표시됨
- [ ] Google 로그인 버튼 작동함

**개발일지**: `개발일지_004_인증_시스템_구현.md`

**커밋**: `feat: 로그인 페이지 구현`

---

### 3.4 Task 4-4: OAuth 콜백 페이지 구현

**파일**: `frontend/src/pages/auth/CallbackPage.tsx`

**구현 내용**:
```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // OAuth 콜백 처리 후 대시보드로 이동
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-700">로그인 중...</p>
      </div>
    </div>
  );
}

export default CallbackPage;
```

**완료 조건**:
- [ ] `CallbackPage.tsx` 파일 생성됨
- [ ] OAuth 리다이렉트 후 대시보드로 이동함

**커밋**: `feat: OAuth 콜백 페이지 구현`

---

### 3.5 Task 4-5: App.tsx 라우터 설정

**파일**: `frontend/src/App.tsx`

**수정 내용**:
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './hooks/useAuth';

import LoginPage from './pages/auth/LoginPage';
import CallbackPage from './pages/auth/CallbackPage';
import DashboardPage from './pages/dashboard/DashboardPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<CallbackPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
```

**완료 조건**:
- [ ] 라우팅 설정 완료
- [ ] 로그인 안 된 상태에서 `/dashboard` 접근 시 `/login`으로 리다이렉트
- [ ] 로그인 후 대시보드 접근 가능

**개발일지**: `개발일지_004_인증_시스템_구현.md` (업데이트)

**커밋**: `feat: 라우터 및 인증 가드 설정`

---

## 4. Step 5: 기본 레이아웃 구현

### 4.1 Task 5-1: Header 컴포넌트 구현

**파일**: `frontend/src/components/layout/Header.tsx`

**구현 내용**:
```typescript
import { useAuth } from '../../hooks/useAuth';

function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍜</span>
            <h1 className="text-xl font-bold text-gray-900">맛집 어드벤처 로그</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={signOut}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
```

**완료 조건**:
- [ ] Header 컴포넌트 생성됨
- [ ] 로그아웃 버튼 작동함

**커밋**: `feat: Header 컴포넌트 구현`

---

### 4.2 Task 5-2: Sidebar 컴포넌트 구현

**파일**: `frontend/src/components/layout/Sidebar.tsx`

**구현 내용**:
```typescript
import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, PlusCircle } from 'lucide-react';

function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/dashboard')
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Home size={20} />
          <span className="font-medium">대시보드</span>
        </Link>

        <Link
          to="/places"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/places')
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <MapPin size={20} />
          <span className="font-medium">장소 목록</span>
        </Link>

        <Link
          to="/places/new"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/places/new')
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <PlusCircle size={20} />
          <span className="font-medium">장소 추가</span>
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
```

**완료 조건**:
- [ ] Sidebar 컴포넌트 생성됨
- [ ] 활성 메뉴 하이라이트 작동함

**커밋**: `feat: Sidebar 컴포넌트 구현`

---

### 4.3 Task 5-3: Layout 컴포넌트 구현

**파일**: `frontend/src/components/layout/Layout.tsx`

**구현 내용**:
```typescript
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
```

**완료 조건**:
- [ ] Layout 컴포넌트 생성됨
- [ ] Header + Sidebar + Content 구조 표시됨

**개발일지**: `개발일지_005_기본_레이아웃_구현.md`

**커밋**: `feat: Layout 컴포넌트 구현`

---

## 5. Step 6: 장소 조회 구현

### 5.1 Task 6-1: usePlaces 훅 구현

**파일**: `frontend/src/hooks/usePlaces.ts`

**구현 내용**: (프론트엔드_아키텍처_명세서.md 참조)

**완료 조건**:
- [ ] `usePlaces.ts` 파일 생성됨
- [ ] TypeScript 컴파일 에러 없음

**커밋**: `feat: usePlaces 훅 구현`

---

### 5.2 Task 6-2: PlaceCard 컴포넌트 구현

**파일**: `frontend/src/components/places/PlaceCard.tsx`

**구현 내용**:
```typescript
import { Place } from '../../types/database';
import { MapPin, Calendar } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
  onClick?: () => void;
}

function PlaceCard({ place, onClick }: PlaceCardProps) {
  const priorityColor = {
    '🔥 최우선': 'bg-red-100 text-red-800',
    '✨ 꼭 가볼 곳': 'bg-yellow-100 text-yellow-800',
    '일반': 'bg-gray-100 text-gray-800',
  }[place.priority];

  const visitStatusColor = {
    '미방문': 'bg-blue-100 text-blue-800',
    '방문 완료': 'bg-green-100 text-green-800',
    '재방문 완료': 'bg-purple-100 text-purple-800',
  }[place.visit_status];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition cursor-pointer"
    >
      {place.cover_image_url && (
        <img
          src={place.cover_image_url}
          alt={place.name}
          className="w-full h-40 object-cover rounded-md mb-3"
          loading="lazy"
        />
      )}

      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{place.name}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColor}`}>
          {place.priority}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
          {place.category}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${visitStatusColor}`}>
          {place.visit_status}
        </span>
      </div>

      {place.region_main && (
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
          <MapPin size={14} />
          <span>{place.region_main} {place.region_sub}</span>
        </div>
      )}

      {place.keywords && place.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {place.keywords.map((keyword, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
              #{keyword}
            </span>
          ))}
        </div>
      )}

      {place.memo && (
        <p className="text-sm text-gray-600 line-clamp-2">{place.memo}</p>
      )}

      {place.start_date && place.end_date && (
        <div className="flex items-center gap-1 text-sm text-orange-600 mt-2">
          <Calendar size={14} />
          <span>{place.start_date} ~ {place.end_date}</span>
        </div>
      )}
    </div>
  );
}

export default PlaceCard;
```

**완료 조건**:
- [ ] PlaceCard 컴포넌트 생성됨
- [ ] 카드에 모든 정보 표시됨

**커밋**: `feat: PlaceCard 컴포넌트 구현`

---

### 5.3 Task 6-3: PlacesListPage 구현

**파일**: `frontend/src/pages/places/PlacesListPage.tsx`

**구현 내용**:
```typescript
import { useNavigate } from 'react-router-dom';
import { usePlaces } from '../../hooks/usePlaces';
import PlaceCard from '../../components/places/PlaceCard';

function PlacesListPage() {
  const navigate = useNavigate();
  const { data: places, isLoading, error } = usePlaces();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div className="text-red-500">오류: {error.message}</div>;
  }

  if (!places || places.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">아직 등록된 장소가 없습니다.</p>
        <button
          onClick={() => navigate('/places/new')}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          첫 장소 추가하기
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">장소 목록</h2>
        <button
          onClick={() => navigate('/places/new')}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          장소 추가
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onClick={() => navigate(`/places/${place.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default PlacesListPage;
```

**완료 조건**:
- [ ] PlacesListPage 생성됨
- [ ] 장소 목록이 그리드로 표시됨
- [ ] 카드 클릭 시 상세 페이지 이동

**개발일지**: `개발일지_006_장소_조회_구현.md`

**커밋**: `feat: 장소 목록 페이지 구현`

---

## 6. Step 7~16: (계속)

각 단계별로 동일한 형식으로 작성됩니다:

```
Step 7: 장소 생성 구현 (전체 폼)
Step 8: Quick Save 구현
Step 9: 장소 수정 구현
Step 10: 장소 삭제 구현
Step 11: 필터링 및 검색 구현
Step 12: 이미지 업로드 구현
Step 13: 대시보드 구현
Step 14: UI/UX 개선
Step 15: 테스트 및 버그 수정
Step 16: Vercel 배포
```

---

## 7. 개발 규칙

### 7.1 커밋 메시지 규칙

```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 추가
chore: 빌드 설정 등
```

### 7.2 개발일지 규칙

**파일명**: `개발일지_XXX_작업명.md`

**구조**:
```markdown
# 개발일지 XXX - 작업명

**날짜**: 2025-01-XX
**작업 시간**: X시간
**완료한 Task**: Task X-1, Task X-2

## 1. 작업 내용

### Task X-1: ...
- 구현 내용
- 결과

## 2. 발생한 문제

### 문제 1: ...
- 증상
- 원인
- 해결 방법

## 3. 다음 작업

Step X+1 진행 예정
```

### 7.3 테스트 규칙

**각 Task 완료 후**:
1. `npm run dev` 실행
2. 브라우저에서 기능 테스트
3. TypeScript 컴파일 에러 확인
4. 정상 작동 확인 후 커밋

---

## 8. 진행 상황 추적

### 8.1 체크리스트

```
✅ Step 0: 프로젝트 초기 설정
✅ Step 1: Supabase 프로젝트 생성
✅ Step 2: React 프론트엔드 초기 설정
✅ Step 3: 문서화
⬜ Step 4: 인증 시스템 구현
⬜ Step 5: 기본 레이아웃 구현
⬜ Step 6: 장소 조회 구현
⬜ Step 7: 장소 생성 구현
⬜ Step 8: Quick Save 구현
⬜ Step 9: 장소 수정 구현
⬜ Step 10: 장소 삭제 구현
⬜ Step 11: 필터링 및 검색 구현
⬜ Step 12: 이미지 업로드 구현
⬜ Step 13: 대시보드 구현
⬜ Step 14: UI/UX 개선
⬜ Step 15: 테스트 및 버그 수정
⬜ Step 16: Vercel 배포
```

---

**이 문서는 실제 개발 순서를 정의합니다.**
**위에서 아래로 순차적으로 진행하며, 각 Task 완료 후 반드시 커밋**
