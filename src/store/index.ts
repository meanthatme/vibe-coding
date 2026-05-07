import { create } from 'zustand'
import { TestCase, TestSuite, TestPlan, TestRunResult, User } from '../types'

interface AppState {
  // 테스트 케이스
  testCases: TestCase[]
  setTestCases: (cases: TestCase[]) => void
  addTestCase: (testCase: TestCase) => void
  updateTestCase: (id: string, testCase: Partial<TestCase>) => void
  deleteTestCase: (id: string) => void
  getTestCaseById: (id: string) => TestCase | undefined

  // 테스트 스위트
  testSuites: TestSuite[]
  setTestSuites: (suites: TestSuite[]) => void
  addTestSuite: (suite: TestSuite) => void
  updateTestSuite: (id: string, suite: Partial<TestSuite>) => void
  deleteTestSuite: (id: string) => void
  getTestSuitesTree: () => TestSuite[]

  // 테스트 플랜
  testPlans: TestPlan[]
  setTestPlans: (plans: TestPlan[]) => void
  addTestPlan: (plan: TestPlan) => void
  updateTestPlan: (id: string, plan: Partial<TestPlan>) => void
  deleteTestPlan: (id: string) => void
  getTestPlanById: (id: string) => TestPlan | undefined

  // 테스트 실행 결과
  testResults: TestRunResult[]
  setTestResults: (results: TestRunResult[]) => void
  addTestResult: (result: TestRunResult) => void
  updateTestResult: (id: string, result: Partial<TestRunResult>) => void

  // 현재 사용자
  currentUser: User | null
  setCurrentUser: (user: User | null) => void

  // UI 상태
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  notification: { type: 'success' | 'error' | 'info'; message: string } | null
  setNotification: (notification: any) => void
}

// 초기 테스트 스위트 데이터
const initialTestSuites: TestSuite[] = [
  {
    id: 'suite-auth',
    name: '인증 (Authentication)',
    order: 1,
    createdAt: '2026-04-01',
    updatedAt: '2026-04-01',
  },
  {
    id: 'suite-auth-login',
    name: '로그인',
    parentId: 'suite-auth',
    order: 1,
    createdAt: '2026-04-01',
    updatedAt: '2026-04-01',
  },
  {
    id: 'suite-auth-signup',
    name: '회원가입',
    parentId: 'suite-auth',
    order: 2,
    createdAt: '2026-04-01',
    updatedAt: '2026-04-01',
  },
  {
    id: 'suite-tc',
    name: '테스트 케이스 관리',
    order: 2,
    createdAt: '2026-04-01',
    updatedAt: '2026-04-01',
  },
  {
    id: 'suite-dash',
    name: '대시보드',
    order: 3,
    createdAt: '2026-04-01',
    updatedAt: '2026-04-01',
  },
]

// 초기 테스트 케이스 데이터
const initialTestCases: TestCase[] = [
  {
    id: 'tc-001',
    title: '로그인 성공 - 유효한 자격증명',
    suiteId: 'suite-auth-login',
    suite: 'Authentication',
    priority: 'Critical',
    type: 'Functional',
    status: 'Active',
    precondition: '사용자가 로그인 페이지에 접근한 상태',
    steps: [
      {
        id: 'step-1',
        step: '이메일 입력칸에 "test@example.com" 입력',
        expectedResult: '이메일이 입력되어야 함',
      },
      {
        id: 'step-2',
        step: '비밀번호 입력칸에 "Password123" 입력',
        expectedResult: '비밀번호가 입력되어야 함 (마스크 처리됨)',
      },
      {
        id: 'step-3',
        step: '"로그인" 버튼 클릭',
        expectedResult: '대시보드 페이지로 리다이렉트',
      },
    ],
    expectedResult: '사용자가 성공적으로 로그인되고 대시보드가 표시되어야 함',
    assignee: 'John Doe',
    tags: ['login', 'authentication', 'smoke'],
    createdAt: '2026-04-20',
    updatedAt: '2026-05-01',
    createdBy: 'John Doe',
  },
  {
    id: 'tc-002',
    title: '로그인 실패 - 잘못된 비밀번호',
    suiteId: 'suite-auth-login',
    suite: 'Authentication',
    priority: 'Critical',
    type: 'Functional',
    status: 'Active',
    precondition: '사용자가 로그인 페이지에 접근한 상태',
    steps: [
      {
        id: 'step-1',
        step: '이메일 입력칸에 "test@example.com" 입력',
        expectedResult: '이메일이 입력되어야 함',
      },
      {
        id: 'step-2',
        step: '비밀번호 입력칸에 "WrongPassword" 입력',
        expectedResult: '비밀번호가 입력되어야 함',
      },
      {
        id: 'step-3',
        step: '"로그인" 버튼 클릭',
        expectedResult: '로그인 페이지에 유지',
      },
    ],
    expectedResult: '에러 메시지 "자격증명이 올바르지 않습니다" 표시',
    assignee: 'Jane Smith',
    tags: ['login', 'authentication', 'validation'],
    createdAt: '2026-04-21',
    updatedAt: '2026-05-02',
    createdBy: 'John Doe',
  },
  {
    id: 'tc-003',
    title: '테스트 케이스 생성 - 기본 정보만',
    suiteId: 'suite-tc',
    suite: 'TestCaseManagement',
    priority: 'High',
    type: 'Functional',
    status: 'Active',
    steps: [
      {
        id: 'step-1',
        step: '테스트 케이스 섹션으로 이동',
        expectedResult: '테스트 케이스 목록이 표시됨',
      },
      {
        id: 'step-2',
        step: '"새 테스트 케이스" 버튼 클릭',
        expectedResult: '새 테스트 케이스 생성 폼이 표시됨',
      },
      {
        id: 'step-3',
        step: '제목과 테스트 스위트 정보 입력',
        expectedResult: '입력 필드에 데이터가 입력됨',
      },
      {
        id: 'step-4',
        step: '"저장" 버튼 클릭',
        expectedResult: '성공 메시지 표시 및 목록 페이지로 돌아감',
      },
    ],
    expectedResult: '새 테스트 케이스가 저장되고 목록에 표시됨',
    assignee: 'Alice Johnson',
    tags: ['testcase', 'create', 'regression'],
    createdAt: '2026-04-22',
    updatedAt: '2026-05-03',
    createdBy: 'John Doe',
  },
  {
    id: 'tc-004',
    title: '대시보드 - 통계 정보 표시',
    suiteId: 'suite-dash',
    suite: 'Dashboard',
    priority: 'High',
    type: 'Smoke',
    status: 'Active',
    steps: [
      {
        id: 'step-1',
        step: '로그인 후 대시보드로 이동',
        expectedResult: '대시보드 페이지 로드',
      },
      {
        id: 'step-2',
        step: '페이지 스크롤하여 모든 통계 카드 확인',
        expectedResult: '총 테스트, 성공, 실패, 차단됨 통계 표시',
      },
      {
        id: 'step-3',
        step: '차트 영역 확인',
        expectedResult: '테스트 결과 분포 파이 차트 표시',
      },
    ],
    expectedResult: '모든 통계 정보가 올바르게 표시되어야 함',
    assignee: 'Bob Wilson',
    tags: ['dashboard', 'statistics', 'smoke'],
    createdAt: '2026-04-25',
    updatedAt: '2026-05-04',
    createdBy: 'John Doe',
  },
  {
    id: 'tc-005',
    title: '사용자 프로필 편집',
    suiteId: 'suite-dash',
    suite: 'UserManagement',
    priority: 'Medium',
    type: 'Functional',
    status: 'Draft',
    precondition: '사용자가 로그인한 상태이고 프로필 페이지에 접근',
    steps: [
      {
        id: 'step-1',
        step: '프로필 설정 페이지에서 이름 필드 수정',
        expectedResult: '이름이 입력되어야 함',
      },
      {
        id: 'step-2',
        step: '나머지 정보 입력 (직급, 팀 등)',
        expectedResult: '모든 정보가 입력되어야 함',
      },
      {
        id: 'step-3',
        step: '"저장" 버튼 클릭',
        expectedResult: '성공 메시지 표시',
      },
    ],
    expectedResult: '사용자 프로필이 업데이트되어야 함',
    assignee: 'Charlie Brown',
    tags: ['profile', 'user', 'settings'],
    createdAt: '2026-04-26',
    updatedAt: '2026-05-05',
    createdBy: 'John Doe',
  },
]

export const useAppStore = create<AppState>((set, get) => ({
  // 테스트 케이스
  testCases: initialTestCases,
  setTestCases: (cases) => set({ testCases: cases }),
  addTestCase: (testCase) =>
    set((state) => ({ testCases: [...state.testCases, testCase] })),
  updateTestCase: (id, testCase) =>
    set((state) => ({
      testCases: state.testCases.map((tc) =>
        tc.id === id ? { ...tc, ...testCase } : tc,
      ),
    })),
  deleteTestCase: (id) =>
    set((state) => ({
      testCases: state.testCases.filter((tc) => tc.id !== id),
    })),
  getTestCaseById: (id) => get().testCases.find((tc) => tc.id === id),

  // 테스트 스위트
  testSuites: initialTestSuites,
  setTestSuites: (suites) => set({ testSuites: suites }),
  addTestSuite: (suite) =>
    set((state) => ({ testSuites: [...state.testSuites, suite] })),
  updateTestSuite: (id, suite) =>
    set((state) => ({
      testSuites: state.testSuites.map((s) =>
        s.id === id ? { ...s, ...suite } : s,
      ),
    })),
  deleteTestSuite: (id) =>
    set((state) => ({
      testSuites: state.testSuites.filter((s) => s.id !== id),
    })),
  getTestSuitesTree: () => {
    const suites = get().testSuites
    return suites.filter((s) => !s.parentId)
  },

  // 테스트 플랜
  testPlans: [],
  setTestPlans: (plans) => set({ testPlans: plans }),
  addTestPlan: (plan) =>
    set((state) => ({ testPlans: [...state.testPlans, plan] })),
  updateTestPlan: (id, plan) =>
    set((state) => ({
      testPlans: state.testPlans.map((p) =>
        p.id === id ? { ...p, ...plan } : p,
      ),
    })),
  deleteTestPlan: (id) =>
    set((state) => ({
      testPlans: state.testPlans.filter((p) => p.id !== id),
    })),
  getTestPlanById: (id) => get().testPlans.find((p) => p.id === id),

  // 테스트 실행 결과
  testResults: [],
  setTestResults: (results) => set({ testResults: results }),
  addTestResult: (result) =>
    set((state) => ({ testResults: [...state.testResults, result] })),
  updateTestResult: (id, result) =>
    set((state) => ({
      testResults: state.testResults.map((tr) =>
        tr.id === id ? { ...tr, ...result } : tr,
      ),
    })),

  // 현재 사용자
  currentUser: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'qa',
  },
  setCurrentUser: (user) => set({ currentUser: user }),

  // UI 상태
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  notification: null,
  setNotification: (notification) => set({ notification }),
}))
