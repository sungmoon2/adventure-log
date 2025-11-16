# 🚀 Adventure Log 설정 가이드

## 📋 프로젝트 클론 후 설정 방법

이 가이드는 프로젝트를 클론한 후 로컬 환경에서 실행하기 위해 필요한 설정을 안내합니다.

## 🔐 제외된 파일들 (.gitignore)

보안과 개인정보 보호를 위해 다음 파일들은 Git 저장소에 포함되지 않습니다.
각 파일을 직접 생성해야 합니다.

### 1. 환경 설정 파일 (.env)

**위치**: 프로젝트 루트 디렉토리

**생성 방법**:
```bash
# .env.example을 복사하여 .env 파일 생성
cp .env.example .env
```

**포함해야 할 내용**:
```env
# ===========================
# 애플리케이션 기본 설정
# ===========================
APP_NAME="Adventure Log"
DEBUG=true                    # 개발 모드 (true/false)
SECRET_KEY=your-secret-key    # 32자 이상의 랜덤 문자열

# ===========================
# 데이터베이스 설정
# ===========================
DATABASE_URL=sqlite:///./database/adventure_log.db
# PostgreSQL 사용 시:
# DATABASE_URL=postgresql://user:password@localhost/adventure_log

# ===========================
# API 설정
# ===========================
API_PREFIX=/api/v1
API_PORT=8000
API_HOST=0.0.0.0

# ===========================
# CORS 설정 (프론트엔드 연동)
# ===========================
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# ===========================
# Supabase 설정 (사용하는 경우)
# ===========================
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# ===========================
# Google OAuth (사용하는 경우)
# ===========================
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/callback

# ===========================
# JWT 토큰 설정
# ===========================
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# ===========================
# 파일 업로드 설정
# ===========================
UPLOAD_FOLDER=./uploads
MAX_UPLOAD_SIZE=10485760  # 10MB in bytes
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,webp
```

### 2. 데이터베이스 파일 (*.db, *.sqlite)

**위치**: `database/` 디렉토리

**생성 방법**:
```bash
# 데이터베이스 디렉토리 생성
mkdir -p database

# Python 가상환경 활성화 후
python scripts/init_db.py

# 또는 수동으로 생성
python -c "from app.database import init_db; init_db()"
```

### 3. Python 가상환경 (venv/, env/)

**생성 방법**:
```bash
# Python 가상환경 생성
python -m venv venv

# Windows에서 활성화
venv\Scripts\activate

# Linux/Mac에서 활성화
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt
```

### 4. Node.js 의존성 (node_modules/)

**Frontend 설정** (React 사용 시):
```bash
# frontend 디렉토리로 이동
cd frontend

# 의존성 설치
npm install
# 또는
yarn install

# 개발 서버 실행
npm run dev
# 또는
yarn dev
```

### 5. 업로드 디렉토리 (uploads/, media/)

**생성 방법**:
```bash
# 업로드 디렉토리 생성
mkdir -p uploads
mkdir -p static/media

# Windows
mkdir uploads
mkdir static\media
```

### 6. 로그 디렉토리 (logs/)

**생성 방법**:
```bash
# 로그 디렉토리 생성
mkdir -p logs

# Windows
mkdir logs
```

## 🎯 빠른 시작 체크리스트

다른 컴퓨터에서 프로젝트를 실행하려면:

1. **저장소 클론**
   ```bash
   git clone https://github.com/sungmoon2/adventure-log.git
   cd adventure-log
   ```

2. **Python 가상환경 설정**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # 또는
   venv\Scripts\activate     # Windows
   ```

3. **Python 의존성 설치**
   ```bash
   pip install -r requirements.txt
   ```

4. **환경 변수 파일 생성**
   ```bash
   cp .env.example .env
   # .env 파일을 편집하여 필요한 값 설정
   ```

5. **데이터베이스 초기화**
   ```bash
   python scripts/init_db.py
   ```

6. **필요한 디렉토리 생성**
   ```bash
   mkdir -p database logs uploads
   ```

7. **Frontend 설정** (선택사항)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

8. **백엔드 서버 실행**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

9. **브라우저에서 확인**
   - 애플리케이션: http://localhost:8000
   - API 문서: http://localhost:8000/docs
   - Frontend (React): http://localhost:3000

## ⚠️ 주의사항

1. **SECRET_KEY와 JWT_SECRET_KEY는 반드시 변경하세요**
   - 프로덕션 환경에서는 강력한 랜덤 문자열 사용
   - 예: `python -c "import secrets; print(secrets.token_hex(32))"`

2. **데이터베이스 백업**
   - SQLite 사용 시: `database/*.db` 파일을 정기적으로 백업
   - PostgreSQL 사용 시: `pg_dump` 명령 사용

3. **API 키 보안**
   - Supabase, Google OAuth 등의 API 키는 절대 공개하지 마세요
   - .env 파일이 실수로 커밋되지 않도록 주의

4. **프로덕션 배포 시**
   - DEBUG=false로 설정
   - 강력한 SECRET_KEY 사용
   - HTTPS 사용 권장
   - 적절한 CORS 설정

## 📞 문제 해결

문제가 발생하면:

1. Python 버전 확인 (3.10 이상)
   ```bash
   python --version
   ```

2. 가상환경 활성화 확인
   ```bash
   which python  # Linux/Mac
   where python  # Windows
   ```

3. 의존성 재설치
   ```bash
   pip install --upgrade -r requirements.txt
   ```

4. 데이터베이스 재초기화
   ```bash
   rm database/*.db
   python scripts/init_db.py
   ```

5. 로그 확인
   ```bash
   tail -f logs/app.log
   ```

## 📚 추가 문서

- [API 문서](http://localhost:8000/docs)
- [프로젝트 README](README.md)
- [개발 일지](docs/)

---

문의사항: sungmoon88@naver.com