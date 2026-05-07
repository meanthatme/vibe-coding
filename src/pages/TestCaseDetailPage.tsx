import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { TestStep } from '../types'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'

export default function TestCaseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTestCaseById, addTestCase, updateTestCase, setNotification } =
    useAppStore()

  const existingCase = id && id !== 'new' ? getTestCaseById(id) : null
  const [title, setTitle] = useState(existingCase?.title || '')
  const [suite, setSuite] = useState(existingCase?.suite || '')
  const [priority, setPriority] = useState(existingCase?.priority || 'Medium')
  const [type, setType] = useState(existingCase?.type || 'Functional')
  const [status, setStatus] = useState(existingCase?.status || 'Draft')
  const [precondition, setPrecondition] = useState(existingCase?.precondition || '')
  const [expectedResult, setExpectedResult] = useState(
    existingCase?.expectedResult || '',
  )
  const [assignee, setAssignee] = useState(existingCase?.assignee || '')
  const [tags, setTags] = useState(existingCase?.tags?.join(', ') || '')
  const [steps, setSteps] = useState<TestStep[]>(
    existingCase?.steps || [
      {
        id: '1',
        step: '',
        expectedResult: '',
      },
    ],
  )

  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        id: `step-${Date.now()}`,
        step: '',
        expectedResult: '',
      },
    ])
  }

  const handleRemoveStep = (stepId: string) => {
    setSteps(steps.filter((s) => s.id !== stepId))
  }

  const handleStepChange = (
    stepId: string,
    field: 'step' | 'expectedResult',
    value: string,
  ) => {
    setSteps(
      steps.map((s) => (s.id === stepId ? { ...s, [field]: value } : s)),
    )
  }

  const handleSave = () => {
    if (!title.trim()) {
      setNotification({
        type: 'error',
        message: '제목을 입력해주세요.',
      })
      return
    }

    if (!expectedResult.trim()) {
      setNotification({
        type: 'error',
        message: '예상 결과를 입력해주세요.',
      })
      return
    }

    const caseData = {
      id: existingCase?.id || `tc-${Date.now()}`,
      title,
      suite,
      suiteId: "실제_ID_값",
      priority: priority as any,
      type: type as any,
      status: status as any,
      precondition,
      steps: steps.filter((s) => s.step.trim() || s.expectedResult.trim()),
      expectedResult,
      assignee,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t),
      createdAt: existingCase?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: existingCase?.createdBy || 'Current User',
    }

    if (existingCase) {
      updateTestCase(id!, caseData)
      setNotification({
        type: 'success',
        message: '테스트 케이스가 업데이트되었습니다.',
      })
    } else {
      addTestCase(caseData)
      setNotification({
        type: 'success',
        message: '테스트 케이스가 생성되었습니다.',
      })
    }

    navigate('/test-cases')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/test-cases')}
          className="flex items-center gap-2 text-primary-500 hover:text-primary-700"
        >
          <ArrowLeft size={20} />
          돌아가기
        </button>
        <h1 className="text-headline-large font-bold text-on-surface">
          {existingCase ? '테스트 케이스 편집' : '새 테스트 케이스'}
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
                제목 *
              </span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="테스트 케이스 제목 입력"
                className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
              />
            </label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-body-medium font-medium text-on-surface">
                  테스트 스위트 *
                </span>
                <input
                  type="text"
                  value={suite}
                  onChange={(e) => setSuite(e.target.value)}
                  placeholder="스위트 이름"
                  className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="text-body-medium font-medium text-on-surface">
                  담당자
                </span>
                <input
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  placeholder="담당자 이름"
                  className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <label className="block">
                <span className="text-body-medium font-medium text-on-surface">
                  우선순위
                </span>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as "Critical" | "High" | "Medium" | "Low")}
                  className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface"
                >
                  <option value="Critical">긴급</option>
                  <option value="High">높음</option>
                  <option value="Medium">중간</option>
                  <option value="Low">낮음</option>
                </select>
              </label>

              <label className="block">
                <span className="text-body-medium font-medium text-on-surface">
                  타입
                </span>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "Functional" | "Regression" | "Smoke" | "Performance")}
                  className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface"
                >
                  <option value="Functional">기능</option>
                  <option value="Regression">회귀</option>
                  <option value="Smoke">스모크</option>
                  <option value="Performance">성능</option>
                </select>
              </label>

              <label className="block">
                <span className="text-body-medium font-medium text-on-surface">
                  상태
                </span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Draft" | "Active" | "Deprecated")}
                  className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface"
                >
                  <option value="Draft">초안</option>
                  <option value="Active">활성</option>
                  <option value="Deprecated">폐기</option>
                </select>
              </label>

              <label className="block">
                <span className="text-body-medium font-medium text-on-surface">
                  태그
                </span>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="쉼표로 구분"
                  className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-body-medium font-medium text-on-surface">
                전제조건
              </span>
              <textarea
                value={precondition}
                onChange={(e) => setPrecondition(e.target.value)}
                placeholder="테스트 실행을 위한 전제조건 입력"
                rows={3}
                className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
              />
            </label>
          </div>
        </div>

        {/* Test Steps */}
        <div className="border-t border-outline-variant pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-title-large font-medium text-on-surface">
              테스트 단계
            </h2>
            <button
              onClick={handleAddStep}
              className="flex items-center gap-2 rounded-md bg-primary-500 px-3 py-2 text-white hover:bg-primary-700 transition-colors"
            >
              <Plus size={18} />
              단계 추가
            </button>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="rounded-md border border-outline-variant p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-body-medium font-medium text-on-surface">
                    Step {index + 1}
                  </p>
                  {steps.length > 1 && (
                    <button
                      onClick={() => handleRemoveStep(step.id)}
                      className="text-status-failed hover:bg-status-failed-bg rounded-full p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block">
                    <span className="text-body-small text-on-surface-variant">
                      실행 단계
                    </span>
                    <input
                      type="text"
                      value={step.step}
                      onChange={(e) =>
                        handleStepChange(step.id, 'step', e.target.value)
                      }
                      placeholder="테스트 단계 입력"
                      className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="text-body-small text-on-surface-variant">
                      예상 결과
                    </span>
                    <input
                      type="text"
                      value={step.expectedResult}
                      onChange={(e) =>
                        handleStepChange(
                          step.id,
                          'expectedResult',
                          e.target.value,
                        )
                      }
                      placeholder="예상되는 결과 입력"
                      className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expected Result */}
        <div className="border-t border-outline-variant pt-6">
          <label className="block">
            <span className="text-body-medium font-medium text-on-surface">
              예상 결과 *
            </span>
            <textarea
              value={expectedResult}
              onChange={(e) => setExpectedResult(e.target.value)}
              placeholder="테스트의 최종 예상 결과 입력"
              rows={3}
              className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
            />
          </label>
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
            onClick={() => navigate('/test-cases')}
            className="flex-1 rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium font-medium text-on-surface hover:bg-surface-container transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}
