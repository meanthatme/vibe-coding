import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { TestCase, TestStep, TestSuite } from '../types'
import { useAppStore } from '../store'

interface TestCaseEditModalProps {
  testCase: TestCase | undefined
  isOpen: boolean
  onClose: () => void
  onSave: (testCase: TestCase) => void
}

export default function TestCaseEditModal({
  testCase,
  isOpen,
  onClose,
  onSave,
}: TestCaseEditModalProps) {
  const { testSuites } = useAppStore()
  const [formData, setFormData] = useState<TestCase>(
    testCase || {
      id: '',
      title: '',
      suiteId: '',
      suite: '',
      priority: 'Medium',
      type: 'Functional',
      status: 'Draft',
      steps: [],
      expectedResult: '',
      tags: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: 'John Doe',
    }
  )

  // Update form data when testCase changes
  useEffect(() => {
    if (testCase) {
      setFormData(testCase)
    } else if (isOpen) {
      setFormData({
        id: '',
        title: '',
        suiteId: '',
        suite: '',
        priority: 'Medium',
        type: 'Functional',
        status: 'Draft',
        steps: [],
        expectedResult: '',
        tags: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        createdBy: 'John Doe',
      })
    }
  }, [testCase, isOpen])

  // Update form data
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    if (name === 'suiteId') {
      const selectedSuite = testSuites.find(s => s.id === value)
      setFormData((prev) => ({ 
        ...prev, 
        suiteId: value,
        suite: selectedSuite ? selectedSuite.name : ''
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Handle step input change
  const handleStepChange = (
    stepId: string,
    field: 'step' | 'expectedResult',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map((s) =>
        s.id === stepId ? { ...s, [field]: value } : s
      ),
    }))
  }

  // Add new step
  const addStep = () => {
    const newStep: TestStep = {
      id: `step-${Date.now()}`,
      step: '',
      expectedResult: '',
    }
    setFormData((prev) => ({ ...prev, steps: [...prev.steps, newStep] }))
  }

  // Remove step
  const removeStep = (stepId: string) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((s) => s.id !== stepId),
    }))
  }

  // Handle tags
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value
    const tags = tagsString.split(',').map((tag) => tag.trim())
    setFormData((prev) => ({ ...prev, tags }))
  }

  // Handle save
  const handleSave = () => {
    if (!formData.title.trim() || !formData.suiteId) {
      alert('제목과 테스트 스위트는 필수입니다.')
      return
    }

    const updatedData = {
      ...formData,
      updatedAt: new Date().toISOString().split('T')[0],
    }

    onSave(updatedData)
  }

  if (!isOpen) return null

  // Flatten suites for selector (with indentation for visual hierarchy)
  const renderSuiteOptions = (parentId?: string, level = 0): React.ReactNode[] => {
    const suites = testSuites.filter(s => s.parentId === parentId)
    let options: React.ReactNode[] = []
    
    suites.sort((a, b) => a.order - b.order).forEach(suite => {
      options.push(
        <option key={suite.id} value={suite.id}>
          {'\u00A0'.repeat(level * 4)}{suite.name}
        </option>
      )
      options = [...options, ...renderSuiteOptions(suite.id, level + 1)]
    })
    
    return options
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-51 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-surface-default shadow-elevation-5 m-4">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-outline-variant bg-surface-default px-6 py-4">
          <h2 className="text-headline-large font-bold text-on-surface">
            {testCase ? '테스트 케이스 편집' : '새 테스트 케이스'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-surface-container"
          >
            <X size={24} className="text-on-surface" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Title */}
          <div>
            <label className="text-label-medium font-medium text-on-surface">
              제목 *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="테스트 케이스 제목"
              className="mt-2 w-full rounded-md border border-outline-variant bg-surface-default px-3 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
            />
          </div>

          {/* Suite & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-label-medium font-medium text-on-surface">
                테스트 스위트 *
              </label>
              <select
                name="suiteId"
                value={formData.suiteId}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-outline-variant bg-surface-default px-3 py-2 text-body-medium text-on-surface focus:border-primary-500 focus:outline-none"
              >
                <option value="">스위트 선택...</option>
                {renderSuiteOptions()}
              </select>
            </div>
            <div>
              <label className="text-label-medium font-medium text-on-surface">
                우선순위
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-outline-variant bg-surface-default px-3 py-2 text-body-medium text-on-surface focus:border-primary-500 focus:outline-none"
              >
                <option value="Critical">긴급</option>
                <option value="High">높음</option>
                <option value="Medium">중간</option>
                <option value="Low">낮음</option>
              </select>
            </div>
          </div>

          {/* Type & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-label-medium font-medium text-on-surface">
                타입
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-outline-variant bg-surface-default px-3 py-2 text-body-medium text-on-surface focus:border-primary-500 focus:outline-none"
              >
                <option value="Functional">기능 테스트</option>
                <option value="Regression">회귀 테스트</option>
                <option value="Smoke">스모크 테스트</option>
                <option value="Performance">성능 테스트</option>
              </select>
            </div>
            <div>
              <label className="text-label-medium font-medium text-on-surface">
                상태
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-outline-variant bg-surface-default px-3 py-2 text-body-medium text-on-surface focus:border-primary-500 focus:outline-none"
              >
                <option value="Draft">초안</option>
                <option value="Active">활성</option>
                <option value="Deprecated">폐기됨</option>
              </select>
            </div>
          </div>

          {/* Precondition */}
          <div>
            <label className="text-label-medium font-medium text-on-surface">
              전제 조건
            </label>
            <textarea
              name="precondition"
              value={formData.precondition || ''}
              onChange={handleChange}
              placeholder="이 테스트를 실행하기 전에 필요한 조건..."
              rows={3}
              className="mt-2 w-full rounded-md border border-outline-variant bg-surface-default px-3 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
            />
          </div>

          {/* Steps */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-label-medium font-medium text-on-surface">
                테스트 단계
              </label>
              <button
                onClick={addStep}
                className="flex items-center gap-1 rounded-md bg-primary-100 px-3 py-1 text-label-small font-medium text-primary-500 hover:bg-primary-200 transition-colors"
              >
                <Plus size={16} />
                단계 추가
              </button>
            </div>

            <div className="space-y-3">
              {formData.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="rounded-lg border border-outline-variant p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-label-medium font-medium text-on-surface">
                      Step {index + 1}
                    </p>
                    <button
                      onClick={() => removeStep(step.id)}
                      className="rounded-md p-1 hover:bg-error-50"
                    >
                      <Trash2 size={16} className="text-error-500" />
                    </button>
                  </div>
                  <textarea
                    value={step.step}
                    onChange={(e) =>
                      handleStepChange(step.id, 'step', e.target.value)
                    }
                    placeholder="테스트 단계 설명"
                    rows={2}
                    className="w-full mb-2 rounded-md border border-outline-variant bg-surface-default px-3 py-2 text-body-small text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
                  />
                  <textarea
                    value={step.expectedResult}
                    onChange={(e) =>
                      handleStepChange(step.id, 'expectedResult', e.target.value)
                    }
                    placeholder="예상 결과"
                    rows={1}
                    className="w-full rounded-md border border-outline-variant bg-surface-default px-3 py-2 text-body-small text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Expected Result */}
          <div>
            <label className="text-label-medium font-medium text-on-surface">
              예상 결과
            </label>
            <textarea
              name="expectedResult"
              value={formData.expectedResult}
              onChange={handleChange}
              placeholder="전체 테스트의 예상 결과"
              rows={3}
              className="mt-2 w-full rounded-md border border-outline-variant bg-surface-default px-3 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
            />
          </div>

          {/* Assignee */}
          <div>
            <label className="text-label-medium font-medium text-on-surface">
              담당자
            </label>
            <input
              type="text"
              name="assignee"
              value={formData.assignee || ''}
              onChange={handleChange}
              placeholder="담당자 이름"
              className="mt-2 w-full rounded-md border border-outline-variant bg-surface-default px-3 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-label-medium font-medium text-on-surface">
              태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={formData.tags?.join(', ') || ''}
              onChange={handleTagsChange}
              placeholder="tag1, tag2, tag3"
              className="mt-2 w-full rounded-md border border-outline-variant bg-surface-default px-3 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-outline-variant bg-surface-default px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md border border-outline-variant px-4 py-2 text-body-medium font-medium text-on-surface hover:bg-surface-container transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="rounded-md bg-primary-500 px-4 py-2 text-body-medium font-medium text-white hover:bg-primary-700 transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}
