import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { Milestone } from '../types'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'

export default function TestPlanDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTestPlanById, addTestPlan, updateTestPlan, setNotification } =
    useAppStore()

  const existingPlan = id && id !== 'new' ? getTestPlanById(id) : null
  const [name, setName] = useState(existingPlan?.name || '')
  const [description, setDescription] = useState(existingPlan?.description || '')
  const [releaseDate, setReleaseDate] = useState(
    existingPlan?.releaseDate || new Date().toISOString().split('T')[0],
  )
  const [owner, setOwner] = useState(existingPlan?.owner || '')
  const [status, setStatus] = useState(existingPlan?.status || 'Preparing')
  const [selectedTestSuites, setSelectedTestSuites] = useState<string[]>(
    existingPlan?.testSuites || [],
  )
  const [milestones, setMilestones] = useState<Milestone[]>(
    existingPlan?.milestones || [
      {
        id: '1',
        name: 'Smoke Test',
        targetDate: new Date().toISOString().split('T')[0],
        type: 'smoke',
      },
    ],
  )

  const availableTestSuites = ['Authentication', 'TestCase Management', 'Planning', 'Execution', 'Reporting']

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      {
        id: `milestone-${Date.now()}`,
        name: '',
        targetDate: new Date().toISOString().split('T')[0],
        type: 'functional',
      },
    ])
  }

  const handleRemoveMilestone = (milestoneId: string) => {
    setMilestones(milestones.filter((m) => m.id !== milestoneId))
  }

  const handleMilestoneChange = (
    milestoneId: string,
    field: string,
    value: string,
  ) => {
    setMilestones(
      milestones.map((m) =>
        m.id === milestoneId ? { ...m, [field]: value } : m,
      ),
    )
  }

  const handleSave = () => {
    if (!name.trim()) {
      setNotification({
        type: 'error',
        message: '플랜 이름을 입력해주세요.',
      })
      return
    }

    if (!owner.trim()) {
      setNotification({
        type: 'error',
        message: '담당자를 입력해주세요.',
      })
      return
    }

    if (selectedTestSuites.length === 0) {
      setNotification({
        type: 'error',
        message: '최소 한 개의 테스트 스위트를 선택해주세요.',
      })
      return
    }

    const planData = {
      id: existingPlan?.id || `plan-${Date.now()}`,
      name,
      description,
      releaseDate,
      owner,
      status: status as any,
      milestones: milestones.filter((m) => m.name.trim()),
      testSuites: selectedTestSuites,
      environments: [
        {
          browser: 'Chrome' as const,
          os: 'Windows' as const,
          device: 'Desktop',
          resolution: '1920x1080',
          network: 'WiFi',
        },
      ],
      createdAt: existingPlan?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }  as any;

    if (existingPlan) {
      updateTestPlan(id!, planData)
      setNotification({
        type: 'success',
        message: '테스트 플랜이 업데이트되었습니다.',
      })
    } else {
      addTestPlan(planData)
      setNotification({
        type: 'success',
        message: '테스트 플랜이 생성되었습니다.',
      })
    }

    navigate('/test-plans')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/test-plans')}
          className="flex items-center gap-2 text-primary-500 hover:text-primary-700"
        >
          <ArrowLeft size={20} />
          돌아가기
        </button>
        <h1 className="text-headline-large font-bold text-on-surface">
          {existingPlan ? '테스트 플랜 편집' : '새 테스트 플랜'}
        </h1>
      </div>

      {/* Main Form */}
      <div className="space-y-6 rounded-lg border border-outline-variant bg-surface-default p-6 shadow-elevation-1">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-title-large font-medium text-on-surface">
            기본 정보
          </h2>

          <div className="space-y-3">
            <label className="block">
              <span className="text-body-medium font-medium text-on-surface">
                플랜명 *
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: v2.0 정식 출시"
                className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="text-body-medium font-medium text-on-surface">
                설명
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="이 테스트 플랜의 목적과 범위 설명"
                rows={3}
                className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
              />
            </label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <label className="block">
                <span className="text-body-medium font-medium text-on-surface">
                  배포 예정일 *
                </span>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface"
                />
              </label>

              <label className="block">
                <span className="text-body-medium font-medium text-on-surface">
                  담당자 *
                </span>
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="담당자 이름"
                  className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="text-body-medium font-medium text-on-surface">
                  상태
                </span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Preparing" | "InProgress" | "Completed" | "Cancelled")}
                  className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface"
                >
                  <option value="Preparing">준비중</option>
                  <option value="InProgress">진행중</option>
                  <option value="Completed">완료</option>
                  <option value="Cancelled">취소됨</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="border-t border-outline-variant pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-title-large font-medium text-on-surface">
              마일스톤
            </h2>
            <button
              onClick={handleAddMilestone}
              className="flex items-center gap-2 rounded-md bg-primary-500 px-3 py-2 text-white hover:bg-primary-700 transition-colors"
            >
              <Plus size={18} />
              마일스톤 추가
            </button>
          </div>

          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className="rounded-md border border-outline-variant p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-body-medium font-medium text-on-surface">
                    마일스톤 {index + 1}
                  </p>
                  {milestones.length > 1 && (
                    <button
                      onClick={() => handleRemoveMilestone(milestone.id)}
                      className="text-status-failed hover:bg-status-failed-bg rounded-full p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <input
                    type="text"
                    value={milestone.name}
                    onChange={(e) =>
                      handleMilestoneChange(milestone.id, 'name', e.target.value)
                    }
                    placeholder="마일스톤 이름 (예: Smoke Test)"
                    className="rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
                  />

                  <input
                    type="date"
                    value={milestone.targetDate}
                    onChange={(e) =>
                      handleMilestoneChange(milestone.id, 'targetDate', e.target.value)
                    }
                    className="rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface"
                  />

                  <select
                    value={milestone.type}
                    onChange={(e) =>
                      handleMilestoneChange(milestone.id, 'type', e.target.value)
                    }
                    className="rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface"
                  >
                    <option value="smoke">Smoke Test</option>
                    <option value="functional">Functional Test</option>
                    <option value="regression">Regression Test</option>
                    <option value="release">Release</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Suites Selection */}
        <div className="border-t border-outline-variant pt-6">
          <h2 className="mb-4 text-title-large font-medium text-on-surface">
            테스트 스위트 선택 *
          </h2>
          <div className="space-y-2">
            {availableTestSuites.map((suite) => (
              <label key={suite} className="flex items-center gap-3 rounded-md p-3 hover:bg-surface-container cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTestSuites.includes(suite)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTestSuites([...selectedTestSuites, suite])
                    } else {
                      setSelectedTestSuites(
                        selectedTestSuites.filter((s) => s !== suite),
                      )
                    }
                  }}
                  className="h-4 w-4 rounded-sm border-outline-variant text-primary-500"
                />
                <span className="text-body-medium text-on-surface">{suite}</span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-label-small text-on-surface-variant">
            선택됨: {selectedTestSuites.length}개
          </p>
        </div>

        {/* Actions */}
        <div className="border-t border-outline-variant flex gap-3 pt-6">
          <button
            onClick={handleSave}
            className="flex-1 rounded-md bg-primary-500 px-4 py-2 text-body-medium font-medium text-white hover:bg-primary-700 transition-colors"
          >
            저장
          </button>
          <button
            onClick={() => navigate('/test-plans')}
            className="flex-1 rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium font-medium text-on-surface hover:bg-surface-container transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}
