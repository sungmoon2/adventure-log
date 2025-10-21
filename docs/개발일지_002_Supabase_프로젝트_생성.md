# 개발일지 002 - Supabase 프로젝트 생성 및 데이터베이스 스키마 설계

**작성일**: 2025-01-XX
**작업 시간**: 1시간
**상태**: 🔄 진행 중

---

## 📋 작업 내용

### 1. Supabase 프로젝트 생성

**프로젝트 정보**:
```yaml
Project Name: adventure-log
Project ID: hrmtuwuxbspudguecyrp
Region: Northeast Asia (Seoul)
Database: PostgreSQL 15
Plan: Free (500MB)
```

**연결 정보**:
```
Project URL: https://hrmtuwuxbspudguecyrp.supabase.co
Anon Key: eyJhbGc... (환경변수 파일에 저장)
```

### 2. 환경변수 파일 생성

**파일**: `.env.example`
- Supabase URL 및 Anon Key 저장
- Git에는 예제 파일만 커밋 (.env는 .gitignore에 포함)

### 3. 데이터베이스 스키마 설계

**파일**: `database/schema_001_initial.sql`

**테이블 구조**: `places`

```sql
주요 필드:
- id (UUID, PK)
- user_id (UUID, FK → auth.users)
- name (VARCHAR, 필수)
- category (VARCHAR, CHECK 제약)
- visit_status (VARCHAR, DEFAULT '미방문')
- priority (VARCHAR, DEFAULT '일반')
- record_status (VARCHAR, draft/published)
- region_main, region_sub, address
- operating_hours (TEXT - 간단한 텍스트)
- parking_info, parking_memo
- keywords (TEXT[] - PostgreSQL 배열)
- memo (TEXT - 자유 메모)
- source_url, cover_image_url
- start_date, end_date (팝업/축제용)
- created_at, updated_at (자동)
```

**설계 결정사항**:

1. **단일 테이블 방식 채택** (Phase 1)
   - 이유: 복잡도 최소화, 빠른 개발
   - Phase 2에서 필요 시 분리 검토

2. **영업시간은 단순 텍스트**
   - Phase 1: `operating_hours TEXT`
   - 사용자 요구: "네이버 지도 참고용, 완벽한 데이터 불필요"
   - Phase 2에서 JSONB로 업그레이드 가능

3. **Quick Save 지원**
   - `record_status`: draft/published
   - draft: 이름 + URL만 입력
   - published: 전체 정보 입력

4. **키워드는 배열 타입**
   - PostgreSQL `TEXT[]` 사용
   - GIN 인덱스로 검색 성능 최적화

**보안 설정**:

- **Row Level Security (RLS)** 활성화
- 정책 4개:
  - SELECT: 자신의 데이터만 조회
  - INSERT: 자신의 user_id로만 삽입
  - UPDATE: 자신의 데이터만 수정
  - DELETE: 자신의 데이터만 삭제

**성능 최적화**:

- 인덱스 12개 생성:
  - 단일 컬럼: user_id, category, visit_status, priority, region_main 등
  - 복합 인덱스: (user_id, category), (user_id, priority, created_at) 등
  - GIN 인덱스: keywords 배열 검색용

**데이터 무결성**:

- CHECK 제약:
  - category: 5개 값만 허용
  - visit_status: 3개 값만 허용
  - priority: 3개 값만 허용
  - parking_info: 4개 값만 허용
  - 팝업 기간: end_date >= start_date

---

## 🎯 다음 단계 (수동 작업 필요)

### Step 1: Supabase SQL Editor에서 스키마 실행

1. Supabase Dashboard 접속: https://supabase.com/dashboard
2. `adventure-log` 프로젝트 선택
3. 좌측 메뉴 `SQL Editor` 클릭
4. `New query` 클릭
5. `database/schema_001_initial.sql` 파일 내용 복사
6. 붙여넣기 후 `Run` 버튼 클릭 (또는 Ctrl+Enter)

**예상 결과**:
```
Success. No rows returned
```

**확인 방법**:
- 좌측 메뉴 `Table Editor` → `places` 테이블 확인
- Columns에 name, category 등이 보이면 성공

### Step 2: Storage Bucket 생성 (이미지 업로드용)

1. 좌측 메뉴 `Storage` 클릭
2. `New bucket` 클릭
3. 설정:
   ```
   Name: place-images
   Public bucket: ✅ 체크 (이미지 URL 공개 접근)
   ```
4. `Create bucket` 클릭

**정책 설정**:
- Storage → `place-images` → Policies
- `New policy` → `For full customization`
- 정책 생성:
  ```sql
  -- 모든 사용자가 이미지 읽기 가능
  CREATE POLICY "Public images are viewable by everyone"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'place-images' );

  -- 인증된 사용자만 이미지 업로드 가능
  CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'place-images' AND auth.role() = 'authenticated' );

  -- 자신이 업로드한 이미지만 삭제 가능
  CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'place-images' AND auth.uid() = owner );
  ```

### Step 3: 테스트 (선택)

Supabase Dashboard → `Table Editor` → `places` 테이블 → `Insert row`로 수동 데이터 삽입 테스트

---

## 🔍 설계 검증

### 비판적 분석

**질문 1**: 왜 단일 테이블인가?
```
답변:
- Phase 1 목표: 2주 내 MVP 완성
- 식당/팝업/명소의 공통 필드가 80% 이상
- 복잡한 JOIN 없이 단순 SELECT로 충분
- 성능 문제 발생 시 Phase 2에서 분리 가능
```

**질문 2**: 영업시간을 왜 TEXT로?
```
답변:
- 사용자 요구: "네이버 지도 참고용, 정확도 불필요"
- 실제 사용 패턴: "11-22시 월휴무" 정도의 간단 메모
- Phase 2에서 JSONB로 업그레이드 경로 확보
- 개발 시간 절약 (복잡한 입력 UI 불필요)
```

**질문 3**: keywords를 배열로 한 이유?
```
답변:
- PostgreSQL 네이티브 배열 타입 지원
- GIN 인덱스로 빠른 검색 (`키워드 && ARRAY['한식', '야장']`)
- 별도 테이블(tags) 불필요 → 복잡도 감소
- 단점: 키워드 자동완성은 Phase 2에서 구현
```

---

## 📝 기술적 메모

### Supabase의 장점 (실감)

1. **즉시 사용 가능한 인증**
   - auth.users 테이블 자동 생성
   - OAuth 제공자 설정만 하면 끝

2. **RLS (Row Level Security)**
   - SQL 정책으로 보안 강제
   - 백엔드 API 없이도 안전

3. **실시간 기능 (선택적 사용 가능)**
   - WebSocket으로 데이터 변경 감지
   - Phase 2에서 활용 검토

### PostgreSQL 특화 기능 활용

- `TEXT[]`: 배열 타입
- `GIN` 인덱스: 배열/JSON 검색 최적화
- `CHECK` 제약: 열거형(enum) 대체
- `TRIGGER`: updated_at 자동 갱신

---

## ✅ 완료 체크리스트

- [x] Supabase 프로젝트 생성
- [x] 환경변수 파일 작성 (.env.example)
- [x] 데이터베이스 스키마 SQL 작성
- [x] 개발일지 002 작성
- [ ] **Supabase SQL Editor에서 스키마 실행** (수동)
- [ ] **Storage Bucket 생성** (수동)
- [ ] Git 커밋 및 푸시

---

**다음 일지**: `개발일지_003_React_프로젝트_초기_설정.md`
