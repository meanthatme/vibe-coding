# 디자인 시스템 가이드 (Design System Guide)
## 테스트 관리 도구

**기반:** Material Design 3 (Material You)  
**구현체:** MUI v6 + Tailwind CSS  
**버전:** 1.0.0  
**최종 수정:** 2026-04-30

---

## 1. 개요 (Overview)

본 디자인 시스템은 테스트 관리 도구의 일관된 UI/UX를 위한 규격을 정의한다. Material Design 3를 기반으로 하되, 테스트 관리 도구에 최적화된 컴포넌트와 패턴을 추가로 정의한다.

### 핵심 원칙

| 원칙 | 설명 |
|------|------|
| **일관성** | 동일한 요소는 동일하게 보이고 동작해야 한다 |
| **명확성** | 테스트 상태, 결과, 우선순위를 한눈에 파악할 수 있어야 한다 |
| **효율성** | 반복 작업이 많은 QA 업무 특성상 빠른 인터랙션을 지원해야 한다 |
| **접근성** | WCAG 2.1 AA 기준을 준수해야 한다 |

---

## 2. 색상 (Color)

### 2.1 Primary Palette

Material Design 3의 Color Scheme을 기반으로 한다.

```css
/* Primary */
--color-primary: #1A73E8;          /* 주요 액션, 활성 상태 */
--color-primary-container: #D3E3FD; /* 강조 배경 */
--color-on-primary: #FFFFFF;
--color-on-primary-container: #0A3880;

/* Secondary */
--color-secondary: #4A5568;
--color-secondary-container: #E2E8F0;
--color-on-secondary: #FFFFFF;

/* Surface */
--color-surface: #FFFFFF;
--color-surface-variant: #F8FAFC;
--color-surface-container: #F1F5F9;
--color-on-surface: #1E293B;
--color-on-surface-variant: #475569;

/* Outline */
--color-outline: #CBD5E1;
--color-outline-variant: #E2E8F0;
```

### 2.2 다크 모드 (Dark Mode)

```css
[data-theme="dark"] {
  --color-primary: #6BA8F7;
  --color-primary-container: #0A3880;
  --color-on-primary: #0D2240;
  --color-surface: #0F172A;
  --color-surface-variant: #1E293B;
  --color-surface-container: #1E293B;
  --color-on-surface: #E2E8F0;
  --color-on-surface-variant: #94A3B8;
  --color-outline: #334155;
}
```

### 2.3 시맨틱 색상 (Semantic Colors)

테스트 결과 및 상태를 표현하는 핵심 색상이다.

```css
/* 테스트 결과 */
--color-status-passed: #16A34A;       /* Passed */
--color-status-passed-bg: #DCFCE7;
--color-status-failed: #DC2626;       /* Failed */
--color-status-failed-bg: #FEE2E2;
--color-status-blocked: #EA580C;      /* Blocked */
--color-status-blocked-bg: #FED7AA;
--color-status-skipped: #6B7280;      /* Skipped */
--color-status-skipped-bg: #F3F4F6;
--color-status-in-progress: #2563EB;  /* In Progress */
--color-status-in-progress-bg: #DBEAFE;

/* 우선순위 */
--color-priority-critical: #DC2626;
--color-priority-high: #EA580C;
--color-priority-medium: #CA8A04;
--color-priority-low: #16A34A;
```

### 2.4 색상 사용 원칙

- 상태 색상은 배경색과 함께 텍스트 색상을 사용해 대비를 확보한다
- 색상만으로 정보를 전달하지 않는다 (아이콘 또는 텍스트 병행 사용)
- 다크모드에서는 채도를 낮추고 밝기를 높인 색상을 사용한다

---

## 3. 타이포그래피 (Typography)

### 3.1 폰트 패밀리

```css
--font-family-base: 'Pretendard', 'Inter', -apple-system, sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', monospace; /* 코드, 테스트 ID */
```

### 3.2 타입 스케일 (Material Design 3 기반)

| 토큰 | Size | Weight | Line Height | 사용 용도 |
|------|------|--------|-------------|----------|
| `display-large` | 57px | 400 | 64px | 랜딩/온보딩 |
| `headline-large` | 32px | 400 | 40px | 페이지 제목 |
| `headline-medium` | 28px | 400 | 36px | 섹션 제목 |
| `headline-small` | 24px | 400 | 32px | 카드 제목 |
| `title-large` | 22px | 500 | 28px | 다이얼로그 제목 |
| `title-medium` | 16px | 500 | 24px | 컴포넌트 제목 |
| `title-small` | 14px | 500 | 20px | 서브 제목, 탭 |
| `body-large` | 16px | 400 | 24px | 본문 주요 내용 |
| `body-medium` | 14px | 400 | 20px | 본문 일반 |
| `body-small` | 12px | 400 | 16px | 보조 설명 |
| `label-large` | 14px | 500 | 20px | 버튼 텍스트 |
| `label-medium` | 12px | 500 | 16px | 배지, 태그 |
| `label-small` | 11px | 500 | 16px | 캡션, 힌트 |

```css
/* 예시 */
.text-headline-large { font-size: 32px; font-weight: 400; line-height: 40px; }
.text-title-medium   { font-size: 16px; font-weight: 500; line-height: 24px; }
.text-body-medium    { font-size: 14px; font-weight: 400; line-height: 20px; }
.text-label-medium   { font-size: 12px; font-weight: 500; line-height: 16px; }
```

---

## 4. 간격 (Spacing)

4px 기반의 스케일을 사용한다.

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### 컴포넌트별 내부 여백 가이드

| 컴포넌트 | Padding |
|----------|---------|
| 버튼 (small) | 6px 12px |
| 버튼 (medium) | 8px 16px |
| 버튼 (large) | 10px 24px |
| 카드 | 16px 또는 24px |
| 테이블 셀 | 12px 16px |
| 폼 필드 | 12px 16px |
| 모달 | 24px |
| 사이드바 아이템 | 8px 16px |

---

## 5. 형태 (Shape)

```css
--radius-xs:   2px;  /* 배지, 태그 내부 요소 */
--radius-sm:   4px;  /* 인풋, 칩 */
--radius-md:   8px;  /* 버튼, 카드 */
--radius-lg:   12px; /* 모달, 드롭다운 */
--radius-xl:   16px; /* 바텀 시트 */
--radius-full: 9999px; /* 원형 배지, 아바타 */
```

---

## 6. 고도 (Elevation)

Material Design 3의 Elevation Token을 사용한다.

```css
--elevation-0: none;
--elevation-1: 0 1px 2px rgba(0,0,0,0.08);          /* 카드 기본 */
--elevation-2: 0 2px 4px rgba(0,0,0,0.10);          /* 드롭다운 */
--elevation-3: 0 4px 8px rgba(0,0,0,0.12);          /* 모달, 토스트 */
--elevation-4: 0 8px 16px rgba(0,0,0,0.14);         /* 팝오버 */
--elevation-5: 0 16px 32px rgba(0,0,0,0.16);        /* 오버레이 */
```

---

## 7. 핵심 컴포넌트 (Core Components)

### 7.1 상태 배지 (Status Badge)

테스트 결과 및 케이스 상태를 표시하는 핵심 컴포넌트.

```
사용 패턴:
[● Passed]   → 녹색 배경 + 아이콘
[● Failed]   → 빨간 배경 + 아이콘
[● Blocked]  → 주황 배경 + 아이콘
[● Skipped]  → 회색 배경 + 아이콘
[○ Draft]    → 아웃라인 스타일
```

**규칙:**
- 반드시 아이콘과 텍스트를 함께 사용 (색상만으로 상태 전달 금지)
- 테이블 내에서는 compact 크기 사용
- 상세 페이지에서는 medium 크기 사용

### 7.2 우선순위 인디케이터 (Priority Indicator)

```
[🔴 Critical]  [🟠 High]  [🟡 Medium]  [🟢 Low]
```

**규칙:**
- 컬러 닷(dot) + 텍스트 조합 사용
- 테이블 내에서는 닷만 표시 가능 (호버 시 툴팁)

### 7.3 테스트 케이스 테이블 (Test Case Table)

```
컬럼 구성:
ID | 제목 | 스위트 | 우선순위 | 상태 | 담당자 | 최종 실행 결과 | 수정일
```

**규칙:**
- ID 컬럼은 고정(sticky) 처리
- 행 호버 시 배경색 변경 (`surface-variant`)
- 체크박스로 복수 선택 지원
- 컬럼 너비 조정 가능
- 가상 스크롤(virtual scroll) 적용 (1,000건 이상 대응)

### 7.4 테스트 단계 입력기 (Test Steps Editor)

```
Step 1: [액션 입력 ________________________] [예상 결과 입력 ________________________] [삭제]
Step 2: [액션 입력 ________________________] [예상 결과 입력 ________________________] [삭제]
[+ 단계 추가]
```

**규칙:**
- 드래그 앤 드롭으로 순서 변경 가능
- 단계는 최대 50개까지 허용
- 각 단계의 액션과 예상 결과는 필수 입력

### 7.5 스위트 트리 (Suite Tree)

```
📁 프로젝트명
├── 📁 기능 테스트
│   ├── 📁 로그인
│   │   ├── 📄 TC-001 이메일 로그인
│   │   └── 📄 TC-002 소셜 로그인
│   └── 📁 회원가입
└── 📁 회귀 테스트
```

**규칙:**
- 최대 5 depth까지 허용
- 드래그 앤 드롭으로 케이스/스위트 이동
- 컨텍스트 메뉴(우클릭)로 추가/편집/삭제

### 7.6 실행 진행 바 (Run Progress Bar)

```
진행률: 45/100 (45%)
[████████████████████░░░░░░░░░░░░░░░░░░░░]
  Passed: 30   Failed: 10   Blocked: 5   남음: 55
```

### 7.7 폼 (Form)

**필드 레이블 규칙:**
- 레이블은 항상 필드 상단에 위치
- 필수 항목은 `*` 표시 (레이블 우측)
- 오류 메시지는 필드 하단에 빨간색으로 표시
- 도움말 텍스트는 필드 하단에 회색으로 표시

**유효성 검사:**
- 실시간(on-change) 검사는 지양, 포커스 아웃(on-blur) 시 검사
- 폼 제출 시 전체 유효성 검사 수행

---

## 8. 레이아웃 (Layout)

### 8.1 전체 레이아웃 구조

```
┌─────────────────────────────────────────────┐
│              Top Navigation Bar (64px)       │
├──────────────┬──────────────────────────────┤
│              │                              │
│   사이드바   │         메인 콘텐츠           │
│   (240px)   │                              │
│              │                              │
└──────────────┴──────────────────────────────┘
```

### 8.2 반응형 브레이크포인트

| 이름 | 너비 | 레이아웃 |
|------|------|----------|
| xs | < 600px | 사이드바 숨김, 햄버거 메뉴 |
| sm | 600~960px | 사이드바 축소 (아이콘만) |
| md | 960~1280px | 사이드바 전체 표시 |
| lg | 1280~1920px | 사이드바 + 여유 여백 |
| xl | > 1920px | 최대 너비 1600px 제한 |

### 8.3 그리드 시스템

- 12 컬럼 그리드 기반
- 거터(gutter): 16px (모바일), 24px (데스크탑)
- 콘텐츠 최대 너비: 1600px

---

## 9. 아이콘 (Icons)

- **라이브러리:** Material Symbols (Google)
- **스타일:** Rounded
- **기본 크기:** 20px (인라인), 24px (독립 아이콘)

### 주요 아이콘 매핑

| 기능 | 아이콘 |
|------|--------|
| 테스트 케이스 | `checklist` |
| 테스트 실행 | `play_arrow` |
| Passed | `check_circle` |
| Failed | `cancel` |
| Blocked | `block` |
| Skipped | `skip_next` |
| Critical | `priority_high` |
| 추가 | `add` |
| 편집 | `edit` |
| 삭제 | `delete` |
| 필터 | `filter_list` |
| 검색 | `search` |
| 설정 | `settings` |
| 대시보드 | `dashboard` |
| 리포트 | `bar_chart` |

---

## 10. 인터랙션 & 애니메이션 (Interaction & Animation)

### 10.1 전환 (Transition)

```css
--transition-fast:   150ms ease;   /* 호버, 포커스 등 즉각적 반응 */
--transition-normal: 200ms ease;   /* 일반 상태 변화 */
--transition-slow:   300ms ease;   /* 모달, 사이드바 등 레이아웃 변화 */
```

### 10.2 인터랙션 상태

| 상태 | 처리 방법 |
|------|----------|
| Hover | 배경 투명도 8% 오버레이 |
| Focus | 2px Primary 색상 아웃라인 |
| Active (Press) | 배경 투명도 16% 오버레이 |
| Disabled | 38% 투명도 처리, 커서 `not-allowed` |
| Loading | 스켈레톤 UI 또는 인라인 스피너 |

### 10.3 피드백 패턴

- **성공:** 그린 토스트 메시지 (3초 후 자동 사라짐)
- **오류:** 레드 토스트 메시지 (수동 닫기)
- **경고:** 인라인 경고 배너 (페이지 상단)
- **정보:** 블루 토스트 메시지 (3초 후 자동 사라짐)

---

## 11. 접근성 (Accessibility)

### 체크리스트

- [ ] 모든 인터랙티브 요소에 `aria-label` 또는 가시적 텍스트 제공
- [ ] 색상 대비 최소 4.5:1 (일반 텍스트), 3:1 (큰 텍스트)
- [ ] 키보드만으로 모든 기능 접근 가능
- [ ] 포커스 표시(outline) 항상 명확하게 표시
- [ ] 스크린 리더용 `role`, `aria-*` 속성 적절히 사용
- [ ] 테이블에 `<thead>`, `<th scope>` 명시
- [ ] 이미지/아이콘에 `alt` 또는 `aria-hidden` 적용

---

## 12. 변경 이력 (Changelog)

| 버전 | 날짜 | 내용 |
|------|------|------|
| 1.0.0 | 2026-04-30 | 초안 작성 |
