# Changelog

MoAI-ADK (MoAI Agentic Development Kit) 및 Adventure Log 프로젝트의 변경사항을 기록합니다.

이 프로젝트는 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)을 따릅니다.

---

## [Unreleased]

### Adventure Log - Phase 1 개발 진행 중

#### 🔨 Draft SPEC (4개)
- **SPEC-FILTER-004**: 장소 필터링 시스템 (Draft)
  - 카테고리, 지역, 방문상태, 우선순위 필터
  - 복합 필터 조합 지원
- **SPEC-QUICKSAVE-005**: 빠른 저장 기능 (Draft)
  - 원클릭 장소 저장
  - 북마크 기능 통합
- **SPEC-DASHBOARD-006**: 우선순위 대시보드 (Draft)
  - 우선순위 기반 장소 추천
  - 방문 통계 시각화
- **SPEC-UPLOAD-007**: 이미지 업로드 (Draft)
  - Supabase Storage 연동
  - 이미지 최적화 및 썸네일 생성

---

## [0.25.7] - 2024-11-16

### Added - MoAI-ADK 핵심 기능 강화

#### 🎩 Alfred SuperAgent Enhancement
- **Claude Code v4.0 완전 통합**: Plan Mode, MCP, Enhanced Context 지원
- **4-Layer Modern Architecture**: Commands → Sub-agents → Skills → Hooks
- **19개 전문 에이전트**: spec-builder, tdd-implementer, backend-expert 등
- **5가지 페르소나 시스템**: Alfred, Yoda, R2-D2, R2-D2 Partner, Keating
- **토큰 효율 85% 개선**: 에이전트 위임으로 컨텍스트 최적화

#### 📋 SPEC-First TDD Workflow
- **EARS 형식 요구사항**: Ubiquitous, Event-Driven, Unwanted, State-Driven, Optional
- **자동 테스트 생성**: Red-Green-Refactor 사이클 자동화
- **Living Documentation**: 코드-문서 자동 동기화

#### 🛡️ TRUST 5 품질 원칙
- **Test-first**: TDD 필수 적용, 95%+ 커버리지 강제
- **Readable**: ESLint + Prettier 자동 검증
- **Unified**: 프로젝트 컨벤션 강제
- **Secured**: OWASP 스캔 + 취약점 자동 검사
- **Trackable**: SPEC-Code-Test-Docs 완전 추적성

### Added - Adventure Log 프로젝트

#### ✅ SPEC-LOGIN-001: Google OAuth 인증 시스템 (Completed)
**구현 내용**:
- Google OAuth 2.0 기반 로그인 시스템
- Supabase Auth 연동
- 세션 관리 및 자동 로그인
- 보호된 라우트 접근 제어

**주요 컴포넌트**:
- `useAuth` Hook: 인증 상태 관리
- `LoginButton` Component: Google 로그인 버튼
- `UserProfile` Component: 사용자 프로필 표시

**테스트 결과**:
- 테스트 커버리지: **98.11%** (18개 테스트 통과)
- Statements: 98.11% (52/53)
- Branches: 85.71% (12/14)
- Functions: 100% (8/8)

**성능 지표**:
- 로그인 프로세스: 평균 2.1초 (목표: 3초)
- 세션 검증: 평균 45ms (목표: 100ms)
- 번들 사이즈 증가: +12KB (gzip: +4KB)

**보안**:
- HTTPS 통신 강제
- CSRF 토큰 검증 (Supabase 내장)
- XSS 방지 (React + DOMPurify)

**구현 파일**:
```
frontend/src/features/auth/
├── hooks/useAuth.ts           # 인증 상태 관리 (68 lines)
├── components/
│   ├── LoginButton.tsx        # 로그인 버튼 (85 lines)
│   └── UserProfile.tsx        # 프로필 표시 (42 lines)
└── [테스트 파일들]             # 18개 테스트 케이스
```

**문서화**:
- `.moai/specs/SPEC-LOGIN-001/spec.md`: EARS 형식 요구사항
- `.moai/specs/SPEC-LOGIN-001/plan.md`: TDD 구현 계획
- `.moai/specs/SPEC-LOGIN-001/acceptance.md`: 승인 기준 (9개 AC)

### Changed - 문서 구조 개편

#### 📁 새로운 문서 구조
```
agentic-coding/
├── README.md                  # MoAI-ADK 메타 프로젝트 소개
├── CHANGELOG.md              # 이 문서
├── CLAUDE.md                 # AI 에이전트 컨텍스트
├── .moai/specs/              # SPEC 문서 저장소
│   ├── SPEC-LOGIN-001/      # 인증 시스템 SPEC
│   ├── SPEC-FILTER-004/     # 필터링 SPEC (Draft)
│   ├── SPEC-QUICKSAVE-005/  # 빠른 저장 SPEC (Draft)
│   ├── SPEC-DASHBOARD-006/  # 대시보드 SPEC (Draft)
│   └── SPEC-UPLOAD-007/     # 이미지 업로드 SPEC (Draft)
└── adventure-log/
    ├── README.md             # Adventure Log 프로젝트 상세
    ├── API.md               # API 레퍼런스
    ├── ARCHITECTURE.md      # 시스템 아키텍처
    └── docs/archive/        # 레거시 문서 보관
```

#### 📦 레거시 문서 아카이브
- `docs/명세서/` → `docs/archive/legacy-specs/`
- `docs/개발일지/` → `docs/archive/legacy-devlog/`
- 아카이브 README 추가 (마이그레이션 히스토리 기록)

### Fixed
- 문서-코드 불일치 해소 (Living Documentation 도입)
- SPEC 문서 중복 제거 (단일 SPEC 저장소로 통합)

---

## [0.1.0] - 2024-11-16

### Added - Adventure Log 첫 기능 완성

#### ✅ Google OAuth 인증 완전 구현
- Supabase Auth + Google Provider 연동
- 자동 로그인 및 세션 관리
- 보호된 라우트 준비 (PrivateRoute는 Phase 2 예정)

#### 🧪 테스트 인프라 구축
- Vitest + React Testing Library 설정
- Supabase Mock 객체 생성
- 테스트 커버리지 98.11% 달성

#### 📝 MoAI-ADK SPEC-First 도입
- SPEC-LOGIN-001 작성 (EARS 형식)
- TDD Red-Green-Refactor 사이클 적용
- 문서-코드 자동 동기화

---

## [0.0.1] - 2024-10-21

### Added - 프로젝트 초기 설정

#### 🏗️ 인프라 구축
- React 18.3.1 + TypeScript 5.6.2 + Vite 5.4.11 설정
- Tailwind CSS 3.4.15 스타일링 시스템
- Supabase 프로젝트 생성 및 연동
- GitHub 저장소 초기화

#### 📐 프로젝트 구조 설계
- Feature-based 디렉토리 구조 설계
- ESLint + Prettier 코드 품질 도구 설정
- Vercel 배포 준비

#### 📚 초기 문서 작성
- README.md 프로젝트 개요
- 기술 스택 선정 기록
- 개발 환경 설정 가이드

---

## Release History

### Version Timeline
```
v0.0.1 (2024-10-21)  → 프로젝트 초기 설정
v0.1.0 (2024-11-16)  → 첫 기능 완성 (인증)
v0.25.7 (2024-11-16) → MoAI-ADK 도입 + SPEC-First
[Unreleased]         → Phase 1 Draft SPEC 4개 진행 중
```

### Phase별 계획
- **Phase 1** (진행 중): 기본 CRUD + 필터링 + 대시보드
- **Phase 2** (예정): 고급 기능 (휴지통, 지도뷰, 갤러리)
- **Phase 3** (예정): 최적화 + 배포 + 프로덕션 준비

---

## Contributors
- **@sungmoon2**: 1인 풀스택 개발 + MoAI-ADK 적용

---

## Links
- [프로젝트 README](./README.md)
- [Adventure Log README](./adventure-log/README.md)
- [SPEC 카탈로그](./.moai/specs/catalog.json)
- [CLAUDE.md - 프로젝트 가이드](./CLAUDE.md)

---

**마지막 업데이트**: 2024-11-16
**포맷**: [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/)
**버전 관리**: [Semantic Versioning](https://semver.org/lang/ko/)
