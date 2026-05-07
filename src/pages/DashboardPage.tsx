import { useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useAppStore } from '../store'
import { TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react'
export default function DashboardPage() {
  const { testCases, testPlans, testResults, setTestCases, setTestPlans, setTestResults } = useAppStore()

  // Mock data initialization
  useEffect(() => {
    if (testCases.length === 0) {
      setTestCases([
        {
          id: '1',
          title: '로그인 기능 테스트',
          suite: 'Authentication',
          priority: 'Critical',
          type: 'Functional',
          status: 'Active',
          precondition: '테스트 환경이 준비되어 있어야 함',
          steps: [
            { id: '1', step: '로그인 페이지 접속', expectedResult: '로그인 폼이 표시됨' },
            { id: '2', step: '유효한 자격증명 입력', expectedResult: '성공 메시지와 함께 대시보드로 이동' },
          ],
          expectedResult: '사용자가 정상 로그인됨',
          assignee: 'John Doe',
          tags: ['auth', 'critical'],
          createdAt: '2026-04-25',
          updatedAt: '2026-04-30',
          createdBy: 'John Doe',
        },
        {
          id: '2',
          title: '테스트 케이스 생성 기능',
          suite: 'TestCase Management',
          priority: 'High',
          type: 'Functional',
          status: 'Active',
          steps: [
            { id: '1', step: '새 테스트 케이스 버튼 클릭', expectedResult: '생성 폼 표시' },
            { id: '2', step: '필수 정보 입력 후 저장', expectedResult: '테스트 케이스 생성됨' },
          ],
          expectedResult: '테스트 케이스가 목록에 추가됨',
          assignee: 'Jane Smith',
          tags: ['test-management'],
          createdAt: '2026-04-28',
          updatedAt: '2026-04-30',
          createdBy: 'Jane Smith',
        },
      ])
    }

    if (testPlans.length === 0) {
      setTestPlans([
        {
          id: '1',
          name: 'v2.0 정식 출시',
          description: '메이저 버전 업데이트 테스트',
          releaseDate: '2026-06-05',
          owner: 'John Doe',
          status: 'InProgress',
          milestones: [
            { id: '1', name: 'Smoke Test', targetDate: '2026-05-15', type: 'smoke' },
            { id: '2', name: 'Functional Test', targetDate: '2026-05-22', type: 'functional' },
            { id: '3', name: 'Regression Test', targetDate: '2026-05-29', type: 'regression' },
            { id: '4', name: 'Release', targetDate: '2026-06-05', type: 'release' },
          ],
          testSuites: ['1', '2'],
          environments: [
            {
              browser: 'Chrome',
              os: 'Windows',
              device: 'Desktop',
              resolution: '1920x1080',
              network: 'WiFi',
            },
          ],
          createdAt: '2026-04-20',
          updatedAt: '2026-04-30',
        },
      ])
    }

    if (testResults.length === 0) {
      setTestResults([
        {
          id: '1',
          testCaseId: '1',
          planId: '1',
          status: 'Passed',
          executionDate: '2026-04-30',
          executedBy: 'John Doe',
          notes: '모든 시나리오가 정상 작동',
          environment: {
            browser: 'Chrome',
            os: 'Windows',
            device: 'Desktop',
            resolution: '1920x1080',
            network: 'WiFi',
          },
        },
      ])
    }
  }, [])

  // 통계 계산
  const stats = {
    totalTestCases: testCases.length,
    activePlans: testPlans.filter((p) => p.status === 'InProgress').length,
    passedTests: testResults.filter((r) => r.status === 'Passed').length,
    failedTests: testResults.filter((r) => r.status === 'Failed').length,
  }

  const testResultsChart = [
    {
      name: 'Passed',
      value: testResults.filter((r) => r.status === 'Passed').length,
    },
    {
      name: 'Failed',
      value: testResults.filter((r) => r.status === 'Failed').length,
    },
    {
      name: 'Blocked',
      value: testResults.filter((r) => r.status === 'Blocked').length,
    },
    {
      name: 'Skipped',
      value: testResults.filter((r) => r.status === 'Skipped').length,
    },
  ]

  const colors = ['#16A34A', '#DC2626', '#EA580C', '#6B7280']

  return (
    <div className="space-y-6">
      {/* 핵심 통계 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          {
            icon: TrendingUp,
            label: '테스트 케이스',
            value: stats.totalTestCases,
            color: 'bg-primary-500',
          },
          {
            icon: Clock,
            label: '진행중 플랜',
            value: stats.activePlans,
            color: 'bg-status-in-progress',
          },
          {
            icon: CheckCircle,
            label: '성공 테스트',
            value: stats.passedTests,
            color: 'bg-status-passed',
          },
          {
            icon: AlertCircle,
            label: '실패 테스트',
            value: stats.failedTests,
            color: 'bg-status-failed',
          },
        ].map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div
              key={idx}
              className="rounded-lg border border-outline-variant bg-surface-default p-6 shadow-elevation-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-label-medium text-on-surface-variant">
                    {stat.label}
                  </p>
                  <p className="text-headline-large font-bold text-on-surface">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-lg ${stat.color} p-3 text-white`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 차트 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 테스트 결과 분포 */}
        <div className="rounded-lg border border-outline-variant bg-surface-default p-6 shadow-elevation-1">
          <h3 className="mb-4 text-title-medium font-medium text-on-surface">
            테스트 결과 분포
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={testResultsChart}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {colors.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 테스트 플랜 타임라인 */}
        <div className="rounded-lg border border-outline-variant bg-surface-default p-6 shadow-elevation-1">
          <h3 className="mb-4 text-title-medium font-medium text-on-surface">
            활성 테스트 플랜
          </h3>
          <div className="space-y-4">
            {testPlans
              .filter((p) => p.status === 'InProgress')
              .map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-md border border-outline-variant p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-on-surface">{plan.name}</p>
                      <p className="text-body-small text-on-surface-variant">
                        {plan.description}
                      </p>
                    </div>
                    <span className="text-label-small font-medium text-primary-500">
                      {plan.milestones.length} 마일스톤
                    </span>
                  </div>
                  <div className="mt-2 flex gap-1">
                    {plan.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="flex-1 rounded-sm bg-primary-100 py-1 text-center text-label-small font-medium text-primary-500"
                      >
                        {milestone.type}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 최근 테스트 실행 */}
      <div className="rounded-lg border border-outline-variant bg-surface-default p-6 shadow-elevation-1">
        <h3 className="mb-4 text-title-medium font-medium text-on-surface">
          최근 테스트 실행
        </h3>
        <div className="space-y-2">
          {testResults.slice(0, 5).map((result) => (
            <div
              key={result.id}
              className="flex items-center justify-between rounded-md border border-outline-variant p-3"
            >
              <div className="flex-1">
                <p className="text-body-medium text-on-surface">
                  테스트 케이스 #{result.testCaseId}
                </p>
                <p className="text-label-small text-on-surface-variant">
                  {result.executedBy} · {result.executionDate}
                </p>
              </div>
              <span
                className={`rounded-sm px-3 py-1 text-label-small font-medium ${
                  result.status === 'Passed'
                    ? 'bg-status-passed-bg text-status-passed'
                    : result.status === 'Failed'
                      ? 'bg-status-failed-bg text-status-failed'
                      : 'bg-status-in-progress-bg text-status-in-progress'
                }`}
              >
                {result.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
