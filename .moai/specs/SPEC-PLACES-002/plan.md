# Implementation Plan - SPEC-PLACES-002

---
id: SPEC-PLACES-002-PLAN
spec_ref: SPEC-PLACES-002
title: 장소 CRUD 시스템 구현 계획
version: 1.0.0
created_date: 2025-01-16
tags: [implementation, tdd, react, supabase]
---

## Executive Summary

장소 CRUD 시스템을 TDD 방식으로 구현하기 위한 단계별 실행 계획입니다. 총 3-4일의 개발 기간이 예상되며, 테스트 주도 개발을 통해 95% 이상의 커버리지를 달성합니다.

## Phase Breakdown

### Phase 1: Foundation & Data Layer (Day 1)

#### 1.1 Type Definitions & Validation
**Priority**: 🔥 최우선

- [ ] Place interface 정의
- [ ] PlaceFormData type 정의
- [ ] PlaceFilters interface 정의
- [ ] Zod validation schema 구현
- [ ] Error type definitions

**Technical Approach**:
```typescript
// 1. types/database.ts 확장
// 2. types/place.ts 생성
// 3. utils/validation.ts with Zod schemas
// 4. utils/constants.ts for enums
```

#### 1.2 Supabase Service Layer
**Priority**: 🔥 최우선

- [ ] placeService.fetchPlaces() 구현
- [ ] placeService.createPlace() 구현
- [ ] placeService.updatePlace() 구현
- [ ] placeService.deletePlace() 구현
- [ ] Error handling utilities

**Test Coverage Target**: 100%
```typescript
// services/placeService.test.ts
// - Mock Supabase client
// - Test all CRUD operations
// - Test error scenarios
// - Test RLS compliance
```

#### 1.3 React Query Hooks
**Priority**: 🔥 최우선

- [ ] usePlaces hook with filters
- [ ] useCreatePlace with optimistic update
- [ ] useUpdatePlace with cache management
- [ ] useDeletePlace with confirmation
- [ ] usePlace (single) for detail view

**Test Strategy**:
```typescript
// hooks/*.test.tsx
// - renderHook with QueryClient wrapper
// - Mock service layer
// - Test loading states
// - Test error states
// - Test cache invalidation
```

### Phase 2: UI Components (Day 2)

#### 2.1 Core Components
**Priority**: 🔥 최우선

- [ ] PlaceCard component
  - Display all place information
  - Status badges (visit, priority)
  - Action buttons (edit, delete)
  - Click for detail view

- [ ] PlaceList container
  - Grid/List view toggle
  - Empty state handling
  - Loading skeletons
  - Error boundary

- [ ] PlaceForm component
  - React Hook Form integration
  - Zod validation
  - Field-level errors
  - Quick Save vs. Full Save

**Component Testing**:
```typescript
// components/*.test.tsx
// - Unit tests for each component
// - Integration tests for forms
// - Accessibility tests (ARIA)
// - Responsive design tests
```

#### 2.2 Filter & Search Components
**Priority**: ✨ 꼭 구현

- [ ] PlaceFilters component
  - Category filter dropdown
  - Visit status filter
  - Priority filter
  - Region selector

- [ ] PlaceSearch component
  - Debounced input
  - Clear button
  - Search in name/address/keywords

**Test Coverage**: 90%+

#### 2.3 Detail & Modal Components
**Priority**: ✨ 꼭 구현

- [ ] PlaceDetail modal
  - Full information display
  - Edit mode toggle
  - Image gallery (placeholder)
  - External link handling

- [ ] DeleteConfirmation dialog
  - Confirmation message
  - Cancel/Confirm actions
  - Loading state during deletion

### Phase 3: Integration & Polish (Day 3)

#### 3.1 Page Integration
**Priority**: 🔥 최우선

- [ ] Create PlacesPage component
- [ ] Integrate all components
- [ ] Routing setup
- [ ] Navigation menu update
- [ ] Protected route wrapper

**Integration Tests**:
```typescript
// pages/PlacesPage.test.tsx
// - Full CRUD flow tests
// - User journey tests
// - Performance tests
```

#### 3.2 State Management & Performance
**Priority**: ✨ 꼭 구현

- [ ] Implement infinite scroll
- [ ] Add pagination controls
- [ ] Optimize re-renders with memo
- [ ] Implement virtual scrolling (if needed)
- [ ] Cache management strategy

**Performance Metrics**:
- Initial load: < 500ms
- Filter apply: < 100ms
- Search debounce: 300ms
- Smooth 60fps scrolling

#### 3.3 Error Handling & UX
**Priority**: ✨ 꼭 구현

- [ ] Global error boundary
- [ ] Toast notifications
- [ ] Retry mechanisms
- [ ] Offline support (basic)
- [ ] Loading states

### Phase 4: Testing & Documentation (Day 4)

#### 4.1 Comprehensive Testing
**Priority**: 🔥 최우선

- [ ] Unit test coverage > 95%
- [ ] Integration test scenarios
- [ ] E2E test critical paths
- [ ] Performance benchmarks
- [ ] Accessibility audit

**Test Scenarios** (최소 20개):
1. Create place with minimal data
2. Create place with all fields
3. Quick Save (draft status)
4. Update existing place
5. Delete with confirmation
6. Filter by category
7. Filter by visit status
8. Search by name
9. Search by keyword
10. Pagination navigation
11. Empty state display
12. Error recovery
13. Offline handling
14. Form validation errors
15. Optimistic update rollback
16. Concurrent update handling
17. RLS policy enforcement
18. Session expiry handling
19. Large dataset performance
20. Mobile responsive behavior

#### 4.2 Documentation & Handoff
**Priority**: 일반

- [ ] API documentation
- [ ] Component storybook
- [ ] Usage examples
- [ ] Performance report
- [ ] Known issues log

## Technical Architecture

### Component Hierarchy
```
App
└── PlacesPage
    ├── PlaceFilters
    ├── PlaceSearch
    ├── PlaceList
    │   └── PlaceCard[]
    ├── PlaceForm (Modal)
    └── PlaceDetail (Modal)
```

### Data Flow
```
Supabase → Service Layer → React Query → Components → UI
                ↑                              ↓
                └──── Mutations/Actions ←──────┘
```

### State Management Strategy
- **Server State**: React Query (places data)
- **UI State**: React useState (filters, modals)
- **Form State**: React Hook Form
- **Auth State**: Supabase Auth (from SPEC-LOGIN-001)

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| RLS policy conflicts | High | Thorough testing with different user roles |
| Performance with large datasets | Medium | Implement pagination early, consider virtualization |
| Cache inconsistency | Medium | Clear invalidation strategy, optimistic updates |
| Form validation complexity | Low | Use Zod for consistent validation |
| Mobile responsiveness | Low | Mobile-first design approach |

## Technical Decisions

### Why React Query?
- Built-in caching and synchronization
- Optimistic updates support
- Background refetching
- Excellent DevTools

### Why Zod?
- Runtime type safety
- Composable schemas
- Great TypeScript integration
- Form validation compatibility

### Why React Hook Form?
- Performance (uncontrolled components)
- Built-in validation support
- Minimal re-renders
- Great DX with TypeScript

## Milestones & Deliverables

### Milestone 1: Data Layer Complete
- All services implemented
- All hooks tested
- 100% test coverage

### Milestone 2: UI Components Ready
- All components built
- Component tests passing
- Storybook documentation

### Milestone 3: Integration Complete
- Full CRUD flow working
- Performance targets met
- Error handling robust

### Milestone 4: Production Ready
- 95% test coverage
- Documentation complete
- Performance validated
- Security verified

## Development Guidelines

### Code Standards
```typescript
// Always use TypeScript strict mode
// Prefer const assertions
// Use exhaustive switches for enums
// Implement proper error boundaries
```

### Testing Standards
```typescript
// Test user behavior, not implementation
// Mock at the service boundary
// Use MSW for API mocking
// Test accessibility with Testing Library
```

### Performance Standards
- Lazy load heavy components
- Memoize expensive computations
- Debounce user inputs
- Virtualize long lists

## Next Steps

1. **Immediate Action**: Set up types and validation schemas
2. **Day 1 Goal**: Complete service layer with tests
3. **Day 2 Goal**: Build all UI components
4. **Day 3 Goal**: Integrate and optimize
5. **Day 4 Goal**: Polish and document

## Success Metrics

- [ ] Test Coverage: ≥ 95%
- [ ] Build Time: < 30 seconds
- [ ] Bundle Size: < 500KB (features/places)
- [ ] Lighthouse Score: > 90
- [ ] TypeScript Coverage: 100%
- [ ] Zero Console Errors
- [ ] Zero Accessibility Violations

## Tags

`[TAG:SPEC-PLACES-002]` `[TAG:IMPLEMENTATION]` `[TAG:TDD]`