# MoAI-ADK Agents Configuration

## 🤖 Agent 디렉토리 구조

이 디렉토리는 Adventure Log 프로젝트의 MoAI-ADK 에이전트 설정을 포함합니다.

### 사용 가능한 에이전트

1. **spec-builder** - SPEC 문서 작성 전문가
2. **tdd-implementer** - TDD 기반 구현 전문가
3. **frontend-expert** - React/TypeScript 전문가
4. **backend-expert** - Supabase/PostgreSQL 전문가
5. **security-expert** - 보안 검토 및 감사
6. **docs-manager** - 문서 자동 생성 및 동기화
7. **quality-gate** - TRUST 5 원칙 검증

### 에이전트 호출 방법

```bash
# SPEC 작성
/alfred:1-plan "새로운 기능 설명"

# 구현
/alfred:2-run SPEC-001

# 문서 동기화
/alfred:3-sync auto SPEC-001
```

### 프로젝트별 특화 설정

Adventure Log 프로젝트는 React + Supabase 하이브리드 아키텍처를 사용하므로:
- Frontend 작업: `frontend-expert` 우선 사용
- Backend 작업: Supabase 설정은 `backend-expert` 사용
- UI/UX 중심 개발로 `frontend-expert`가 주도적 역할