# MoAI-ADK Skills Configuration

## 📚 Skill 디렉토리 구조

Adventure Log 프로젝트에서 사용하는 MoAI-ADK 스킬 설정입니다.

### 활성화된 스킬

#### Language Skills
- **moai-lang-typescript** - TypeScript/React 최신 패턴
- **moai-lang-javascript** - JavaScript 유틸리티

#### Domain Skills
- **moai-domain-frontend** - 프론트엔드 아키텍처 패턴
- **moai-domain-backend** - Supabase/BaaS 패턴
- **moai-domain-security** - 보안 모범 사례

#### Essential Skills
- **moai-essentials-debug** - 디버깅 및 문제 해결
- **moai-essentials-perf** - 성능 최적화
- **moai-essentials-refactor** - 코드 리팩토링

#### Project Skills
- **moai-project-documentation** - 프로젝트 문서화
- **moai-project-config-manager** - 설정 관리
- **moai-alfred-workflow** - Alfred 워크플로우

### 스킬 활용 예시

```typescript
// TypeScript 스킬 활용
Skill("moai-lang-typescript")  // React Hook 패턴
Skill("moai-domain-frontend")  // 컴포넌트 설계
Skill("moai-essentials-perf")  // 번들 최적화
```

### 프로젝트 특화 설정

React + Supabase 스택에 최적화:
- TypeScript 5.9+ 기능 활용
- React 19 최신 패턴
- Supabase RLS 보안 설정
- Tailwind CSS 유틸리티 최적화