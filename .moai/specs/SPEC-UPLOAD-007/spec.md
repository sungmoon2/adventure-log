# SPEC-UPLOAD-007: 이미지 업로드 - 장소 사진 업로드 및 관리

## TAG BLOCK
```yaml
spec_id: UPLOAD-007
parent_id: null
spec_type: feature
status: draft
requires: [SPEC-AUTH-001, SPEC-STORAGE-001]
implements: []
verified_by: []
```

## METADATA
```yaml
Version: 1.0.0
Authors: ["@spec-builder"]
Created: 2025-11-16
Modified: 2025-11-16
Status: Draft
Priority: High
Complexity: Medium
EstimatedEffort: 2-days
Tags: ["upload", "storage", "image-processing", "supabase", "webp"]
```

## 1. ENVIRONMENT

### 1.1 System Context
- **시스템 유형**: 웹 애플리케이션 이미지 업로드 시스템
- **통합 서비스**: Supabase Storage, Image Processing Service
- **사용자 환경**: 모던 브라우저 (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **네트워크 환경**: 다양한 네트워크 속도 고려 (3G ~ 5G, WiFi)

### 1.2 Technical Stack
```yaml
frontend:
  - framework: React 18.x / Next.js 14.x
  - upload_library: react-dropzone
  - image_processing: browser-image-compression
  - state_management: Zustand / Redux Toolkit

backend:
  - storage: Supabase Storage
  - image_processing: Sharp (Node.js)
  - api: Supabase Client SDK

infrastructure:
  - cdn: Supabase CDN
  - storage_bucket: place-images
  - max_file_size: 10MB
  - supported_formats: [jpg, jpeg, png, webp, heif, avif]
```

### 1.3 Constraints
- 최대 파일 크기: 원본 10MB
- 동시 업로드 제한: 5개 파일
- 총 저장 용량: 사용자당 1GB
- 이미지 처리 시간: 최대 30초
- 브라우저 메모리 제한: 2GB

## 2. ASSUMPTIONS

### 2.1 User Assumptions
- 사용자는 인증된 상태에서만 업로드 가능
- 사용자는 자신이 업로드한 이미지만 관리 가능
- 사용자는 적절한 권한을 가진 장소에만 이미지 업로드 가능

### 2.2 Technical Assumptions
- Supabase Storage 버킷이 이미 구성되어 있음
- 이미지 처리 서버가 운영 중임
- CDN이 적절히 구성되어 있음
- 브라우저가 File API와 Canvas API를 지원함

### 2.3 Business Assumptions
- 무료 사용자: 장소당 최대 5장
- 프리미엄 사용자: 장소당 최대 20장
- 이미지는 공개 접근 가능 (URL 통해)

## 3. REQUIREMENTS

### 3.1 Functional Requirements

#### 3.1.1 Multiple File Upload
**[UBIQUITOUS]** The system SHALL support multiple file selection and upload
**[UBIQUITOUS]** The system SHALL display upload progress for each file
**[UBIQUITOUS]** The system SHALL support drag and drop file upload

#### 3.1.2 Image Processing
**[EVENT-DRIVEN]** WHEN an image is uploaded, The system SHALL automatically convert to WebP format
**[EVENT-DRIVEN]** WHEN an image exceeds 1920px width, The system SHALL resize to fit within bounds
**[EVENT-DRIVEN]** WHEN an image is uploaded, The system SHALL generate thumbnails (150x150, 300x300, 600x600)

#### 3.1.3 Storage Management
**[UBIQUITOUS]** The system SHALL store images in Supabase Storage with unique identifiers
**[UBIQUITOUS]** The system SHALL organize images by place_id/year/month structure
**[STATE-DRIVEN]** WHILE uploading, The system SHALL prevent duplicate uploads of the same image

#### 3.1.4 User Interface
**[UBIQUITOUS]** The system SHALL provide a visual drag-drop zone with clear instructions
**[EVENT-DRIVEN]** WHEN files are dragged over, The system SHALL highlight the drop zone
**[OPTIONAL]** WHERE user prefers, The system SHALL support paste from clipboard

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance
- 업로드 속도: 네트워크 속도의 80% 이상 활용
- 이미지 처리: 5MB 이하 10초 이내
- 썸네일 생성: 3초 이내
- UI 응답성: 100ms 이내

#### 3.2.2 Security
**[UNWANTED BEHAVIOR]** IF file type is not an image, THEN the system SHALL reject with error message
**[UNWANTED BEHAVIOR]** IF file contains malicious code, THEN the system SHALL sanitize or reject
**[UNWANTED BEHAVIOR]** IF user exceeds quota, THEN the system SHALL block upload with clear message

#### 3.2.3 Usability
- 명확한 업로드 상태 표시 (대기중, 업로드중, 처리중, 완료, 실패)
- 실시간 진행률 표시 (퍼센트 및 시각적 표시)
- 오류 발생 시 명확한 메시지와 해결 방법 제시
- 업로드 취소 기능 제공

## 4. SPECIFICATIONS

### 4.1 API Specifications

#### 4.1.1 Upload Endpoint
```typescript
POST /api/upload/place/{placeId}/images
Content-Type: multipart/form-data

Request:
{
  files: File[],
  metadata: {
    caption?: string,
    alt_text?: string,
    is_primary?: boolean,
    tags?: string[]
  }
}

Response:
{
  success: boolean,
  uploaded: [
    {
      id: string,
      url: string,
      thumbnail_urls: {
        small: string,  // 150x150
        medium: string, // 300x300
        large: string   // 600x600
      },
      size: number,
      format: string,
      width: number,
      height: number,
      uploaded_at: string
    }
  ],
  failed: [
    {
      filename: string,
      error: string,
      code: string
    }
  ]
}
```

#### 4.1.2 Image Management
```typescript
// Get place images
GET /api/places/{placeId}/images
Query: {
  limit?: number,
  offset?: number,
  sort?: 'newest' | 'oldest' | 'size'
}

// Update image metadata
PATCH /api/images/{imageId}
{
  caption?: string,
  alt_text?: string,
  is_primary?: boolean,
  tags?: string[]
}

// Delete image
DELETE /api/images/{imageId}

// Reorder images
PUT /api/places/{placeId}/images/order
{
  image_ids: string[]
}
```

### 4.2 Storage Structure
```
supabase-storage/
└── place-images/
    └── {place_id}/
        └── {year}/
            └── {month}/
                ├── originals/
                │   └── {uuid}_{timestamp}.webp
                └── thumbnails/
                    ├── 150x150_{uuid}.webp
                    ├── 300x300_{uuid}.webp
                    └── 600x600_{uuid}.webp
```

### 4.3 Database Schema
```sql
-- images table
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),

  -- File information
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,

  -- Storage paths
  storage_path TEXT NOT NULL,
  thumbnail_paths JSONB NOT NULL,
  cdn_url TEXT NOT NULL,

  -- Metadata
  caption TEXT,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  tags TEXT[],

  -- Processing status
  processing_status VARCHAR(50) DEFAULT 'pending',
  processed_at TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_images_place_id ON images(place_id);
CREATE INDEX idx_images_user_id ON images(user_id);
CREATE INDEX idx_images_created_at ON images(created_at DESC);
CREATE INDEX idx_images_is_primary ON images(place_id, is_primary);

-- Image processing queue
CREATE TABLE image_processing_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id UUID REFERENCES images(id) ON DELETE CASCADE,
  operation VARCHAR(50) NOT NULL, -- resize, convert, thumbnail
  params JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);
```

### 4.4 Client Implementation

#### 4.4.1 Upload Component
```typescript
interface UploadConfig {
  maxFiles: number;
  maxSize: number; // bytes
  acceptedFormats: string[];
  autoProcess: boolean;
  generateThumbnails: boolean;
}

interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

class ImageUploader {
  constructor(config: UploadConfig);

  // Core methods
  upload(files: File[]): Promise<UploadResult>;
  cancelUpload(fileId: string): void;
  retryFailed(): Promise<UploadResult>;

  // Events
  onProgress(callback: (progress: UploadProgress[]) => void): void;
  onComplete(callback: (result: UploadResult) => void): void;
  onError(callback: (error: UploadError) => void): void;
}
```

#### 4.4.2 Image Processing Pipeline
```typescript
class ImageProcessor {
  // Client-side preprocessing
  async compressImage(file: File, options: CompressionOptions): Promise<Blob>;
  async resizeImage(file: File, maxDimensions: Dimensions): Promise<Blob>;
  async convertToWebP(file: File): Promise<Blob>;

  // Validation
  validateImageType(file: File): boolean;
  validateImageSize(file: File): boolean;
  scanForMaliciousContent(file: File): Promise<boolean>;

  // Optimization
  async optimizeForUpload(file: File): Promise<ProcessedImage>;
  calculateOptimalDimensions(original: Dimensions): Dimensions;
}
```

### 4.5 Error Handling

#### 4.5.1 Error Codes
```typescript
enum UploadErrorCode {
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FORMAT = 'INVALID_FORMAT',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PROCESSING_FAILED = 'PROCESSING_FAILED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  DUPLICATE_FILE = 'DUPLICATE_FILE',
  STORAGE_FULL = 'STORAGE_FULL'
}
```

#### 4.5.2 Error Recovery
**[UNWANTED BEHAVIOR]** IF upload fails due to network, THEN the system SHALL retry up to 3 times with exponential backoff
**[UNWANTED BEHAVIOR]** IF processing fails, THEN the system SHALL queue for background processing
**[STATE-DRIVEN]** WHILE retrying, The system SHALL maintain upload progress state

## 5. ACCEPTANCE CRITERIA

### 5.1 Upload Functionality
- [ ] 사용자는 드래그 앤 드롭으로 이미지를 업로드할 수 있다
- [ ] 사용자는 파일 선택 버튼으로 여러 이미지를 선택할 수 있다
- [ ] 각 파일의 업로드 진행률이 실시간으로 표시된다
- [ ] 업로드 중 취소가 가능하다

### 5.2 Image Processing
- [ ] 업로드된 이미지는 자동으로 WebP로 변환된다
- [ ] 큰 이미지는 자동으로 리사이즈된다
- [ ] 3가지 크기의 썸네일이 생성된다
- [ ] 처리 상태가 UI에 표시된다

### 5.3 Error Handling
- [ ] 잘못된 파일 형식 업로드 시 명확한 오류 메시지 표시
- [ ] 파일 크기 초과 시 사전 차단 및 안내
- [ ] 네트워크 오류 시 자동 재시도
- [ ] 할당량 초과 시 적절한 안내 메시지

### 5.4 Performance
- [ ] 5MB 이미지 업로드가 30초 이내 완료
- [ ] UI가 업로드 중에도 반응적으로 동작
- [ ] 메모리 사용량이 2GB를 초과하지 않음

## 6. DEPENDENCIES

### 6.1 External Dependencies
- Supabase Storage SDK
- react-dropzone
- browser-image-compression
- sharp (서버 사이드)

### 6.2 Internal Dependencies
- Authentication Service (SPEC-AUTH-001)
- Storage Configuration (SPEC-STORAGE-001)
- Place Management Service

## 7. TRACEABILITY

### 7.1 Related SPECs
- SPEC-AUTH-001: User Authentication
- SPEC-STORAGE-001: Storage Configuration
- SPEC-PLACE-001: Place Management

### 7.2 Implementation Tracking
```yaml
components:
  - tag: [IMPL-UPLOAD-007-001]
    description: "Upload UI Component"
    status: pending

  - tag: [IMPL-UPLOAD-007-002]
    description: "Image Processing Service"
    status: pending

  - tag: [IMPL-UPLOAD-007-003]
    description: "Storage Integration"
    status: pending

  - tag: [IMPL-UPLOAD-007-004]
    description: "Error Handling & Recovery"
    status: pending
```

### 7.3 Test Coverage Requirements
- Unit Tests: 90% coverage
- Integration Tests: Core upload flows
- E2E Tests: Complete user journeys
- Performance Tests: Upload speed, memory usage
- Security Tests: File validation, malicious content

## 8. RISKS AND MITIGATION

### 8.1 Technical Risks
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Large file upload failure | Medium | High | Chunked upload, resume capability |
| Storage quota exceeded | Medium | Medium | Clear quota display, upgrade prompts |
| Image processing timeout | Low | Medium | Background processing queue |
| Browser memory issues | Medium | High | Lazy loading, virtualization |

### 8.2 Security Risks
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Malicious file upload | Low | Critical | File type validation, content scanning |
| XSS through image metadata | Low | High | Metadata sanitization |
| DoS through large uploads | Medium | High | Rate limiting, queue management |

## 9. FUTURE ENHANCEMENTS

### 9.1 Phase 2 Features
- AI-powered image tagging
- Smart cropping and composition
- Duplicate detection
- Batch editing capabilities
- Video upload support

### 9.2 Phase 3 Features
- 360° photo support
- AR visualization
- Image recognition for place verification
- Automated quality scoring
- Social sharing integration

## 10. NOTES

### 10.1 Implementation Notes
- WebP 변환은 브라우저 지원 여부를 확인 후 진행
- 오래된 브라우저를 위한 폴백 처리 필요
- 모바일 환경에서 메모리 제한 고려
- PWA 환경에서 오프라인 업로드 큐 구현 고려

### 10.2 Performance Optimization
- 이미지 lazy loading 구현
- Virtual scrolling for gallery views
- CDN 캐싱 전략 수립
- Progressive image loading 구현

---

**Document Status**: Draft
**Last Review**: 2025-11-16
**Next Review**: After initial implementation