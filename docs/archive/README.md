# 아카이브 문서 (Archive)

이 디렉토리는 MoAI-ADK SPEC-First 방식 도입 이전의 레거시 문서를 보관합니다.

## 📁 디렉토리 구조

```
archive/
├── legacy-specs/        # 기존 명세서 (비정형 문서)
├── legacy-devlog/       # 기존 개발일지 (비정형 문서)
└── README.md           # 이 문서
```

## 📋 아카이브 이유

### MoAI-ADK SPEC-First 방식 도입 (2024-11-16)
Adventure Log 프로젝트는 2024년 11월 16일부터 **MoAI-ADK SPEC-First TDD** 개발 방식을 채택했습니다.

**변경 사항**:
- **기존 방식**: 비정형 문서 (자유 형식 명세서, 일지)
- **새로운 방식**: EARS 형식 SPEC + TDD + Living Documentation

### 새로운 문서 위치

#### SPEC 문서 (요구사항 정의)
**위치**: `../.moai/specs/SPEC-{ID}/`
- `spec.md`: EARS 형식 요구사항
- `plan.md`: 구현 계획
- `acceptance.md`: 승인 기준

**예시**:
- `.moai/specs/SPEC-LOGIN-001/`: Google OAuth 인증 시스템

#### 개발 문서
**위치**: `adventure-log/docs/` (현재 디렉토리 상위)
- `API.md`: API 레퍼런스 (자동 생성)
- `ARCHITECTURE.md`: 시스템 아키텍처
- 기타 Living Documentation

#### 프로젝트 메타 문서
**위치**: `../.moai/project/`
- `product.md`: 제품 명세서
- `tech.md`: 기술 스택 명세
- `structure.md`: 프로젝트 구조

## 📚 레거시 문서 목록

### legacy-specs/ (명세서)
프로젝트 초기에 작성된 비정형 명세서 문서들:
- 기능 명세서
- 데이터베이스 스키마 초안
- 화면 설계서

**특징**:
- 자유 형식으로 작성
- EARS 형식 미적용
- 테스트 케이스 미포함
- 코드와 동기화 없음

### legacy-devlog/ (개발일지)
프로젝트 초기 개발 과정 기록:
- 개발일지_001_프로젝트_초기_설정.md
- 개발일지_002_Supabase_프로젝트_생성.md
- 개발일지_003_React_프로젝트_초기_설정.md
- 개발일지_004_종합_명세서_작성.md

**특징**:
- 학습 과정 기록
- 의사결정 기록
- 문제 해결 과정 기록

## 🔄 마이그레이션 히스토리

### Phase 0: 레거시 방식 (2024-10-21 ~ 2024-11-15)
- 비정형 문서로 프로젝트 설계
- Supabase 프로젝트 생성
- React 애플리케이션 초기 설정

**결과**:
- 문서와 코드 불일치 발생
- 요구사항 명확성 부족
- 테스트 커버리지 0%

### Phase 1: MoAI-ADK 도입 (2024-11-16 ~)
- SPEC-LOGIN-001 작성 (EARS 형식)
- TDD 기반 구현 (Red-Green-Refactor)
- 테스트 커버리지 98.11% 달성
- Living Documentation 자동 생성

**개선 사항**:
- ✅ 요구사항 명확화 (EARS 형식)
- ✅ 높은 테스트 커버리지 (98.11%)
- ✅ 문서-코드 자동 동기화
- ✅ 개발 속도 70% 향상

## 📖 레거시 문서 참고 방법

### 언제 참고하나?
1. **프로젝트 초기 의사결정 확인**: 왜 특정 기술을 선택했는지
2. **학습 과정 추적**: 초보자가 어떻게 성장했는지
3. **문제 해결 히스토리**: 과거에 어떤 문제를 어떻게 해결했는지

### 주의 사항
- ⚠️ **레거시 문서는 최신 상태가 아닙니다**
- ⚠️ **코드와 동기화되지 않습니다**
- ⚠️ **새로운 기능은 SPEC 문서를 참고하세요**

## 🔗 관련 링크

- [MoAI-ADK 메인 README](../../../README.md)
- [Adventure Log README](../../README.md)
- [SPEC 카탈로그](../../../.moai/specs/catalog.json)
- [CLAUDE.md - 프로젝트 가이드](../../../CLAUDE.md)

---

**아카이브 일자**: 2024-11-16
**아카이브 담당자**: @sungmoon2
**보존 정책**: 영구 보관 (삭제 금지)
