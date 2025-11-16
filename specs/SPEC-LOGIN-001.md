# SPEC-LOGIN-001: 사용자 인증 시스템

## 📋 요약
Google OAuth를 통한 사용자 인증 및 세션 관리

## 🎯 목표
- 사용자가 Google 계정으로 로그인할 수 있어야 함
- 로그인 상태가 유지되어야 함
- 로그아웃이 가능해야 함

## 📐 EARS 형식 요구사항

### UBIQUITOUS (항상)
- The system SHALL display a login button on the landing page
- The system SHALL maintain user session after successful authentication
- The system SHALL protect private routes from unauthenticated access

### EVENT-DRIVEN (이벤트)
- WHEN user clicks "Google로 로그인" button
  - The system SHALL redirect to Google OAuth consent screen
- WHEN Google authentication succeeds
  - The system SHALL create user session in Supabase
  - The system SHALL redirect to dashboard page
- WHEN user clicks logout
  - The system SHALL clear session and redirect to landing page

### UNWANTED BEHAVIOR (방지)
- IF Google authentication fails
  - THEN the system SHALL display error message
  - THEN the system SHALL NOT create session
- IF user is not authenticated
  - THEN the system SHALL NOT allow access to /dashboard route

### STATE-DRIVEN (상태)
- WHILE user session is active
  - The system SHALL display user profile in header
  - The system SHALL allow access to protected routes
- WHILE user is not authenticated
  - The system SHALL display login button
  - The system SHALL redirect protected routes to login

### OPTIONAL (선택)
- WHERE user enables "remember me"
  - The system SHALL extend session duration to 30 days

## ✅ 승인 기준

### 기능 테스트
- [ ] Google 로그인 버튼 클릭 시 OAuth 화면으로 이동
- [ ] 인증 성공 시 대시보드로 리다이렉트
- [ ] 인증 실패 시 에러 메시지 표시
- [ ] 로그아웃 시 세션 종료 및 랜딩 페이지로 이동
- [ ] 비인증 사용자의 보호된 경로 접근 차단

### 성능 기준
- 로그인 프로세스: 3초 이내
- 세션 검증: 100ms 이내

### 보안 기준
- HTTPS 통신 필수
- Supabase Row Level Security 활성화
- CSRF 토큰 검증

## 🔧 기술 구현

### Frontend (React)
```typescript
// lib/auth.ts
- useAuth() hook: 인증 상태 관리
- PrivateRoute component: 보호된 라우트
- LoginButton component: Google OAuth 트리거

// Supabase Client
- supabase.auth.signInWithOAuth({ provider: 'google' })
- supabase.auth.signOut()
- supabase.auth.onAuthStateChange()
```

### Backend (Supabase)
```sql
-- Row Level Security Policies
- users 테이블: auth.uid() = user_id
- places 테이블: auth.uid() = user_id
```

## 📊 테스트 시나리오

### 단위 테스트
1. useAuth hook이 인증 상태를 올바르게 반환
2. PrivateRoute가 비인증 사용자를 차단
3. LoginButton이 OAuth URL을 올바르게 생성

### 통합 테스트
1. 전체 로그인 플로우 (E2E)
2. 세션 만료 처리
3. 동시 로그인 제한

### 보안 테스트
1. SQL 인젝션 방지
2. XSS 방지
3. CSRF 방지

## 📝 문서화
- API 문서: Supabase Auth API 사용법
- 사용자 가이드: 로그인 방법
- 개발자 가이드: 인증 훅 사용법

---
**Status**: 🟡 In Progress
**Created**: 2024-11-16
**Updated**: 2024-11-16
**Owner**: @sungmoon2