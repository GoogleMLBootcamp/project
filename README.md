# project
파이팅~!~!~!~!~!

# Photo Story Generator

사진들로부터 자동으로 일기를 생성하는 AI 기반 서비스입니다.

## 프로젝트 구조
```
project/
├── frontend/                  # React 프론트엔드
│   ├── src/                  
│   │   ├── components/       # 재사용 가능한 UI 컴포넌트
│   │   ├── pages/           # 페이지 컴포넌트
│   │   ├── hooks/           # 커스텀 훅
│   │   ├── services/        # API 통신 관련 서비스
│   │   └── styles/          # 스타일 파일들
│   └── public/              # 정적 파일
│
├── backend/                  # FastAPI 백엔드
│   ├── app/
│   │   ├── api/            # API 라우트
│   │   ├── core/           # 설정 및 공통 유틸리티
│   │   ├── db/             # MongoDB 연결 및 모델
│   │   └── services/       # 비즈니스 로직
│   └── requirements.txt    # Python 패키지 의존성
│
├── ml/                      # 머신러닝 관련 코드
│   ├── training/           # 모델 학습 코드
│   │   ├── datasets/      # 데이터셋 처리
│   │   └── models/        # PaLI-Gemma 모델 구현
│   ├── inference/         # 모델 추론 코드
│   │   └── models/       # 학습된 모델 추론
│   └── data/             # 데이터셋 저장
│
└── docs/                   # 문서
    ├── api/               # API 문서
    └── setup/            # 설치 및 설정 가이드
```

## 주요 컴포넌트 설명

### Frontend
- React와 TypeScript 기반의 SPA
- 이미지 업로드 및 미리보기 기능
- 생성된 스토리 표시 및 편집 기능
- 사용자 히스토리 관리

### Backend
- FastAPI 기반의 RESTful API
- MongoDB를 사용한 데이터 저장
  - 사용자 업로드 이미지
  - 생성된 스토리
  - 사용자 히스토리
- 이미지 처리 및 ML 모델 연동
- OpenAI API 통합

### ML
- PaLI-Gemma 모델 구현 및 학습
- 이미지 전처리 파이프라인
- 모델 추론 및 텍스트 생성
- 모델 성능 평가 및 개선

### Database (MongoDB)
- 이미지 메타데이터 저장
- 생성된 스토리 저장
- 사용자 데이터 관리
- 히스토리 추적
