# API Reference - Adventure Log

> **자동 생성 문서**: 이 문서는 코드에서 자동으로 동기화됩니다.
> **마지막 업데이트**: 2024-11-16
> **API 버전**: v0.1.0

## 📋 개요

Adventure Log 프로젝트의 API 레퍼런스 문서입니다.
현재는 **Supabase Auth API**와 **커스텀 React Hooks**를 사용합니다.

### 기술 스택
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Frontend**: React 18 + TypeScript 5.6
- **인증**: Supabase Auth (Google OAuth 2.0)

---

## 🔐 인증 API (Authentication)

### 1. Supabase Auth API

#### 1.1 Google OAuth 로그인

**메서드**: `supabase.auth.signInWithOAuth()`

**설명**: Google OAuth 2.0 Provider를 통한 로그인을 시작합니다.

**사용법**:
```typescript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/dashboard`,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent'
    }
  }
});
```

**파라미터**:
| 이름 | 타입 | 필수 | 설명 |
|-----|------|------|------|
| `provider` | `'google'` | ✅ | OAuth Provider (현재는 Google만 지원) |
| `options.redirectTo` | `string` | ⬜ | 인증 성공 후 리다이렉트 URL |
| `options.queryParams` | `object` | ⬜ | Google OAuth 추가 파라미터 |

**반환값**:
```typescript
{
  data: {
    provider: 'google',
    url: 'https://accounts.google.com/o/oauth2/...' // OAuth URL
  },
  error: null
}
```

**에러**:
```typescript
{
  data: { provider: 'google', url: null },
  error: {
    message: 'Invalid OAuth configuration',
    status: 400
  }
}
```

**예제**:
```typescript
// 기본 사용법
const handleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  });

  if (error) {
    console.error('Login failed:', error.message);
  }
};

// 커스텀 리다이렉트
const handleLoginWithRedirect = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/welcome`
    }
  });
};
```

---

#### 1.2 로그아웃

**메서드**: `supabase.auth.signOut()`

**설명**: 현재 사용자의 세션을 종료합니다.

**사용법**:
```typescript
const { error } = await supabase.auth.signOut();
```

**파라미터**: 없음

**반환값**:
```typescript
{
  error: null
}
```

**에러**:
```typescript
{
  error: {
    message: 'Failed to sign out',
    status: 500
  }
}
```

**예제**:
```typescript
const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout failed:', error.message);
  } else {
    // 로그아웃 성공, 홈으로 리다이렉트
    window.location.href = '/';
  }
};
```

---

#### 1.3 세션 조회

**메서드**: `supabase.auth.getSession()`

**설명**: 현재 저장된 세션 정보를 가져옵니다.

**사용법**:
```typescript
const { data: { session }, error } = await supabase.auth.getSession();
```

**파라미터**: 없음

**반환값**:
```typescript
{
  data: {
    session: {
      user: {
        id: 'uuid',
        email: 'user@example.com',
        user_metadata: {
          full_name: 'John Doe',
          avatar_url: 'https://...'
        }
      },
      access_token: 'eyJhbGciOiJIUzI1...',
      refresh_token: 'xyz...',
      expires_at: 1699999999
    }
  },
  error: null
}
```

**세션 없을 때**:
```typescript
{
  data: { session: null },
  error: null
}
```

**예제**:
```typescript
const checkSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Session check failed:', error);
    return null;
  }

  if (session) {
    console.log('User is logged in:', session.user.email);
    return session.user;
  } else {
    console.log('No active session');
    return null;
  }
};
```

---

#### 1.4 인증 상태 변경 감지

**메서드**: `supabase.auth.onAuthStateChange()`

**설명**: 인증 상태 변경을 실시간으로 감지합니다.

**사용법**:
```typescript
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    console.log('Auth event:', event);
    console.log('Session:', session);
  }
);

// 컴포넌트 언마운트 시 구독 해제
subscription.unsubscribe();
```

**파라미터**:
| 이름 | 타입 | 설명 |
|-----|------|------|
| `callback` | `(event, session) => void` | 인증 상태 변경 콜백 |

**이벤트 타입**:
- `SIGNED_IN`: 로그인 성공
- `SIGNED_OUT`: 로그아웃
- `TOKEN_REFRESHED`: 토큰 갱신
- `USER_UPDATED`: 사용자 정보 업데이트
- `PASSWORD_RECOVERY`: 비밀번호 복구

**반환값**:
```typescript
{
  data: {
    subscription: {
      unsubscribe: () => void
    }
  }
}
```

**예제**:
```typescript
// React 컴포넌트에서 사용
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user.email);
        setUser(session?.user ?? null);
      }

      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

---

## 🪝 Custom React Hooks

### 2. useAuth Hook

**파일**: `frontend/src/features/auth/hooks/useAuth.ts`

**설명**: 인증 상태를 관리하는 커스텀 React Hook입니다.

**사용법**:
```typescript
import { useAuth } from '@/features/auth';

function MyComponent() {
  const { user, loading, signIn, signOut, isAuthenticated } = useAuth();

  // 사용 예시
}
```

#### 2.1 반환값

**인터페이스**:
```typescript
interface UseAuthReturn {
  user: User | null;              // 현재 로그인된 사용자
  loading: boolean;               // 인증 상태 로딩 여부
  signIn: () => Promise<void>;    // Google OAuth 로그인 함수
  signOut: () => Promise<void>;   // 로그아웃 함수
  isAuthenticated: boolean;       // 인증 여부 (user !== null)
}
```

**User 타입**:
```typescript
interface User {
  id: string;                     // 사용자 고유 ID (UUID)
  email: string;                  // 이메일 주소
  user_metadata: {
    full_name?: string;           // 전체 이름
    avatar_url?: string;          // 프로필 사진 URL
    [key: string]: any;           // 기타 메타데이터
  };
  created_at: string;             // 생성 시각 (ISO 8601)
}
```

#### 2.2 메서드

##### 2.2.1 signIn()

**설명**: Google OAuth 로그인을 시작합니다.

**시그니처**:
```typescript
signIn: () => Promise<void>
```

**사용 예시**:
```typescript
const { signIn } = useAuth();

const handleLogin = async () => {
  try {
    await signIn();
    // 성공 시 Google OAuth 화면으로 리다이렉트
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

**내부 동작**:
1. `supabase.auth.signInWithOAuth({ provider: 'google' })` 호출
2. Google OAuth consent screen으로 리다이렉트
3. 인증 성공 시 콜백 URL로 복귀
4. `onAuthStateChange` 이벤트로 상태 자동 업데이트

**에러 처리**:
```typescript
const handleLogin = async () => {
  try {
    await signIn();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Login error:', error.message);
      // UI에 에러 표시
    }
  }
};
```

##### 2.2.2 signOut()

**설명**: 현재 세션을 종료하고 로그아웃합니다.

**시그니처**:
```typescript
signOut: () => Promise<void>
```

**사용 예시**:
```typescript
const { signOut } = useAuth();

const handleLogout = async () => {
  try {
    await signOut();
    // 성공 시 user 상태가 null로 자동 업데이트
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

**내부 동작**:
1. `supabase.auth.signOut()` 호출
2. 클라이언트 및 서버 세션 삭제
3. `onAuthStateChange` 이벤트로 `user = null` 자동 업데이트

#### 2.3 사용 예시

##### 예시 1: 로그인 상태에 따른 조건부 렌더링

```typescript
function Header() {
  const { user, loading, signIn, signOut, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <header>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.user_metadata.full_name}!</p>
          <button onClick={signOut}>Logout</button>
        </>
      ) : (
        <button onClick={signIn}>Login with Google</button>
      )}
    </header>
  );
}
```

##### 예시 2: 보호된 컴포넌트

```typescript
function ProtectedContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <div>Protected content here</div>;
}
```

##### 예시 3: 사용자 정보 표시

```typescript
function UserProfile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div>
      <img src={user.user_metadata.avatar_url} alt="Avatar" />
      <h2>{user.user_metadata.full_name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

---

## 📊 데이터베이스 API (예정)

> **Phase 2 구현 예정**

### 3. Places API (장소 관리)
- `GET /places`: 장소 목록 조회
- `POST /places`: 새 장소 추가
- `PUT /places/:id`: 장소 수정
- `DELETE /places/:id`: 장소 삭제

### 4. Categories API (카테고리 관리)
- `GET /categories`: 카테고리 목록
- `POST /categories`: 카테고리 추가

---

## 🔒 보안 고려사항

### CORS (Cross-Origin Resource Sharing)
Supabase는 기본적으로 모든 도메인에서의 요청을 허용합니다.
프로덕션 환경에서는 Supabase Dashboard에서 허용 도메인을 제한하세요.

### Row Level Security (RLS)
**현재 상태**: ⚠️ 미적용 (Phase 2 예정)

**예정 정책**:
```sql
-- users 테이블: 본인 데이터만 조회
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- places 테이블: 본인이 생성한 장소만 관리
CREATE POLICY "Users can manage own places"
  ON places FOR ALL
  USING (auth.uid() = user_id);
```

### 환경 변수 보호
**절대 노출 금지**:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**보호 방법**:
- `.env` 파일 사용
- `.gitignore`에 `.env` 추가
- 프로덕션에서는 Vercel Environment Variables 사용

---

## 🧪 API 테스트

### 테스트 커버리지
- **useAuth Hook**: 100% (9개 테스트)
- **Supabase Auth API**: Mock 테스트로 검증

### 테스트 실행
```bash
cd frontend
npm test
```

### 테스트 코드 예시
```typescript
// useAuth.test.tsx
test('signs in with Google OAuth', async () => {
  const { result } = renderHook(() => useAuth());

  await act(async () => {
    await result.current.signIn();
  });

  expect(mockSignInWithOAuth).toHaveBeenCalledWith({
    provider: 'google'
  });
});
```

---

## 📝 변경 이력

### v0.1.0 (2024-11-16)
- ✅ Supabase Auth API 통합
- ✅ useAuth Hook 구현
- ✅ Google OAuth 로그인/로그아웃
- ✅ 테스트 커버리지 98.11%

### 다음 버전 (v0.2.0 예정)
- ⬜ Places API 구현
- ⬜ RLS 정책 적용
- ⬜ Rate Limiting 추가

---

## 🔗 관련 문서

- [Supabase Auth 공식 문서](https://supabase.com/docs/guides/auth)
- [SPEC-LOGIN-001](../.moai/specs/SPEC-LOGIN-001/spec.md)
- [아키텍처 문서](./ARCHITECTURE.md)
- [프로젝트 README](./README.md)

---

**API 버전**: v0.1.0
**마지막 업데이트**: 2024-11-16
**담당자**: @sungmoon2
**자동 동기화**: Living Documentation
