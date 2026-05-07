# Qrit - 테스트 관리 도구 프론트엔드

React + TypeScript 기반의 테스트 관리 도구 프론트엔드입니다.

## 🚀 핵심 기능

- **테스트 케이스 관리**: CRUD 작업, 우선순위, 상태, 태그 관리
- **테스트 플랜**: 마일스톤 기반 테스트 계획 관리
- **대시보드**: 통계 및 진행률 시각화
- **사용자 친화적 UI**: Material Design 3 기반의 깔끔한 인터페이스

## 📋 프로젝트 구조

```
src/
├── components/          # 공통 UI 컴포넌트
│   ├── Layout.tsx      # 레이아웃 (사이드바, 헤더)
│   ├── DataTable.tsx   # 데이터 테이블
│   ├── StatusBadge.tsx # 상태 배지
│   └── ...
├── pages/              # 페이지 컴포넌트
│   ├── DashboardPage.tsx
│   ├── TestCaseListPage.tsx
│   ├── TestCaseDetailPage.tsx
│   ├── TestPlanListPage.tsx
│   └── TestPlanDetailPage.tsx
├── store/              # 상태 관리 (Zustand)
│   └── index.ts
├── types/              # TypeScript 타입 정의
│   └── index.ts
├── App.tsx             # 라우팅 설정
├── main.tsx            # 진입점
└── index.css           # 전역 스타일
```

## 🛠️ 기술 스택

- **프런트엔드**: React 18 + TypeScript
- **스타일링**: Tailwind CSS + MUI v6
- **상태 관리**: Zustand
- **라우팅**: React Router v6
- **빌드 도구**: Vite
- **차트**: Recharts

## 📦 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview

# 타입 체크
npm run type-check

# 린팅
npm run lint
```

## 🎨 디자인 시스템

Material Design 3 기반의 일관된 디자인 시스템을 적용합니다.

### 색상
- **Primary**: #1A73E8
- **Success**: #16A34A
- **Error**: #DC2626
- **Warning**: #EA580C
- **Info**: #2563EB

### 타이포그래피
- **기본 폰트**: Pretendard, Inter
- **코드 폰트**: JetBrains Mono, Fira Code
- 8가지 스타일: display-large, headline-*, title-*, body-*, label-*

### 간격
4px 기반의 스케일 시스템 사용

## 📝 주요 페이지

### 대시보드
- 핵심 통계 카드 (테스트 케이스, 진행중 플랜, 성공/실패 테스트)
- 테스트 결과 분포 파이 차트
- 활성 테스트 플랜 타임라인
- 최근 테스트 실행 목록

### 테스트 케이스
- 테스트 케이스 목록 (검색, 필터링)
- 테스트 케이스 생성/편집
- 단계별 테스트 정의
- 우선순위, 타입, 상태 관리

### 테스트 플랜
- 플랜 목록 (진행률 표시)
- 마일스톤 관리
- 테스트 스위트 선택
- 환경 파라미터 설정

## 🔄 상태 관리

Zustand를 사용하여 전역 상태를 관리합니다:
- 테스트 케이스, 플랜, 결과 데이터
- 현재 사용자 정보
- UI 상태 (로딩, 알림)

## 📱 반응형 디자인

모바일, 태블릿, 데스크톱 모든 기기에 최적화된 레이아웃을 제공합니다.

## 🔐 향후 개선

- CI/CD 파이프라인 연동
- 외부 이슈 트래커 연동 (Jira, GitHub Issues)
- AI 기반 테스트 케이스 자동 생성
- 모바일 앱 지원
- 다국어 지원
- 다크 모드

---

**버전**: 1.0.0  
**최종 수정**: 2026-04-30
