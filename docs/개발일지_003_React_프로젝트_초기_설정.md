# 개발일지 003 - React 프로젝트 초기 설정

**작성일**: 2025-01-XX
**작업 시간**: 1시간
**상태**: ✅ 완료

---

## 📋 작업 내용

### 1. React + TypeScript 프로젝트 생성

**명령어**:
```bash
npm create vite@latest frontend -- --template react-ts
```

**생성된 구조**:
```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

### 2. 의존성 설치

#### 핵심 라이브러리
```bash
npm install @supabase/supabase-js @tanstack/react-query react-router-dom react-hook-form lucide-react framer-motion
```

**설치된 패키지**:
- `@supabase/supabase-js`: Supabase 클라이언트 SDK
- `@tanstack/react-query`: 서버 상태 관리 (캐싱, 리페칭 자동화)
- `react-router-dom`: 라우팅
- `react-hook-form`: 폼 관리
- `lucide-react`: 아이콘
- `framer-motion`: 애니메이션

#### Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
```

---

### 3. Tailwind CSS 설정

**tailwind.config.js**:
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: { /* blue color scale */ },
      },
    },
  },
  plugins: [],
}
```

**postcss.config.js**:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**src/index.css** (Tailwind directives):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### 4. Supabase 클라이언트 설정

**src/lib/supabase.ts**:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**환경변수 (.env)**:
```env
VITE_SUPABASE_URL=https://hrmtuwuxbspudguecyrp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

### 5. TypeScript 타입 정의

**src/types/database.ts**:
```typescript
export type Category = '식당' | '카페' | '문화/여가' | '명소' | '팝업/축제';
export type VisitStatus = '미방문' | '방문 완료' | '재방문 완료';
export type Priority = '🔥 최우선' | '✨ 꼭 가볼 곳' | '일반';

export interface Place {
  id: string;
  user_id: string;
  name: string;
  category: Category;
  visit_status: VisitStatus;
  priority: Priority;
  // ... 모든 필드 정의
}

export interface CreatePlaceInput { /* ... */ }
export interface UpdatePlaceInput { /* ... */ }
export interface PlaceFilters { /* ... */ }
```

---

### 6. 테스트 App 작성

**src/App.tsx**:
- Supabase 연결 테스트
- Tailwind CSS 동작 확인
- 상태 표시 (Supabase, React, Tailwind)

**실행 결과**:
```bash
npm run dev
✅ Vite v7.1.11 ready in 214ms
🌐 http://localhost:5173/
```

---

## 🎯 설정 검증

### 동작 확인

1. **Vite 개발 서버**: ✅ 정상 (214ms 시작)
2. **React + TypeScript**: ✅ 정상
3. **Tailwind CSS**: ✅ 정상 (그라데이션 배경 렌더링)
4. **Supabase 연결**: ✅ 정상 (places 테이블 접근 가능)

### 브라우저 확인

- http://localhost:5173/ 접속
- "Supabase: 연결됨" 녹색 표시 확인

---

## 📁 최종 프로젝트 구조

```
adventure-log/
├── docs/
│   ├── 개발일지_001_프로젝트_초기_설정.md
│   ├── 개발일지_002_Supabase_프로젝트_생성.md
│   └── 개발일지_003_React_프로젝트_초기_설정.md
├── database/
│   └── schema_001_initial.sql
├── frontend/
│   ├── src/
│   │   ├── lib/
│   │   │   └── supabase.ts
│   │   ├── types/
│   │   │   └── database.ts
│   │   ├── App.tsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔍 비판적 분석

### 질문 1: TanStack Query vs Zustand?

**답변**:
- **TanStack Query**: 서버 상태 관리 전문
  - 자동 캐싱, 리페칭, 동기화
  - Supabase 쿼리 최적화
- **Zustand**: 클라이언트 전역 상태
  - UI 상태 (사이드바 열림/닫힘 등)
- **결론**: 둘 다 사용
  - TanStack Query: places 데이터
  - Zustand: UI 상태 (Phase 2에서 추가)

### 질문 2: React Hook Form 왜 필요?

**답변**:
- 폼 입력 필드 15개 이상 (이름, 주소, 키워드 등)
- 유효성 검증 필요
- 성능 최적화 (불필요한 리렌더링 방지)
- **대안 없음**: 네이티브 폼 관리는 복잡도 폭발

### 질문 3: Framer Motion 필요한가?

**답변**:
- Phase 1: **불필요** (기본 CSS 전환으로 충분)
- Phase 2: 필요
  - 모달 애니메이션
  - 리스트 추가/삭제 애니메이션
  - 페이지 전환
- **결론**: 설치만 하고 나중에 사용

---

## 📝 기술적 메모

### Vite의 장점 (실감)

1. **빠른 시작**: 214ms (Webpack은 5초~)
2. **HMR (Hot Module Replacement)**: 즉시 반영
3. **TypeScript 네이티브 지원**: 설정 불필요

### 환경변수 주의사항

- Vite는 `VITE_` 접두사 필수
  - `REACT_APP_` (CRA) ❌
  - `VITE_` (Vite) ✅
- `import.meta.env.VITE_XXX`로 접근

### Tailwind CSS 유틸리티 클래스

- `bg-gradient-to-br`: 그라데이션 배경
- `from-blue-50 to-indigo-100`: 색상 전환
- `rounded-2xl`: 큰 모서리 둥글게
- `shadow-xl`: 큰 그림자

---

## ⚠️ 발생한 문제 및 해결

### 문제 1: `npx tailwindcss init -p` 실패

**오류**:
```
npm error could not determine executable to run
```

**근본 원인**:
- Windows 환경에서 npx 경로 문제

**해결**:
- `tailwind.config.js`, `postcss.config.js` 수동 생성
- 기능적으로 동일, 문제없음

---

## ✅ 완료 체크리스트

- [x] React + TypeScript 프로젝트 생성
- [x] 핵심 라이브러리 설치 (Supabase, TanStack Query 등)
- [x] Tailwind CSS 설정
- [x] Supabase 클라이언트 초기화
- [x] TypeScript 타입 정의
- [x] 환경변수 설정
- [x] 테스트 App 작성 및 동작 확인
- [x] 개발일지 003 작성
- [ ] Git 커밋 및 푸시

---

## 🚀 다음 단계

### Task 4: 인증 시스템 구현

1. Google OAuth 설정 (Supabase Dashboard)
2. 로그인 페이지 구현
3. 인증 상태 관리 (Context 또는 TanStack Query)
4. Protected Routes 설정

### Task 5: 장소 CRUD 기본 UI

1. 장소 리스트 페이지
2. 장소 추가 폼 (모달)
3. 장소 수정 기능
4. 장소 삭제 기능

---

**예상 소요 시간**:
- Task 4 (인증): 2-3시간
- Task 5 (CRUD UI): 4-5시간

**다음 일지**: `개발일지_004_Google_OAuth_설정.md`
