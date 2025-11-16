# 🚀 Adventure Log 하이브리드 개발 전략

> React + Supabase 기존 구조 + MoAI-ADK 방법론 통합

## 📋 프로젝트 개요

Adventure Log는 **실용적인 하이브리드 전략**을 채택하여 개발됩니다:
- ✅ 기존 React + Supabase로 **빠른 MVP 개발**
- ✅ MoAI SPEC-First로 **체계적인 품질 관리**
- ✅ 점진적 개선으로 **기술 부채 최소화**

## 🏗️ 하이브리드 아키텍처

```
┌─────────────────────────────────────────────┐
│              Frontend (기존 유지)            │
│         React 18 + Vite + TypeScript        │
│              Tailwind CSS                   │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│           Backend (하이브리드)              │
│   Supabase (인증, DB, 스토리지) - 기존      │
│   + FastAPI (복잡한 비즈니스 로직) - 신규   │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│          개발 방법론 (MoAI-ADK)             │
│     SPEC-First → TDD → TRUST 5 검증        │
└─────────────────────────────────────────────┘
```

## 🔄 단계별 통합 계획

### Phase 1: 즉시 활용 (Week 1-2) ✅
**기존 코드 활용 + 기본 MoAI 설정**

```bash
# 1. React 프론트엔드 실행
cd frontend
npm install
npm run dev

# 2. Supabase 연결
# .env.local에 기존 Supabase 키 설정

# 3. MoAI 프로젝트 초기화 (완료)
/alfred:0-project
```

**작업 항목**:
- [x] React + Supabase 구조 유지
- [x] MoAI 프로젝트 설정
- [ ] 첫 SPEC 작성 (로그인 기능)

### Phase 2: 점진적 개선 (Week 3-4) 🔄
**새 기능은 SPEC-First로 개발**

```bash
# 새 기능 SPEC 작성
/alfred:1-plan "맛집 즐겨찾기 기능"

# TDD로 구현
/alfred:2-run SPEC-FAV-001

# 자동 문서화
/alfred:3-sync auto
```

**작업 항목**:
- [ ] 즐겨찾기 기능 SPEC 작성
- [ ] TDD로 백엔드 API 구현
- [ ] 프론트엔드 통합
- [ ] 테스트 커버리지 85% 달성

### Phase 3: 품질 자동화 (Week 5-6) 🎯
**CI/CD 및 품질 게이트 활성화**

```yaml
# .github/workflows/ci.yml
name: Quality Gate
on: [push, pull_request]
jobs:
  test:
    - npm test (프론트엔드)
    - pytest (백엔드)
    - TRUST 5 검증
```

**작업 항목**:
- [ ] GitHub Actions CI/CD 설정
- [ ] 자동 테스트 파이프라인
- [ ] 코드 품질 검사 (ESLint, Ruff)
- [ ] 자동 배포 (Vercel + Supabase)

## 📁 디렉토리 구조

```
adventure-log/
├── frontend/               # React 앱 (기존 유지)
│   ├── src/
│   │   ├── components/    # UI 컴포넌트
│   │   ├── pages/        # 페이지 컴포넌트
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Supabase 클라이언트
│   │   └── types/         # TypeScript 타입
│   └── package.json
│
├── backend/               # FastAPI (신규, 필요시)
│   ├── app/
│   │   ├── api/          # API 엔드포인트
│   │   ├── core/         # 설정
│   │   ├── models/       # 데이터 모델
│   │   └── services/     # 비즈니스 로직
│   └── requirements.txt
│
├── database/              # DB 스키마 (기존)
│   └── schema_001_initial.sql
│
├── specs/                 # SPEC 문서 (신규)
│   ├── SPEC-LOGIN-001.md
│   ├── SPEC-FAV-001.md
│   └── SPEC-SEARCH-001.md
│
├── tests/                 # 테스트 코드 (신규)
│   ├── frontend/         # React 테스트
│   └── backend/          # API 테스트
│
├── docs/                  # 문서 (기존 + 자동생성)
│   ├── 개발일지/         # 기존 유지
│   ├── 명세서/           # 기존 유지
│   └── api/              # 자동 생성
│
└── .claude/              # MoAI-ADK 설정
    ├── agents/           # 19개 전문 에이전트
    ├── commands/         # Alfred 명령어
    └── skills/           # 120+ Skills
```

## 🎯 개발 워크플로우

### 기존 기능 수정
```bash
1. React 컴포넌트 수정 (기존 방식)
2. Supabase 테이블/함수 수정 (기존 방식)
3. 수동 테스트
4. 커밋 & 푸시
```

### 새 기능 추가 (SPEC-First)
```bash
1. SPEC 작성: /alfred:1-plan "기능 설명"
2. TDD 구현: /alfred:2-run SPEC-XXX
3. 프론트엔드 통합
4. TRUST 5 검증 자동 실행
5. 문서 자동 생성: /alfred:3-sync
6. 커밋 & 푸시 (품질 게이트 통과)
```

## 💡 실용적 가이드라인

### DO ✅
- 기존 React 코드는 그대로 사용
- 새 기능만 SPEC-First로 개발
- Supabase는 인증/스토리지에 계속 활용
- 복잡한 로직만 FastAPI로 분리
- 점진적으로 테스트 추가

### DON'T ❌
- 기존 코드 전체 리팩토링 (불필요)
- Supabase 완전 제거 (장점 활용)
- 모든 것을 한번에 바꾸기
- 과도한 추상화
- 완벽주의 추구

## 🚦 품질 지표

### 현재 (Week 1)
- 테스트 커버리지: 0%
- 코드 품질: 미측정
- 문서화: 수동 작성

### 목표 (Week 6)
- 테스트 커버리지: 85%+
- 코드 품질: TRUST 5 통과
- 문서화: 100% 자동

### 측정 방법
```bash
# 프론트엔드 테스트
npm run test:coverage

# 백엔드 테스트 (추가 예정)
pytest --cov=app

# TRUST 5 검증
/alfred:2-run --validate-only
```

## 🛠️ 기술 스택

### Frontend (기존 유지)
- React 18.3
- Vite 5.4
- TypeScript 5.6
- Tailwind CSS 3.4
- Supabase Client 2.46

### Backend (하이브리드)
- Supabase (PostgreSQL, Auth, Storage)
- FastAPI (복잡한 비즈니스 로직용, 선택적)
- SQLAlchemy (ORM, 선택적)

### DevOps (신규)
- GitHub Actions (CI/CD)
- Vercel (프론트엔드 호스팅)
- pytest (백엔드 테스트)
- Jest/Vitest (프론트엔드 테스트)

### 개발 도구 (MoAI-ADK)
- SPEC-First 워크플로우
- TDD 자동화
- TRUST 5 품질 검증
- 자동 문서화

## 📈 예상 효과

### 단기 (1개월)
- ✅ MVP 완성 (기존 코드 활용)
- ✅ 핵심 기능 동작
- ⏳ 테스트 커버리지 50%

### 중기 (3개월)
- ✅ 주요 기능 완성
- ✅ 테스트 커버리지 85%
- ✅ 자동 배포 파이프라인
- ✅ 품질 게이트 활성화

### 장기 (6개월)
- ✅ 안정적 운영
- ✅ 버그 80% 감소
- ✅ 개발 속도 2배 향상
- ✅ 완전 자동화된 워크플로우

## 🔗 관련 문서

- [README.md](README.md) - 프로젝트 소개
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - 설정 가이드
- [CLAUDE.md](../agentic-coding/CLAUDE.md) - MoAI-ADK 상세
- [개발일지](docs/개발일지/) - 진행 기록

## 📞 문의

- GitHub: [@sungmoon2](https://github.com/sungmoon2)
- Email: sungmoon88@naver.com

---

**Last Updated**: 2024-11-16
**Strategy Version**: 1.0.0
**Status**: 🟢 Active Development