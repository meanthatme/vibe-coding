// 테스트 케이스 타입 정의
export interface TestCase {
  id: string
  title: string
  suiteId: string
  suite: string // Keeping for backward compatibility or display name
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  type: 'Functional' | 'Regression' | 'Smoke' | 'Performance'
  status: 'Active' | 'Deprecated' | 'Draft'
  precondition?: string
  steps: TestStep[]
  expectedResult: string
  assignee?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface TestStep {
  id: string
  step: string
  expectedResult: string
}

// 테스트 스위트 타입 정의
export interface TestSuite {
  id: string
  name: string
  parentId?: string
  description?: string
  order: number
  createdAt: string
  updatedAt: string
}

// 테스트 플랜 타입 정의
export interface TestPlan {
  id: string
  name: string
  description?: string
  releaseDate: string
  owner: string
  status: 'Preparing' | 'InProgress' | 'Completed' | 'Cancelled'
  milestones: Milestone[]
  testSuites: string[] // Suite IDs
  environments: EnvironmentConfig[]
  createdAt: string
  updatedAt: string
}

export interface Milestone {
  id: string
  name: string
  targetDate: string
  description?: string
  type: 'smoke' | 'functional' | 'regression' | 'release'
}

export interface EnvironmentConfig {
  browser: 'Chrome' | 'Firefox' | 'Safari' | 'Edge'
  os: 'Windows' | 'macOS' | 'Ubuntu' | 'iOS' | 'Android'
  device: 'Desktop' | 'Mobile' | 'Tablet'
  resolution: string
  network: 'WiFi' | '4G' | 'LTE' | 'Offline'
}

// 테스트 실행 결과
export interface TestRunResult {
  id: string
  testCaseId: string
  planId: string
  status: 'Passed' | 'Failed' | 'Blocked' | 'Skipped' | 'InProgress'
  executionDate: string
  executedBy: string
  actualResult?: string
  notes?: string
  environment: EnvironmentConfig
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  uploadedAt: string
}

// 사용자 타입
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'lead' | 'qa' | 'developer'
  avatar?: string
}

// 대시보드 통계
export interface DashboardStats {
  totalTestCases: number
  totalPlans: number
  activePlans: number
  testCasesByStatus: Record<string, number>
  testResultsByStatus: Record<string, number>
  testCoverageByModule: Record<string, number>
  recentTestRuns: TestRunResult[]
}
