-- ================================================================
-- 맛집 어드벤처 로그 - 데이터베이스 스키마 v1.0
-- 작성일: 2025-01-XX
-- Phase 1: MVP 기본 기능
-- ================================================================

-- 1. places 테이블 생성
-- ================================================================
CREATE TABLE places (
    -- 기본 키
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- 기본 정보
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('식당', '카페', '문화/여가', '명소', '팝업/축제')),

    -- 상태 정보
    visit_status VARCHAR(30) NOT NULL DEFAULT '미방문'
        CHECK (visit_status IN ('미방문', '방문 완료', '재방문 완료')),
    priority VARCHAR(30) NOT NULL DEFAULT '일반'
        CHECK (priority IN ('🔥 최우선', '✨ 꼭 가볼 곳', '일반')),
    record_status VARCHAR(20) NOT NULL DEFAULT 'published'
        CHECK (record_status IN ('draft', 'published')),

    -- 지역 정보
    region_main VARCHAR(50),
    region_sub VARCHAR(50),
    address TEXT,

    -- 영업 정보 (Phase 1: 간단한 텍스트)
    operating_hours TEXT,

    -- 주차 정보
    parking_info VARCHAR(50) CHECK (parking_info IN ('매장 주차장', '주차 지원', '인근 공영/유료', '주차 불가')),
    parking_memo TEXT,

    -- 추가 정보
    keywords TEXT[], -- PostgreSQL 배열 타입
    memo TEXT, -- 자유 메모
    source_url VARCHAR(500), -- 인스타 링크 등
    cover_image_url VARCHAR(500), -- Supabase Storage 경로

    -- 팝업/축제용 (선택적)
    start_date DATE,
    end_date DATE,

    -- 시스템 정보
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE places IS '장소 정보 테이블 (식당, 카페, 팝업, 명소 등)';
COMMENT ON COLUMN places.record_status IS 'draft: Quick Save로 저장된 임시 상태, published: 완전히 작성된 상태';
COMMENT ON COLUMN places.keywords IS '검색용 키워드 배열 (예: [한식, 국밥, 야장])';
COMMENT ON COLUMN places.memo IS '영업시간, 추가 정보 등 자유 텍스트';

-- 2. 인덱스 생성 (성능 최적화)
-- ================================================================
CREATE INDEX idx_places_user ON places(user_id);
CREATE INDEX idx_places_category ON places(category);
CREATE INDEX idx_places_visit_status ON places(visit_status);
CREATE INDEX idx_places_priority ON places(priority);
CREATE INDEX idx_places_record_status ON places(record_status);
CREATE INDEX idx_places_region_main ON places(region_main);
CREATE INDEX idx_places_keywords ON places USING GIN(keywords); -- 배열 검색 최적화
CREATE INDEX idx_places_created_at ON places(created_at DESC);
CREATE INDEX idx_places_updated_at ON places(updated_at DESC);

-- 복합 인덱스 (자주 사용되는 조합)
CREATE INDEX idx_places_user_category ON places(user_id, category);
CREATE INDEX idx_places_user_visit_status ON places(user_id, visit_status);
CREATE INDEX idx_places_user_priority ON places(user_id, priority DESC, created_at DESC);

-- 3. Row Level Security (RLS) 설정
-- ================================================================
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 조회 가능
CREATE POLICY "Users can view own places"
    ON places FOR SELECT
    USING (auth.uid() = user_id);

-- 사용자는 자신의 데이터만 삽입 가능
CREATE POLICY "Users can insert own places"
    ON places FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 데이터만 수정 가능
CREATE POLICY "Users can update own places"
    ON places FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 데이터만 삭제 가능
CREATE POLICY "Users can delete own places"
    ON places FOR DELETE
    USING (auth.uid() = user_id);

-- 4. 트리거 함수 (updated_at 자동 갱신)
-- ================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_places_updated_at
    BEFORE UPDATE ON places
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. 제약 조건 (데이터 무결성)
-- ================================================================
-- 팝업/축제의 경우 종료일이 시작일보다 빠르면 안 됨
ALTER TABLE places ADD CONSTRAINT check_event_dates
    CHECK (
        (start_date IS NULL AND end_date IS NULL) OR
        (start_date IS NOT NULL AND end_date IS NOT NULL AND end_date >= start_date)
    );

-- 6. 테스트 데이터 (선택적 - 개발용)
-- ================================================================
-- 로그인 후 테스트 데이터 삽입 가능
-- INSERT INTO places (user_id, name, category, priority, region_main, region_sub, keywords, memo)
-- VALUES (
--     auth.uid(),
--     '테스트 맛집',
--     '식당',
--     '🔥 최우선',
--     '부산',
--     '해운대',
--     ARRAY['한식', '국밥', '맛집'],
--     '점심 11:30-15:00, 저녁 17:00-21:00, 월요일 휴무'
-- );

-- ================================================================
-- 설치 완료
-- ================================================================
-- 다음 단계:
-- 1. Supabase Dashboard에서 이 SQL을 실행
-- 2. Storage Bucket 생성 (이미지 업로드용)
-- 3. Google OAuth 설정
-- ================================================================
