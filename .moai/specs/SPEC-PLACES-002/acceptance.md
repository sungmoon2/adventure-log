# Acceptance Criteria - SPEC-PLACES-002

---
id: SPEC-PLACES-002-ACCEPTANCE
spec_ref: SPEC-PLACES-002
title: 장소 CRUD 시스템 인수 조건
version: 1.0.0
created_date: 2025-01-16
tags: [acceptance, testing, bdd, given-when-then]
---

## Executive Summary

장소 CRUD 시스템의 성공적인 구현을 검증하기 위한 상세한 인수 조건과 테스트 시나리오입니다. 모든 시나리오는 Given-When-Then 형식으로 작성되어 명확한 검증 기준을 제공합니다.

## Critical User Journeys

### Journey 1: 첫 장소 등록하기
```
AS A 로그인한 사용자
I WANT TO 방문하고 싶은 맛집을 등록
SO THAT 나중에 참고할 수 있도록
```

### Journey 2: 장소 정보 수정하기
```
AS A 로그인한 사용자
I WANT TO 등록된 장소 정보를 수정
SO THAT 최신 정보를 유지할 수 있도록
```

### Journey 3: 장소 찾기 및 필터링
```
AS A 로그인한 사용자
I WANT TO 등록된 장소를 쉽게 찾고
SO THAT 원하는 장소를 빠르게 확인할 수 있도록
```

## Acceptance Scenarios

### Scenario 1: 새로운 장소 등록

**GIVEN** 사용자가 로그인된 상태이고
**AND** 장소 목록 페이지에 있을 때
**WHEN** "새 장소 추가" 버튼을 클릭하고
**AND** 필수 정보(이름: "수유리 우동", 카테고리: "식당")를 입력하고
**AND** "저장" 버튼을 클릭하면
**THEN** 새 장소가 목록에 즉시 표시되어야 하고
**AND** 성공 토스트 메시지가 표시되어야 하고
**AND** 장소의 기본 상태는 "미방문"이어야 한다

### Scenario 2: Quick Save로 임시 저장

**GIVEN** 장소 생성 폼이 열려 있고
**WHEN** 최소 정보만 입력하고
**AND** "Quick Save" 버튼을 클릭하면
**THEN** 장소가 "draft" 상태로 저장되어야 하고
**AND** 목록에서 "임시저장" 배지가 표시되어야 하고
**AND** 나중에 수정하여 완성할 수 있어야 한다

### Scenario 3: 필수 필드 검증

**GIVEN** 장소 생성 폼이 열려 있고
**WHEN** 이름을 입력하지 않고 저장을 시도하면
**THEN** "이름은 필수입니다" 에러가 표시되어야 하고
**AND** 폼이 제출되지 않아야 한다

**WHEN** 카테고리를 선택하지 않고 저장을 시도하면
**THEN** "카테고리를 선택해주세요" 에러가 표시되어야 하고
**AND** 폼이 제출되지 않아야 한다

### Scenario 4: 팝업/축제 날짜 검증

**GIVEN** 장소 생성 폼에서 카테고리를 "팝업/축제"로 선택했을 때
**WHEN** 시작일과 종료일을 입력하지 않고 저장하면
**THEN** "팝업/축제는 시작일과 종료일이 필요합니다" 에러가 표시되어야 한다

**WHEN** 종료일을 시작일보다 이전으로 설정하면
**THEN** "종료일은 시작일 이후여야 합니다" 에러가 표시되어야 한다

### Scenario 5: 장소 정보 수정

**GIVEN** 등록된 장소 "수유리 우동"이 있고
**WHEN** 수정 버튼을 클릭하고
**AND** 방문 상태를 "방문 완료"로 변경하고
**AND** 메모에 "국물이 진하고 면발이 쫄깃함"을 추가하고
**AND** 저장하면
**THEN** 변경사항이 즉시 UI에 반영되어야 하고
**AND** 서버와 동기화되어야 하고
**AND** updated_at이 갱신되어야 한다

### Scenario 6: 낙관적 업데이트와 롤백

**GIVEN** 장소를 수정 중이고
**WHEN** 네트워크 오류로 저장이 실패하면
**THEN** UI가 이전 상태로 롤백되어야 하고
**AND** "수정 실패" 에러 메시지가 표시되어야 하고
**AND** 재시도 옵션이 제공되어야 한다

### Scenario 7: 장소 삭제

**GIVEN** 등록된 장소가 있고
**WHEN** 삭제 버튼을 클릭하면
**THEN** "정말 삭제하시겠습니까?" 확인 다이얼로그가 표시되어야 한다

**WHEN** 삭제를 확인하면
**THEN** 장소가 목록에서 즉시 사라져야 하고
**AND** "장소가 삭제되었습니다" 토스트가 표시되어야 한다

**WHEN** 삭제를 취소하면
**THEN** 아무 변화 없이 다이얼로그만 닫혀야 한다

### Scenario 8: 카테고리별 필터링

**GIVEN** 다양한 카테고리의 장소 10개가 등록되어 있고
**WHEN** 카테고리 필터에서 "식당"을 선택하면
**THEN** "식당" 카테고리 장소만 표시되어야 하고
**AND** 결과 개수가 헤더에 표시되어야 한다

**WHEN** 필터를 해제하면
**THEN** 모든 장소가 다시 표시되어야 한다

### Scenario 9: 방문 상태별 필터링

**GIVEN** 미방문 5개, 방문 완료 3개의 장소가 있고
**WHEN** 방문 상태 필터에서 "방문 완료"를 선택하면
**THEN** 3개의 방문 완료 장소만 표시되어야 한다

### Scenario 10: 우선순위 정렬

**GIVEN** 다양한 우선순위의 장소들이 있고
**WHEN** 우선순위 정렬을 선택하면
**THEN** 다음 순서로 정렬되어야 한다:
  1. 🔥 최우선
  2. ✨ 꼭 가볼 곳
  3. 일반
**AND** 같은 우선순위 내에서는 최신순으로 정렬되어야 한다

### Scenario 11: 키워드 검색

**GIVEN** "한식", "일식", "중식" 키워드를 가진 장소들이 있고
**WHEN** 검색창에 "일식"을 입력하면
**THEN** 키워드에 "일식"이 포함된 장소만 표시되어야 하고
**AND** 검색어가 하이라이트되어야 한다

### Scenario 12: 주소 검색

**GIVEN** 다양한 지역의 장소들이 등록되어 있고
**WHEN** "강남"으로 검색하면
**THEN** 주소에 "강남"이 포함된 모든 장소가 표시되어야 한다

### Scenario 13: 페이지네이션

**GIVEN** 50개의 장소가 등록되어 있고
**WHEN** 장소 목록을 조회하면
**THEN** 첫 20개만 표시되어야 하고
**AND** "더 보기" 버튼이 표시되어야 한다

**WHEN** "더 보기"를 클릭하면
**THEN** 다음 20개가 추가로 로드되어야 하고
**AND** 스크롤 위치가 유지되어야 한다

### Scenario 14: 장소 상세 보기

**GIVEN** 장소 카드가 표시되어 있고
**WHEN** 카드를 클릭하면
**THEN** 모달이 열리며 전체 정보가 표시되어야 하고
**AND** 수정/삭제 버튼이 포함되어야 한다

**WHEN** 외부 링크(source_url)가 있으면
**THEN** 클릭 가능한 링크로 표시되어야 한다

### Scenario 15: 빈 상태 처리

**GIVEN** 사용자가 처음 로그인했고
**WHEN** 장소 목록 페이지에 접근하면
**THEN** "아직 등록된 장소가 없습니다" 메시지가 표시되어야 하고
**AND** "첫 장소 추가하기" CTA 버튼이 표시되어야 한다

### Scenario 16: 로딩 상태

**GIVEN** 장소 목록을 불러오는 중이고
**WHEN** 데이터 로딩이 진행 중이면
**THEN** 스켈레톤 UI가 표시되어야 하고
**AND** 실제 컨텐츠와 유사한 레이아웃이어야 한다

### Scenario 17: 에러 처리

**GIVEN** 네트워크 오류가 발생했고
**WHEN** 장소 목록 로드가 실패하면
**THEN** "데이터를 불러올 수 없습니다" 에러 메시지가 표시되어야 하고
**AND** "다시 시도" 버튼이 표시되어야 한다

**WHEN** "다시 시도"를 클릭하면
**THEN** 데이터 로드를 재시도해야 한다

### Scenario 18: RLS 정책 검증

**GIVEN** 사용자 A와 사용자 B가 있고
**WHEN** 사용자 A가 장소를 등록하면
**THEN** 사용자 A만 해당 장소를 볼 수 있어야 하고
**AND** 사용자 B는 볼 수 없어야 한다

### Scenario 19: 세션 만료 처리

**GIVEN** 사용자가 장소를 편집 중이고
**WHEN** 세션이 만료되면
**THEN** "세션이 만료되었습니다" 메시지가 표시되어야 하고
**AND** 로그인 페이지로 리다이렉트되어야 하고
**AND** 편집 중인 데이터는 로컬에 임시 저장되어야 한다

### Scenario 20: 모바일 반응형 동작

**GIVEN** 모바일 디바이스에서 접속했고
**WHEN** 장소 목록을 조회하면
**THEN** 카드가 세로 스택으로 표시되어야 하고
**AND** 스와이프로 삭제 제스처가 지원되어야 한다

**WHEN** 필터를 열면
**THEN** 하단 시트로 표시되어야 한다

## Performance Acceptance Criteria

### Response Time Requirements

| Operation | Target | Maximum |
|-----------|--------|---------|
| 목록 조회 (20개) | < 300ms | 500ms |
| 단일 조회 | < 200ms | 300ms |
| 생성/수정 | < 500ms | 1000ms |
| 삭제 | < 300ms | 500ms |
| 검색 | < 400ms | 600ms |

### Quality Metrics

- **Code Coverage**: ≥ 95%
- **TypeScript Coverage**: 100%
- **Lighthouse Performance**: > 90
- **Accessibility Score**: 100 (WCAG 2.1 AA)
- **Bundle Size**: < 500KB (places feature)

## Test Data Setup

### Minimum Test Dataset

```typescript
const testPlaces = [
  // 카테고리별 최소 2개
  { name: "수유리 우동", category: "식당", priority: "🔥 최우선" },
  { name: "진짜 파스타", category: "식당", visit_status: "방문 완료" },
  { name: "블루보틀", category: "카페", region_main: "강남" },
  { name: "스타벅스 리저브", category: "카페", priority: "✨ 꼭 가볼 곳" },
  { name: "팀랩 전시", category: "문화/여가", visit_status: "방문 완료" },
  { name: "한강 피크닉", category: "명소", keywords: ["야외", "피크닉"] },
  { name: "성수 팝업", category: "팝업/축제", start_date: "2025-01-15", end_date: "2025-02-15" },

  // Edge cases
  { name: "긴 이름 " + "테스트".repeat(50), category: "식당" }, // 긴 이름
  { name: "특수문자 !@#$%", category: "카페" }, // 특수문자
  { name: "이모지 🍕🍔🍟", category: "식당" }, // 이모지
];
```

## Definition of Done

A feature is considered "Done" when:

- [ ] All acceptance scenarios pass
- [ ] Unit test coverage ≥ 95%
- [ ] Integration tests complete
- [ ] Code review approved
- [ ] No TypeScript errors
- [ ] No console errors/warnings
- [ ] Performance metrics met
- [ ] Accessibility audit passed
- [ ] Documentation updated
- [ ] Deployed to staging environment

## Non-Functional Requirements

### Security
- All API calls must include authentication token
- RLS policies must be enforced
- Input sanitization for XSS prevention
- SQL injection prevention via parameterized queries

### Accessibility
- All interactive elements keyboard accessible
- ARIA labels for screen readers
- Color contrast ratio ≥ 4.5:1
- Focus indicators visible

### Browser Compatibility
- Chrome 120+
- Safari 17+
- Firefox 120+
- Mobile Safari (iOS 16+)
- Chrome Mobile (Android 12+)

## Risk Acceptance

### Known Limitations
1. 이미지 업로드는 Phase 2에서 구현
2. 오프라인 모드는 기본 수준만 지원
3. 실시간 동기화는 미지원 (수동 새로고침 필요)

### Accepted Risks
1. 대량 데이터(1000개+) 성능 저하 가능 → Phase 2에서 가상 스크롤 도입
2. 동시 수정 시 마지막 수정 우선 → Phase 3에서 충돌 해결 로직 추가

## Rollback Plan

If critical issues are found in production:

1. **Immediate**: Feature flag로 CRUD 기능 비활성화
2. **Short-term**: 이전 버전으로 롤백
3. **Data**: 백업에서 복구 (Supabase point-in-time recovery)

## Tags

`[TAG:SPEC-PLACES-002]` `[TAG:ACCEPTANCE]` `[TAG:BDD]` `[TAG:TESTING]`