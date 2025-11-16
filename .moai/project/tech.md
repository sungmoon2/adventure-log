# Technical Document - Adventure Log

## 🛠️ 기술 스택

### Frontend

#### Core Framework
- **React** `19.1.1` - UI 라이브러리
- **TypeScript** `5.9.3` - 타입 안정성
- **Vite** `7.1.7` - 빌드 도구 및 개발 서버

#### UI & Styling
- **Tailwind CSS** `4.1.15` - Utility-first CSS framework
- **Framer Motion** `12.23.24` - 애니메이션 라이브러리
- **Lucide React** `0.546.0` - 아이콘 라이브러리

#### State Management & Data Fetching
- **TanStack Query** `5.90.5` - 서버 상태 관리 및 캐싱
- **React Hook Form** `7.65.0` - 폼 상태 관리 및 유효성 검사
- **React Router DOM** `7.9.4` - 클라이언트 라우팅

### Backend (BaaS)

#### Supabase Stack
- **PostgreSQL** `15.x` - 관계형 데이터베이스
- **Supabase Auth** - 인증 서비스 (Google OAuth)
- **Supabase Storage** - 파일 스토리지 (이미지)
- **Supabase Realtime** - 실시간 데이터 동기화
- **PostgREST** - RESTful API 자동 생성

### DevOps & Infrastructure

#### Hosting
- **Vercel** - Frontend 호스팅 및 자동 배포
- **Supabase Cloud** - Backend 인프라 (Free Tier)

#### Build & Bundle
- **Vite** - 번들링 및 최적화
- **ESBuild** - JavaScript/TypeScript 트랜스파일
- **PostCSS** - CSS 처리
- **Autoprefixer** - CSS 벤더 프리픽스

## 🔧 개발 환경

### 필수 도구
```json
{
  "node": ">=20.0.0",
  "npm": ">=10.0.0",
  "git": ">=2.40.0"
}
```

### IDE 설정
- **권장 IDE**: Visual Studio Code
- **필수 확장**:
  - ESLint
  - Prettier
  - TypeScript and JavaScript
  - Tailwind CSS IntelliSense
  - Git Lens

### 환경 변수
```env
# .env.local (Frontend)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# 환경별 설정
VITE_ENV=development|staging|production
VITE_DEBUG=true|false
```

## 🧪 테스팅 전략

### 테스트 레벨

#### Unit Tests (계획)
- **도구**: Vitest + React Testing Library
- **대상**: 유틸리티 함수, Custom Hooks
- **커버리지 목표**: 80%

#### Integration Tests (계획)
- **도구**: Playwright
- **대상**: 주요 사용자 플로우
- **시나리오**:
  - 로그인 → 장소 추가 → 검색
  - 필터링 → 수정 → 삭제

#### E2E Tests (계획)
- **도구**: Playwright
- **대상**: Critical Path
- **환경**: Staging 환경

### 테스트 자동화
```bash
# 테스트 실행 명령어
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:coverage # Coverage report
```

## 🚀 빌드 및 배포

### 빌드 프로세스

#### Development Build
```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
```

#### Production Build
```bash
npm run build
# Output: dist/ directory
# - Minified JavaScript
# - Optimized CSS
# - Compressed assets
```

### 배포 파이프라인

#### Vercel 자동 배포
1. **GitHub Push** → main branch
2. **Vercel Build** → 자동 트리거
3. **Preview Deployment** → PR별 미리보기
4. **Production Deployment** → main merge 시
5. **Rollback** → 이전 버전 즉시 복구 가능

#### 배포 체크리스트
- [ ] TypeScript 컴파일 성공
- [ ] ESLint 검사 통과
- [ ] 빌드 크기 체크 (< 500KB)
- [ ] 환경 변수 확인
- [ ] Supabase 연결 테스트

## 🔐 보안 요구사항

### 인증 & 권한
- **Google OAuth 2.0** 단독 인증
- **JWT 토큰** 유효기간 1시간
- **Refresh Token** 7일 유효
- **Row Level Security** 데이터 격리

### 데이터 보호
- **HTTPS Only** - TLS 1.3
- **CSP Headers** - XSS 방지
- **Input Sanitization** - SQL Injection 방지
- **Rate Limiting** - API 남용 방지

### 시크릿 관리
- **Environment Variables** - 민감 정보
- **Vercel Secrets** - 프로덕션 키
- **No Hardcoding** - 코드에 시크릿 금지

### OWASP Top 10 대응
1. **Injection**: Prepared statements (Supabase)
2. **Broken Auth**: OAuth 2.0 + MFA (계획)
3. **Sensitive Data**: HTTPS + Encryption
4. **XXE**: JSON only, no XML
5. **Access Control**: RLS + RBAC
6. **Misconfiguration**: Security headers
7. **XSS**: React 자동 이스케이핑
8. **Deserialization**: Type validation
9. **Known Vulnerabilities**: Dependabot
10. **Logging**: Audit trails (계획)

## 📊 성능 요구사항

### Performance Metrics
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTI** (Time to Interactive): < 3.5s

### 최적화 전략

#### Code Splitting
```typescript
// Lazy loading for routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Places = lazy(() => import('./pages/Places'));
```

#### Image Optimization
- WebP 포맷 우선
- Lazy loading 적용
- Responsive images
- CDN 캐싱 (Supabase Storage)

#### Bundle Optimization
- Tree shaking
- Minification
- Compression (gzip/brotli)
- Vendor chunk splitting

## 🔍 모니터링 & 로깅

### Application Monitoring
```typescript
// Vercel Analytics 통합
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
```

### Error Tracking (계획)
```typescript
// Sentry 통합
Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.VITE_ENV,
  tracesSampleRate: 0.1
});
```

### Custom Logging
```typescript
// 로깅 유틸리티
class Logger {
  info(message: string, data?: any) { }
  error(message: string, error: Error) { }
  warn(message: string, data?: any) { }
  debug(message: string, data?: any) { }
}
```

## 🛠️ 개발 도구 설정

### ESLint Configuration
```javascript
// eslint.config.js
export default {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error'
  }
};
```

### Prettier Configuration
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

## 📦 의존성 관리

### 주요 의존성 버전 정책
- **Major**: 수동 업데이트 (breaking changes 검토)
- **Minor**: 월 1회 검토 후 업데이트
- **Patch**: 자동 업데이트 (보안 패치)

### Dependency Audit
```bash
# 보안 취약점 검사
npm audit
npm audit fix

# 오래된 패키지 확인
npm outdated
```

## 🔄 CI/CD 파이프라인

### GitHub Actions (계획)
```yaml
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  test:
    - npm install
    - npm run lint
    - npm run type-check
    - npm run test

  build:
    - npm run build
    - Check bundle size

  deploy:
    - Vercel deployment
    - Smoke tests
```

## 📈 기술 부채 관리

### 현재 기술 부채
1. **테스트 코드 부재** - Priority: HIGH
2. **에러 핸들링 미비** - Priority: MEDIUM
3. **성능 모니터링 부재** - Priority: MEDIUM
4. **문서화 부족** - Priority: LOW

### 개선 계획
- **Q1 2025**: 테스트 인프라 구축
- **Q2 2025**: 에러 트래킹 도입
- **Q3 2025**: 성능 최적화
- **Q4 2025**: 문서 자동화

## 🚨 장애 대응

### Incident Response Plan
1. **Detection**: 모니터링 알림
2. **Triage**: 심각도 평가
3. **Communication**: 팀 알림
4. **Resolution**: 문제 해결
5. **Post-mortem**: 원인 분석

### Rollback Strategy
- Vercel 즉시 롤백 기능
- Database migration 롤백 스크립트
- Feature flag를 통한 기능 비활성화

## 📝 HISTORY

### 2025-11-16
- 기술 문서 작성
- 기술 스택 명세화
- 보안 요구사항 정의

### 2025-01-XX
- 초기 기술 스택 선정
- 개발 환경 구성
- CI/CD 파이프라인 설계