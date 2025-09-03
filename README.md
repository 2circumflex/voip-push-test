# VoIP Push Test Server (TypeScript)

iOS VoIP 푸시 알림을 전송하는 Express.js 서버입니다.

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 설정
`env.example` 파일을 참고하여 `.env` 파일을 생성하세요:

```bash
cp env.example .env
```

`.env` 파일에서 다음 값들을 실제 값으로 변경하세요:
- `APN_KEY_ID`: Apple Developer 계정의 Key ID
- `APN_TEAM_ID`: Apple Developer Team ID
- `APN_KEY_PATH`: AuthKey_*.p8 파일 경로
- `APN_TOPIC`: 앱의 VoIP bundle identifier

### 3. TypeScript 빌드
```bash
npm run build
```

### 4. 서버 실행
```bash
# 프로덕션 모드
npm start

# 개발 모드 (TypeScript 직접 실행)
npm run dev
```
