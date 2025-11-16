# 기술 명세서 (Technical Specification)

## 🛠️ 기술 스택

### Frontend

#### 핵심 기술
- **Language**: TypeScript 5.9.3
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Package Manager**: npm 10.x

#### UI/UX 라이브러리
- **Styling**: Tailwind CSS 4.1.15
- **Animation**: Framer Motion 12.23.24
- **Icons**: Lucide React 0.546.0
- **Components**: Custom Component Library

#### 상태 관리 및 데이터
- **Routing**: React Router DOM 7.9.4
- **Data Fetching**: TanStack Query 5.90.5
- **Form Management**: React Hook Form 7.65.0
- **State Management**: React Context + Hooks

#### 개발 도구
- **Linting**: ESLint 9.36.0
- **Type Checking**: TypeScript ESLint 8.45.0
- **Formatting**: Prettier (planned)
- **Testing**: Vitest (planned)

### Backend (BaaS)

#### Supabase Platform
- **Version**: 2.76.1
- **Database**: PostgreSQL 15
- **Authentication**: Supabase Auth (Google OAuth)
- **Storage**: Supabase Storage
- **Realtime**: WebSocket subscriptions
- **Edge Functions**: Deno runtime (planned)

### DevOps & Infrastructure

#### 호스팅 및 배포
- **Frontend Hosting**: Vercel
- **Database Hosting**: Supabase Cloud
- **Domain**: Custom domain (planned)
- **SSL**: Auto-provisioned

#### CI/CD
- **Version Control**: Git + GitHub
- **CI Pipeline**: GitHub Actions
- **Deployment**: Vercel Auto-deploy
- **Branch Strategy**: Git Flow

#### 모니터링 (Planned)
- **Application**: Vercel Analytics
- **Error Tracking**: Sentry
- **Uptime**: Better Uptime
- **Logs**: Supabase Dashboard

## 🏗️ 개발 환경 설정

### 필수 요구사항
```json
{
  "node": ">=20.0.0",
  "npm": ">=10.0.0",
  "git": ">=2.40.0"
}
```

### 환경 변수
```bash
# .env.local (Frontend)
VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[ANON_KEY]
VITE_APP_URL=http://localhost:5173

# Production
VITE_APP_URL=https://adventure-log.vercel.app
```

### 개발 서버 실행
```bash
# Frontend 개발 서버
cd frontend
npm install
npm run dev

# 테스트 실행
npm run test

# 빌드
npm run build

# 프리뷰
npm run preview
```

## 🔧 빌드 및 배포

### 빌드 프로세스

#### Frontend 빌드
```bash
# TypeScript 컴파일 + Vite 빌드
npm run build

# 출력 디렉토리: frontend/dist
# - index.html
# - assets/
#   - js/[name].[hash].js
#   - css/[name].[hash].css
```

#### 최적화 전략
1. **Code Splitting**
   - Route-based splitting
   - Lazy loading components
   - Dynamic imports

2. **Asset Optimization**
   - Image compression (WebP)
   - CSS purging (Tailwind)
   - JS minification

3. **Caching Strategy**
   - Content hashing
   - Service Worker (PWA)
   - CDN caching

### 배포 파이프라인

#### GitHub Actions Workflow
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: frontend/dist
```

#### Vercel 배포 설정
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite"
}
```

## 🧪 테스트 전략

### 테스트 레벨

#### 1. 단위 테스트 (Unit Tests)
- **도구**: Vitest + React Testing Library
- **대상**: Hooks, Utils, Services
- **목표 커버리지**: 85%

```typescript
// Example: useAuth.test.ts
describe('useAuth Hook', () => {
  it('should return user when authenticated', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeDefined();
  });
});
```

#### 2. 통합 테스트 (Integration Tests)
- **도구**: Vitest + MSW (API Mocking)
- **대상**: API 통신, 컴포넌트 상호작용
- **목표 커버리지**: 70%

#### 3. E2E 테스트 (End-to-End Tests)
- **도구**: Playwright (planned)
- **대상**: 핵심 사용자 플로우
- **시나리오**:
  - 로그인 → 장소 추가 → 검색 → 수정
  - 필터링 → 우선순위 변경 → 삭제

### 테스트 자동화
```bash
# Pre-commit Hook
npm run lint && npm run type-check && npm run test

# Pre-push Hook
npm run test:coverage

# CI Pipeline
npm run test:ci
```

## 🔐 보안 요구사항

### 인증 및 권한

#### OAuth 2.0 설정
```typescript
// Google OAuth Configuration
const provider = 'google';
const redirectTo = `${window.location.origin}/auth/callback`;

await supabase.auth.signInWithOAuth({
  provider,
  options: {
    redirectTo,
    scopes: 'email profile'
  }
});
```

#### Row Level Security (RLS)
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own places" ON places
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own places" ON places
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own places" ON places
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own places" ON places
  FOR DELETE USING (auth.uid() = user_id);
```

### 보안 체크리스트

#### Application Security
- [x] HTTPS 강제
- [x] CORS 설정
- [x] CSP Headers
- [x] XSS Protection
- [x] SQL Injection Prevention (Supabase)
- [ ] Rate Limiting
- [ ] Input Validation
- [ ] Output Encoding

#### Data Security
- [x] 전송 중 암호화 (TLS)
- [x] 저장 시 암호화 (Supabase)
- [x] PII 최소 수집
- [ ] GDPR Compliance
- [ ] 데이터 익명화

#### Infrastructure Security
- [x] Environment Variables
- [x] Secure Headers
- [x] Dependency Scanning
- [ ] Security Audits
- [ ] Penetration Testing

## 📊 성능 최적화

### Frontend 최적화

#### Bundle Size 최적화
```javascript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    }
  }
}
```

#### 이미지 최적화
- Lazy Loading 적용
- WebP 포맷 사용
- Responsive Images
- CDN 캐싱

### Database 최적화

#### 인덱스 전략
```sql
-- 자주 사용되는 쿼리 최적화
CREATE INDEX idx_places_user_id ON places(user_id);
CREATE INDEX idx_places_priority ON places(priority);
CREATE INDEX idx_places_category ON places(category);
CREATE INDEX idx_places_visited ON places(visited);
```

#### 쿼리 최적화
- Pagination 적용 (limit/offset)
- Select 필드 최소화
- N+1 문제 방지

### 네트워크 최적화
- HTTP/2 Push
- Brotli Compression
- Prefetching/Preloading
- Service Worker Caching

## 🚨 운영 및 모니터링

### 로깅 전략

#### Application Logs
```typescript
// 로그 레벨
enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

// 구조화된 로깅
logger.info('User action', {
  action: 'place_created',
  userId: user.id,
  placeId: place.id,
  timestamp: new Date()
});
```

#### Error Tracking
```typescript
// Sentry Integration (planned)
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1
});
```

### 모니터링 메트릭

#### Application Metrics
- Page Load Time
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- API Response Time
- Error Rate

#### Business Metrics
- Daily Active Users (DAU)
- Places Created/Day
- Search Queries/Day
- Average Session Duration

### Incident Response

#### Severity Levels
1. **P1 (Critical)**: 서비스 전체 중단
2. **P2 (High)**: 핵심 기능 장애
3. **P3 (Medium)**: 부분 기능 장애
4. **P4 (Low)**: 마이너 이슈

#### Response Playbook
1. **탐지**: 자동 알림 시스템
2. **분석**: 로그 및 메트릭 확인
3. **대응**: 롤백 또는 핫픽스
4. **복구**: 서비스 정상화
5. **사후분석**: RCA 작성

## 🔄 기술 부채 관리

### 현재 기술 부채

#### 높은 우선순위
- [ ] 테스트 커버리지 부족 (현재 0%)
- [ ] TypeScript strict mode 미적용
- [ ] 에러 핸들링 표준화 필요

#### 중간 우선순위
- [ ] 컴포넌트 문서화 (Storybook)
- [ ] 성능 모니터링 도구 부재
- [ ] 로깅 시스템 구축 필요

#### 낮은 우선순위
- [ ] CSS-in-JS 마이그레이션 검토
- [ ] 모노레포 구조 전환 검토
- [ ] GraphQL 도입 검토

### 기술 로드맵

#### Q1 2025
- Vitest 테스트 환경 구축
- GitHub Actions CI/CD 완성
- Sentry 에러 트래킹 도입

#### Q2 2025
- Storybook 컴포넌트 문서화
- Performance Budget 설정
- PWA 기능 구현

#### Q3 2025
- React Native 앱 개발
- GraphQL API 검토
- 마이크로서비스 아키텍처 검토

## 📚 기술 문서 및 참고자료

### 내부 문서
- [개발 가이드](./docs/guides/development.md)
- [API 문서](./docs/api/README.md)
- [컴포넌트 가이드](./docs/components/README.md)

### 외부 참고자료
- [React 공식 문서](https://react.dev)
- [Supabase 문서](https://supabase.com/docs)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### 팀 규칙
- **코드 스타일**: Prettier + ESLint
- **커밋 메시지**: Conventional Commits
- **브랜치 전략**: Git Flow
- **코드 리뷰**: PR 필수

---

**문서 버전**: 1.0.0
**작성일**: 2025-11-16
**작성자**: MoAI Project Manager Agent
**다음 검토일**: 2025-12-01