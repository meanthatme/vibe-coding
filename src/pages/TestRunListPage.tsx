import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Play } from 'lucide-react'
import { useAppStore } from '../store'
import StatusBadge from '../components/StatusBadge'

export default function TestRunListPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterPlan, setFilterPlan] = useState<string | null>(null)

  const { testResults, testPlans, setNotification } = useAppStore()

  // Mock 데이터 초기화
  useEffect(() => {
    if (testResults.length === 0) {
      // Store에 테스트 결과 추가
    }
  }, [])

  const filteredRuns = testResults.filter((run) => {
    const matchesSearch =
      run.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.executedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || run.status === filterStatus
    const matchesPlan = !filterPlan || run.planId === filterPlan
    return matchesSearch && matchesStatus && matchesPlan
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Passed': 'bg-status-passed-bg text-status-passed',
      'Failed': 'bg-status-failed-bg text-status-failed',
      'Blocked': 'bg-status-blocked-bg text-status-blocked',
      'Skipped': 'bg-status-skipped-bg text-status-skipped',
      'InProgress': 'bg-status-in-progress-bg text-status-in-progress',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-large font-bold text-on-surface">
            테스트 실행
          </h1>
          <p className="mt-2 text-body-medium text-on-surface-variant">
            총 {filteredRuns.length}개의 테스트 실행
          </p>
        </div>
        <button
          onClick={() => navigate('/test-runs/new')}
          className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          새 테스트 실행
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-4 rounded-lg border border-outline-variant bg-surface-default p-6 shadow-elevation-1 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-3 text-on-surface-variant"
            />
            <input
              type="text"
              placeholder="ID, 담당자로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-outline-variant bg-surface-default py-2 pl-10 pr-4 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <select
          value={filterStatus || ''}
          onChange={(e) => setFilterStatus(e.target.value || null)}
          className="rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface"
        >
          <option value="">모든 상태</option>
          <option value="Passed">성공</option>
          <option value="Failed">실패</option>
          <option value="Blocked">차단</option>
          <option value="Skipped">스킵</option>
          <option value="InProgress">진행중</option>
        </select>

        <select
          value={filterPlan || ''}
          onChange={(e) => setFilterPlan(e.target.value || null)}
          className="rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface"
        >
          <option value="">모든 플랜</option>
          {testPlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>
      </div>

      {/* Test Runs Table */}
      <div className="overflow-x-auto rounded-lg border border-outline-variant shadow-elevation-1">
        <table className="w-full">
          <thead className="bg-surface-container">
            <tr>
              <th className="px-6 py-4 text-left text-label-large font-medium text-on-surface">
                실행 ID
              </th>
              <th className="px-6 py-4 text-left text-label-large font-medium text-on-surface">
                테스트 케이스
              </th>
              <th className="px-6 py-4 text-left text-label-large font-medium text-on-surface">
                담당자
              </th>
              <th className="px-6 py-4 text-left text-label-large font-medium text-on-surface">
                상태
              </th>
              <th className="px-6 py-4 text-left text-label-large font-medium text-on-surface">
                실행 날짜
              </th>
              <th className="px-6 py-4 text-center text-label-large font-medium text-on-surface">
                작업
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRuns.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-body-medium text-on-surface-variant">
                  테스트 실행이 없습니다.
                </td>
              </tr>
            ) : (
              filteredRuns.map((run, index) => (
                <tr
                  key={run.id}
                  className={`border-t border-outline-variant hover:bg-surface-container transition-colors ${
                    index % 2 === 1 ? 'bg-surface-default' : 'bg-white'
                  }`}
                >
                  <td className="px-6 py-4 text-body-medium text-on-surface font-mono">
                    {run.id}
                  </td>
                  <td className="px-6 py-4 text-body-medium text-on-surface">
                    Case #{run.testCaseId}
                  </td>
                  <td className="px-6 py-4 text-body-medium text-on-surface">
                    {run.executedBy}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-sm px-3 py-1 text-label-small font-medium ${getStatusColor(run.status)}`}
                    >
                      {run.status === 'Passed' && '✓ 성공'}
                      {run.status === 'Failed' && '✗ 실패'}
                      {run.status === 'Blocked' && '⊗ 차단'}
                      {run.status === 'Skipped' && '⊖ 스킵'}
                      {run.status === 'InProgress' && '⟳ 진행중'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-body-medium text-on-surface-variant">
                    {run.executionDate}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => navigate(`/test-runs/${run.id}`)}
                      className="rounded-md bg-primary-100 px-3 py-2 text-body-medium font-medium text-primary-500 hover:bg-primary-200 transition-colors"
                    >
                      보기
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
