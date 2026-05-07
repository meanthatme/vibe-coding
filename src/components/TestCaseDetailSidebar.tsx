import { X, Edit2 } from 'lucide-react'
import { TestCase } from '../types'
import StatusBadge from './StatusBadge'

interface TestCaseDetailSidebarProps {
  testCase: TestCase | undefined
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
}

export default function TestCaseDetailSidebar({
  testCase,
  isOpen,
  onClose,
  onEdit,
}: TestCaseDetailSidebarProps) {
  if (!testCase) return null

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-surface-default shadow-elevation-4 z-40 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-outline-variant bg-surface-default px-6 py-4">
          <h2 className="text-headline-medium font-bold text-on-surface">
            상세 정보
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
            <h3 className="text-headline-small font-bold text-on-surface">
              {testCase.title}
            </h3>
          </div>

          {/* Status & Priority */}
          <div className="space-y-3">
            <div>
              <p className="text-label-medium text-on-surface-variant mb-2">
                상태
              </p>
              <StatusBadge status={testCase.status} type="status" />
            </div>
            <div>
              <p className="text-label-medium text-on-surface-variant mb-2">
                우선순위
              </p>
              <StatusBadge status={testCase.priority} type="priority" />
            </div>
            <div>
              <p className="text-label-medium text-on-surface-variant mb-2">
                타입
              </p>
              <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-label-small font-medium text-primary-500">
                {testCase.type}
              </span>
            </div>
          </div>

          {/* Suite & Assignee */}
          <div className="space-y-3 border-t border-outline-variant pt-4">
            <div>
              <p className="text-label-medium text-on-surface-variant mb-1">
                테스트 스위트
              </p>
              <p className="text-body-medium text-on-surface">{testCase.suite}</p>
            </div>
            {testCase.assignee && (
              <div>
                <p className="text-label-medium text-on-surface-variant mb-1">
                  담당자
                </p>
                <p className="text-body-medium text-on-surface">
                  {testCase.assignee}
                </p>
              </div>
            )}
          </div>

          {/* Precondition */}
          {testCase.precondition && (
            <div className="border-t border-outline-variant pt-4">
              <p className="text-label-medium text-on-surface-variant mb-2">
                전제 조건
              </p>
              <p className="text-body-small text-on-surface whitespace-pre-wrap">
                {testCase.precondition}
              </p>
            </div>
          )}

          {/* Steps */}
          <div className="border-t border-outline-variant pt-4">
            <p className="text-label-medium text-on-surface-variant mb-3">
              테스트 단계 ({testCase.steps.length}개)
            </p>
            <div className="space-y-3">
              {testCase.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="rounded-lg bg-surface-container p-3"
                >
                  <p className="text-label-medium font-medium text-on-surface mb-1">
                    Step {index + 1}
                  </p>
                  <p className="text-body-small text-on-surface mb-2">
                    {step.step}
                  </p>
                  <p className="text-label-small text-on-surface-variant">
                    예상 결과: {step.expectedResult}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Expected Result */}
          <div className="border-t border-outline-variant pt-4">
            <p className="text-label-medium text-on-surface-variant mb-2">
              예상 결과
            </p>
            <p className="text-body-small text-on-surface whitespace-pre-wrap">
              {testCase.expectedResult}
            </p>
          </div>

          {/* Tags */}
          {testCase.tags && testCase.tags.length > 0 && (
            <div className="border-t border-outline-variant pt-4">
              <p className="text-label-medium text-on-surface-variant mb-2">
                태그
              </p>
              <div className="flex flex-wrap gap-2">
                {testCase.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary-100 px-3 py-1 text-label-small font-medium text-secondary-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-outline-variant pt-4 text-label-small text-on-surface-variant">
            <p>작성자: {testCase.createdBy}</p>
            <p>작성일: {testCase.createdAt}</p>
            <p>수정일: {testCase.updatedAt}</p>
          </div>

          {/* Edit Button */}
          <button
            onClick={onEdit}
            className="sticky bottom-0 w-full flex items-center justify-center gap-2 rounded-md bg-primary-500 px-4 py-3 text-white hover:bg-primary-700 transition-colors font-medium mt-6"
          >
            <Edit2 size={18} />
            편집
          </button>
        </div>
      </div>
    </>
  )
}
