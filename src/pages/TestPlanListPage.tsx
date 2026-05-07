import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Trash2, Edit } from 'lucide-react'
import { useAppStore } from '../store'
import StatusBadge from '../components/StatusBadge'

export default function TestPlanListPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const { testPlans, addTestPlan, updateTestPlan, deleteTestPlan, setNotification } =
    useAppStore()

  const filteredPlans = testPlans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || plan.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Preparing': 'bg-yellow-100 text-yellow-700',
      'InProgress': 'bg-primary-100 text-primary-500',
      'Completed': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-gray-100 text-gray-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getProgressPercentage = (plan: any) => {
    const completedMilestones = plan.milestones.filter(
      (m: any) => new Date(m.targetDate) < new Date(),
    ).length
    return Math.round(
      (completedMilestones / plan.milestones.length) * 100 || 0,
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-large font-bold text-on-surface">
            테스트 플랜
          </h1>
          <p className="mt-2 text-body-medium text-on-surface-variant">
            총 {filteredPlans.length}개의 테스트 플랜
          </p>
        </div>
        <button
          onClick={() => navigate('/test-plans/new')}
          className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          새 테스트 플랜
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
              placeholder="플랜 이름으로 검색..."
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
          <option value="Preparing">준비중</option>
          <option value="InProgress">진행중</option>
          <option value="Completed">완료</option>
          <option value="Cancelled">취소됨</option>
        </select>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-lg border border-outline-variant bg-surface-default shadow-elevation-1 hover:shadow-elevation-2 transition-shadow overflow-hidden"
          >
            {/* Card Header */}
            <div className="border-b border-outline-variant bg-surface-container p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-title-medium font-medium text-on-surface">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-body-small text-on-surface-variant">
                    {plan.description}
                  </p>
                </div>
                <span className={`rounded-md px-2 py-1 text-label-small font-medium ${getStatusColor(plan.status)}`}>
                  {plan.status === 'Preparing' && '준비중'}
                  {plan.status === 'InProgress' && '진행중'}
                  {plan.status === 'Completed' && '완료'}
                  {plan.status === 'Cancelled' && '취소됨'}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="space-y-4 p-4">
              {/* Release Date */}
              <div>
                <p className="text-label-small font-medium text-on-surface-variant">
                  배포 예정일
                </p>
                <p className="text-body-medium text-on-surface">
                  {new Date(plan.releaseDate).toLocaleDateString('ko-KR')}
                </p>
              </div>

              {/* Owner */}
              <div>
                <p className="text-label-small font-medium text-on-surface-variant">
                  담당자
                </p>
                <p className="text-body-medium text-on-surface">{plan.owner}</p>
              </div>

              {/* Milestones */}
              <div>
                <p className="text-label-small font-medium text-on-surface-variant">
                  마일스톤
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {plan.milestones.map((milestone: any) => (
                    <span
                      key={milestone.id}
                      className="rounded-sm bg-primary-100 px-2 py-1 text-label-small font-medium text-primary-500"
                    >
                      {milestone.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div>
                <p className="text-label-small font-medium text-on-surface-variant">
                  진행률
                </p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-outline-variant">
                  <div
                    style={{ width: `${getProgressPercentage(plan)}%` }}
                    className="h-full bg-primary-500 transition-all duration-300"
                  />
                </div>
                <p className="mt-1 text-label-small text-on-surface-variant">
                  {getProgressPercentage(plan)}%
                </p>
              </div>

              {/* Test Suites */}
              <div>
                <p className="text-label-small font-medium text-on-surface-variant">
                  테스트 스위트
                </p>
                <p className="text-body-medium text-on-surface">
                  {plan.testSuites.length}개 선택됨
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="border-t border-outline-variant flex gap-2 p-4">
              <button
                onClick={() => navigate(`/test-plans/${plan.id}`)}
                className="flex-1 flex items-center justify-center gap-2 rounded-md bg-primary-500 px-3 py-2 text-white hover:bg-primary-700 transition-colors"
              >
                <Edit size={16} />
                편집
              </button>
              <button
                onClick={() => {
                  deleteTestPlan(plan.id)
                  setNotification({
                    type: 'success',
                    message: '테스트 플랜이 삭제되었습니다.',
                  })
                }}
                className="rounded-md border border-status-failed bg-status-failed-bg px-3 py-2 text-status-failed hover:bg-status-failed transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-outline-variant bg-surface-default py-12">
          <p className="text-body-medium text-on-surface-variant">
            테스트 플랜이 없습니다.
          </p>
          <button
            onClick={() => navigate('/test-plans/new')}
            className="mt-4 text-primary-500 hover:text-primary-700 underline"
          >
            새 플랜 생성하기
          </button>
        </div>
      )}
    </div>
  )
}
