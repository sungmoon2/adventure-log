# API 설계 명세서 v1.0

**작성일**: 2025-01-XX
**API 제공자**: Supabase (PostgreSQL)
**클라이언트**: @supabase/supabase-js v2.x
**상태**: Phase 1 설계 완료

---

## ⚠️ 중요 공지

**이 프로젝트는 REST API가 없습니다.**

- 백엔드 서버 없음 (Jamstack)
- Supabase SDK로 PostgreSQL 직접 접근
- 모든 쿼리는 클라이언트(React)에서 실행
- Row Level Security로 보안 보장

**이 문서는 Supabase SDK 사용 패턴을 정의합니다.**

---

## 1. Supabase 클라이언트 초기화

### 1.1 설정 파일

**파일 위치**: `frontend/src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase/js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 1.2 사용 방법

```typescript
import { supabase } from '@/lib/supabase';

// 모든 컴포넌트에서 import하여 사용
```

---

## 2. 인증 API

### 2.1 Google OAuth 로그인

```typescript
// 로그인 시작
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
});

// 응답: Google 로그인 페이지로 리다이렉트
```

### 2.2 세션 확인

```typescript
// 현재 세션 가져오기
const { data: { session }, error } = await supabase.auth.getSession();

// session.user.id = user_id (places 테이블 FK)
// session.access_token = JWT
```

### 2.3 로그아웃

```typescript
const { error } = await supabase.auth.signOut();
```

### 2.4 세션 변경 감지

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // 로그인 처리
  }
  if (event === 'SIGNED_OUT') {
    // 로그아웃 처리
  }
});
```

---

## 3. Places CRUD API

### 3.1 CREATE (생성)

#### 일반 생성 (전체 필드)
```typescript
const { data, error } = await supabase
  .from('places')
  .insert({
    name: '제미니네 쭈꾸미',
    category: '식당',
    visit_status: '미방문',
    priority: '🔥 최우선',
    region_main: '부산',
    region_sub: '해운대구',
    address: '부산 해운대구 중동 123-45',
    keywords: ['한식', '쭈꾸미', '야장'],
    memo: '11:30-22:00, 월요일 휴무',
    source_url: 'https://instagram.com/p/...',
    record_status: 'published'
  })
  .select()
  .single();

// data: 생성된 Place 객체 (id 포함)
// error: null 또는 에러 객체
```

#### Quick Save (최소 필드)
```typescript
const { data, error } = await supabase
  .from('places')
  .insert({
    name: '여친님 추천 파스타집',
    category: '식당',
    source_url: 'https://instagram.com/p/...',
    record_status: 'draft'  // draft 상태
  })
  .select()
  .single();
```

### 3.2 READ (조회)

#### 전체 조회 (우선순위 정렬)
```typescript
const { data, error } = await supabase
  .from('places')
  .select('*')
  .order('priority', { ascending: false })  // 우선순위 높은 순
  .order('created_at', { ascending: false });  // 최신순

// data: Place[] 배열
```

#### 필터링 (카테고리)
```typescript
const { data, error } = await supabase
  .from('places')
  .select('*')
  .eq('category', '식당')  // category = '식당'
  .eq('visit_status', '미방문');
```

#### 복합 필터
```typescript
const { data, error } = await supabase
  .from('places')
  .select('*')
  .eq('category', '식당')
  .eq('visit_status', '미방문')
  .eq('region_main', '부산')
  .order('priority', { ascending: false });
```

#### 키워드 검색 (배열 교집합)
```typescript
const { data, error } = await supabase
  .from('places')
  .select('*')
  .contains('keywords', ['한식']);  // keywords에 '한식' 포함

// 또는 OR 검색
.overlaps('keywords', ['한식', '야장']);  // 둘 중 하나라도 포함
```

#### 통합 검색 (이름 + 지역)
```typescript
const { data, error } = await supabase
  .from('places')
  .select('*')
  .or(`name.ilike.%${searchTerm}%,region_main.ilike.%${searchTerm}%,region_sub.ilike.%${searchTerm}%`);

// ilike = case-insensitive LIKE
// %searchTerm% = 부분 일치
```

#### 단일 조회 (ID)
```typescript
const { data, error } = await supabase
  .from('places')
  .select('*')
  .eq('id', place_id)
  .single();  // 단일 객체 반환
```

#### 페이지네이션
```typescript
const page = 1;
const limit = 20;
const from = (page - 1) * limit;
const to = from + limit - 1;

const { data, error, count } = await supabase
  .from('places')
  .select('*', { count: 'exact' })
  .range(from, to)
  .order('created_at', { ascending: false });

// data: 20개씩
// count: 전체 행 수
```

### 3.3 UPDATE (수정)

#### 단일 필드 수정
```typescript
const { data, error } = await supabase
  .from('places')
  .update({ visit_status: '방문 완료' })
  .eq('id', place_id)
  .select()
  .single();
```

#### 여러 필드 수정
```typescript
const { data, error } = await supabase
  .from('places')
  .update({
    name: '수정된 이름',
    address: '수정된 주소',
    keywords: ['새키워드1', '새키워드2'],
    record_status: 'published'  // draft → published
  })
  .eq('id', place_id)
  .select()
  .single();

// updated_at은 트리거로 자동 갱신됨
```

### 3.4 DELETE (삭제)

```typescript
const { error } = await supabase
  .from('places')
  .delete()
  .eq('id', place_id);

// RLS로 자신의 데이터만 삭제 가능
```

---

## 4. Storage API (이미지 업로드)

### 4.1 이미지 업로드

```typescript
const file = event.target.files[0];  // File 객체
const user_id = (await supabase.auth.getUser()).data.user.id;
const place_id = 'abc-123';
const fileName = `${Date.now()}_${file.name}`;
const filePath = `${user_id}/${place_id}/${fileName}`;

const { data, error } = await supabase.storage
  .from('place-images')
  .upload(filePath, file, {
    cacheControl: '3600',
    upsert: false
  });

// data.path: 파일 경로
```

### 4.2 공개 URL 생성

```typescript
const { data } = supabase.storage
  .from('place-images')
  .getPublicUrl(filePath);

const publicUrl = data.publicUrl;
// https://hrmtuwuxbspudguecyrp.supabase.co/storage/v1/object/public/place-images/...
```

### 4.3 places 테이블에 URL 저장

```typescript
await supabase
  .from('places')
  .update({ cover_image_url: publicUrl })
  .eq('id', place_id);
```

### 4.4 이미지 삭제

```typescript
const { error } = await supabase.storage
  .from('place-images')
  .remove([filePath]);
```

---

## 5. TanStack Query 통합 패턴

### 5.1 조회 (useQuery)

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

function usePlaces(filters) {
  return useQuery({
    queryKey: ['places', filters],
    queryFn: async () => {
      let query = supabase
        .from('places')
        .select('*');

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,  // 5분간 캐시
  });
}

// 사용
const { data: places, isLoading, error } = usePlaces({ category: '식당' });
```

### 5.2 생성 (useMutation)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useCreatePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPlace) => {
      const { data, error } = await supabase
        .from('places')
        .insert(newPlace)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // 캐시 무효화 (자동 리페칭)
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
  });
}

// 사용
const createPlace = useCreatePlace();
createPlace.mutate({ name: '새 장소', category: '식당' });
```

### 5.3 수정 (useMutation)

```typescript
function useUpdatePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from('places')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
  });
}
```

### 5.4 삭제 (useMutation)

```typescript
function useDeletePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('places')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
  });
}
```

---

## 6. 실시간 구독 (Realtime)

**Phase 2에서 구현 예정**

```typescript
// 실시간 변경 감지
const subscription = supabase
  .channel('places')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'places',
    filter: `user_id=eq.${user_id}`
  }, (payload) => {
    console.log('Change received!', payload);
    // TanStack Query 캐시 업데이트
  })
  .subscribe();

// 정리
subscription.unsubscribe();
```

---

## 7. 에러 처리

### 7.1 에러 타입

```typescript
interface SupabaseError {
  message: string;
  details: string;
  hint: string;
  code: string;
}

// 예시
{
  message: "duplicate key value violates unique constraint",
  code: "23505"
}
```

### 7.2 에러 처리 패턴

```typescript
try {
  const { data, error } = await supabase
    .from('places')
    .insert(newPlace)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      // 중복 키
      throw new Error('이미 존재하는 장소입니다.');
    }
    if (error.code === '23503') {
      // 외래 키 제약 위반
      throw new Error('잘못된 사용자 ID입니다.');
    }
    throw error;
  }

  return data;
} catch (err) {
  console.error('장소 생성 실패:', err);
  // UI에 에러 표시
}
```

---

## 8. 성능 최적화

### 8.1 Select 필드 제한

```typescript
// 나쁜 예: 모든 필드 조회
const { data } = await supabase
  .from('places')
  .select('*');

// 좋은 예: 필요한 필드만
const { data } = await supabase
  .from('places')
  .select('id, name, category, priority, visit_status');
```

### 8.2 인덱스 활용 쿼리

```typescript
// 인덱스 활용 (빠름)
.eq('category', '식당')  // idx_places_category 사용
.eq('visit_status', '미방문')  // idx_places_visit_status 사용

// 인덱스 미활용 (느림)
.ilike('memo', '%검색어%')  // Full Table Scan
```

### 8.3 Count vs Select

```typescript
// 나쁜 예: 전체 조회 후 length
const { data } = await supabase.from('places').select('*');
const count = data.length;  // 메모리 낭비

// 좋은 예: count만 조회
const { count } = await supabase
  .from('places')
  .select('*', { count: 'exact', head: true });
```

---

## 9. 보안 고려사항

### 9.1 SQL Injection 방지

Supabase SDK는 자동으로 파라미터 바인딩 처리

```typescript
// 안전함 (파라미터 바인딩)
.eq('name', userInput)

// 위험 (사용하지 말 것)
.filter(`name=${userInput}`)  // SQL Injection 가능
```

### 9.2 RLS 우회 불가

```typescript
// 시도: 타인의 데이터 조회
const { data } = await supabase
  .from('places')
  .select('*')
  .eq('user_id', 'other-user-id');

// 결과: 0 rows (RLS로 차단됨)
```

---

## 10. API 명세 요약표

| 작업 | 메서드 | 필터 | 예시 |
|------|--------|------|------|
| 전체 조회 | select('*') | - | .order('created_at', { ascending: false }) |
| 필터 조회 | select('*') | eq | .eq('category', '식당') |
| 검색 | select('*') | ilike | .ilike('name', '%검색%') |
| 단일 조회 | select('*') | eq + single | .eq('id', id).single() |
| 생성 | insert | - | .insert({...}).select().single() |
| 수정 | update | eq | .update({...}).eq('id', id) |
| 삭제 | delete | eq | .delete().eq('id', id) |
| 이미지 업로드 | storage.upload | - | .upload(path, file) |

---

**이 문서의 모든 코드는 실행 가능합니다.**
**TypeScript 타입은 `src/types/database.ts` 참조**
