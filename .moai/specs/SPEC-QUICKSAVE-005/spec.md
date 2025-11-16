# SPEC-QUICKSAVE-005: 빠른 저장 - URL 입력만으로 최소 정보 저장

## Metadata
```yaml
spec_id: SPEC-QUICKSAVE-005
version: 0.1.0
status: draft
created: 2025-11-16
priority: high
domain: [frontend, backend]
tags: [quick-capture, url-processing, metadata-extraction]
```

## Overview
URL 입력만으로 콘텐츠를 빠르게 저장할 수 있는 최소 정보 캡처 시스템. 사용자가 URL을 입력하면 시스템이 자동으로 메타데이터를 추출하고 초안 상태로 저장하여, 나중에 완성할 수 있도록 지원합니다.

## EARS Requirements

### Environment
- **E1**: 웹 브라우저 환경 (Chrome, Safari, Firefox 최신 버전)
- **E2**: 모바일 디바이스 (iOS 14+, Android 10+)
- **E3**: 네트워크 연결 상태 (온라인/오프라인 모드 지원)
- **E4**: URL 메타데이터 추출 서비스 연동
- **E5**: 로컬 스토리지 및 백엔드 동기화

### Assumptions
- **A1**: 사용자는 유효한 URL을 입력한다고 가정
- **A2**: 메타데이터 추출 API는 95% 이상의 가용성을 유지한다고 가정
- **A3**: 사용자는 초안 상태의 콘텐츠를 나중에 편집할 의도가 있다고 가정
- **A4**: 모바일 사용자가 전체 사용자의 60% 이상을 차지한다고 가정
- **A5**: 평균 저장 시간은 5초 이내여야 한다고 가정

### Requirements

#### Ubiquitous (항상 적용)
- **R1**: 시스템은 URL 입력 필드를 제공해야 한다 (SHALL)
- **R2**: 시스템은 입력된 URL의 유효성을 검증해야 한다 (SHALL)
- **R3**: 시스템은 저장된 모든 항목에 고유 ID를 부여해야 한다 (SHALL)
- **R4**: 시스템은 초안 상태를 명확하게 표시해야 한다 (SHALL)
- **R5**: 시스템은 모바일 우선 반응형 디자인을 제공해야 한다 (SHALL)

#### Event-Driven (이벤트 기반)
- **R6**: WHEN 사용자가 URL을 입력하면, 시스템은 실시간으로 URL 형식을 검증해야 한다 (SHALL)
- **R7**: WHEN 유효한 URL이 입력되면, 시스템은 즉시 메타데이터 추출을 시작해야 한다 (SHALL)
- **R8**: WHEN 저장 버튼이 클릭되면, 시스템은 3초 이내에 저장을 완료해야 한다 (SHALL)
- **R9**: WHEN 메타데이터 추출이 완료되면, 시스템은 미리보기를 자동으로 표시해야 한다 (SHALL)
- **R10**: WHEN 네트워크 연결이 끊어지면, 시스템은 로컬 스토리지에 임시 저장해야 한다 (SHALL)

#### Unwanted Behavior (원치 않는 동작 방지)
- **R11**: IF URL이 잘못된 형식이면, THEN 시스템은 저장을 차단하고 오류 메시지를 표시해야 한다 (SHALL)
- **R12**: IF 메타데이터 추출이 실패하면, THEN 시스템은 URL만으로 초안을 생성해야 한다 (SHALL)
- **R13**: IF 중복 URL이 입력되면, THEN 시스템은 기존 항목 업데이트 옵션을 제공해야 한다 (SHALL)
- **R14**: IF 저장 중 오류가 발생하면, THEN 시스템은 재시도 옵션을 제공해야 한다 (SHALL)
- **R15**: IF 악성 URL이 감지되면, THEN 시스템은 저장을 거부하고 경고를 표시해야 한다 (SHALL)

#### State-Driven (상태 기반)
- **R16**: WHILE 메타데이터를 추출 중일 때, 시스템은 로딩 인디케이터를 표시해야 한다 (SHALL)
- **R17**: WHILE 오프라인 상태일 때, 시스템은 로컬 저장 모드를 활성화해야 한다 (SHALL)
- **R18**: WHILE 초안 상태일 때, 시스템은 편집 필요 배지를 표시해야 한다 (SHALL)
- **R19**: WHILE 동기화 중일 때, 시스템은 진행 상태를 표시해야 한다 (SHALL)
- **R20**: WHILE 모바일 뷰에서, 시스템은 터치 최적화된 UI를 제공해야 한다 (SHALL)

#### Optional (선택적 기능)
- **R21**: WHERE 사용자가 태그를 추가하려고 하면, 시스템은 자동 완성을 제공해야 한다 (SHALL)
- **R22**: WHERE 사용자가 설명을 추가하려고 하면, 시스템은 확장 입력 필드를 제공해야 한다 (SHALL)
- **R23**: WHERE 사용자가 미리보기를 원하면, 시스템은 추출된 이미지를 표시해야 한다 (SHALL)
- **R24**: WHERE 사용자가 일괄 입력을 원하면, 시스템은 여러 URL 동시 입력을 지원해야 한다 (SHALL)
- **R25**: WHERE 사용자가 단축키를 선호하면, 시스템은 Ctrl+V로 즉시 저장을 지원해야 한다 (SHALL)

### Specifications

#### 데이터 모델
```typescript
interface QuickSaveItem {
  id: string;              // UUID v4
  url: string;             // 필수
  title?: string;          // 자동 추출
  description?: string;    // 자동 추출
  thumbnail?: string;      // 자동 추출
  favicon?: string;        // 자동 추출
  tags?: string[];         // 선택적
  status: 'draft' | 'complete';
  createdAt: Date;
  updatedAt: Date;
  syncStatus: 'pending' | 'synced' | 'failed';
}
```

#### API 엔드포인트
- `POST /api/quick-save` - URL 빠른 저장
- `POST /api/extract-metadata` - 메타데이터 추출
- `GET /api/quick-saves?status=draft` - 초안 목록 조회
- `PUT /api/quick-saves/:id` - 초안 업데이트
- `POST /api/quick-saves/batch` - 일괄 저장

#### 성능 요구사항
- URL 검증: < 100ms
- 메타데이터 추출: < 2s
- 저장 완료: < 3s
- UI 반응 시간: < 50ms
- 오프라인 전환: < 500ms

#### 보안 요구사항
- URL 소독 (XSS 방지)
- CSRF 토큰 검증
- Rate limiting (분당 30회)
- 악성 URL 검사
- Content Security Policy 적용

## Traceability
- **Parent**: SPEC-CORE-001 (핵심 데이터 모델)
- **Related**: SPEC-UI-002 (모바일 최적화 UI)
- **Dependencies**:
  - 메타데이터 추출 서비스
  - 로컬 스토리지 API
  - 백엔드 동기화 서비스

## Success Criteria
1. URL 입력에서 저장까지 3초 이내 완료
2. 메타데이터 추출 성공률 80% 이상
3. 모바일 사용자 만족도 4.5/5 이상
4. 오프라인 모드 정상 작동
5. 초안에서 완성으로의 전환율 60% 이상

## Risk Mitigation
1. **메타데이터 추출 실패**: 폴백으로 URL만 저장
2. **네트워크 불안정**: 로컬 스토리지 우선, 백그라운드 동기화
3. **악성 URL**: URL 검증 및 보안 스캐닝
4. **성능 저하**: 캐싱 및 지연 로딩 적용
5. **모바일 UX 문제**: 터치 타겟 최소 44px, 제스처 지원