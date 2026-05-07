import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { ArrowLeft, Save } from 'lucide-react'

export default function TestRunDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { testResults, testCases, testPlans, addTestResult, updateTestResult, setNotification } =
    useAppStore()

  const existingRun = id && id !== 'new' ? testResults.find((r) => r.id === id) : null

  const [testCaseId, setTestCaseId] = useState(existingRun?.testCaseId || '')
  const [planId, setPlanId] = useState(existingRun?.planId || '')
  const [status, setStatus] = useState(existingRun?.status || 'InProgress')
  const [actualResult, setActualResult] = useState(existingRun?.actualResult || '')
  const [notes, setNotes] = useState(existingRun?.notes || '')
  const [browser, setBrowser] = useState(existingRun?.environment?.browser || 'Chrome')
  const [os, setOs] = useState(existingRun?.environment?.os || 'Windows')
  const [device, setDevice] = useState(existingRun?.environment?.device || 'Desktop')
  const [resolution, setResolution] = useState(existingRun?.environment?.resolution || '1920x1080')

  const selectedTestCase = testCases.find((tc) => tc.id === testCaseId)

  const handleSave = () => {
    if (!testCaseId) {
      setNotification({ type: 'error', message: '테스트 케이스를 선택해주세요.' })
      return
    }

    if (!planId) {
      setNotification({ type: 'error', message: '테스트 플랜을 선택해주세요.' })
      return
    }

    if (!actualResult.trim() && status === 'Failed') {
      setNotification({ type: 'error', message: '실패 원인을 입력해주세요.' })
      return
    }

    const runData = {
      id: existingRun?.id || `run-${Date.now()}`,
      testCaseId,
      planId,
      status: status as any,
      executionDate: existingRun?.executionDate || new Date().toISOString().split('T')[0],
      executedBy: existingRun?.executedBy || 'Current User',
      actualResult,
      notes,
      environment: {
        browser: browser as any,
        os: os as any,
        device: device as any,
        resolution,
        network: 'WiFi',
      },
    } as const;

    if (existingRun) {
      updateTestResult(id!, runData)
      setNotification({ type: 'success', message: '테스트 결과가 업데이트되었습니다.' })
    } else {
      addTestResult(runData)
      setNotification({ type: 'success', message: '테스트 결과가 기록되었습니다.' })
    }

    navigate('/test-runs')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/test-runs')}
          className="flex items-center gap-2 text-primary-500 hover:text-primary-700"
        >
          <ArrowLeft size={20} />
          돌아가기
        </button>
        <h1 className="text-headline-large font-bold text-on-surface">
          {existingRun ? '테스트 결과 보기' : '새 테스트 실행'}
        </h1>
      </div>

      {/* Main Form */}
      <div className="space-y-6 rounded-lg border border-outline-variant bg-surface-default p-6 shadow-elevation-1">
        {/* Test Case & Plan Selection */}
        <div className="space-y-4">
          <h2 className="text-title-large font-medium text-on-surface">
            테스트 선택
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-body-medium font-medium text-on-surface">
                테스트 케이스 *
              </span>
              <select
                value={testCaseId}
                onChange={(e) => setTestCaseId(e.target.value)}
                disabled={!!existingRun}
                className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface disabled:bg-surface-container disabled:cursor-not-allowed"
              >
                <option value="">테스트 케이스 선택...</option>
                {testCases.map((tc) => (
                  <option key={tc.id} value={tc.id}>
                    {tc.title} ({tc.suite})
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-body-medium font-medium text-on-surface">
                테스트 플랜 *
              </span>
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                disabled={!!existingRun}
                className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface disabled:bg-surface-container disabled:cursor-not-allowed"
              >
                <option value="">테스트 플랜 선택...</option>
                {testPlans.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {tp.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {selectedTestCase && (
            <div className="rounded-md bg-primary-50 p-4">
              <p className="text-body-medium font-medium text-on-surface">
                선택된 테스트 케이스
              </p>
              <p className="mt-2 text-body-medium text-on-surface">{selectedTestCase.title}</p>
              <p className="mt-1 text-body-small text-on-surface-variant">
                예상 결과: {selectedTestCase.expectedResult}
              </p>
            </div>
          )}
        </div>

        {/* Test Result */}
        <div className="border-t border-outline-variant pt-6">
          <h2 className="mb-4 text-title-large font-medium text-on-surface">
            테스트 결과
          </h2>

          <label className="block mb-4">
            <span className="text-body-medium font-medium text-on-surface">
              상태 *
            </span>
            <div className="mt-3 flex gap-3 flex-wrap">
              {(['Passed', 'Failed', 'Blocked', 'Skipped', 'InProgress'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`px-4 py-2 rounded-md font-medium text-body-medium transition-colors ${
                    status === st
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface-container text-on-surface hover:bg-outline-variant'
                  }`}
                >
                  {st === 'Passed' && '✓ 성공'}
                  {st === 'Failed' && '✗ 실패'}
                  {st === 'Blocked' && '⊗ 차단'}
                  {st === 'Skipped' && '⊖ 스킵'}
                  {st === 'InProgress' && '⟳ 진행중'}
                </button>
              ))}
            </div>
          </label>

          {status === 'Failed' && (
            <label className="block mb-4">
              <span className="text-body-medium font-medium text-on-surface">
                실패 원인 *
              </span>
              <textarea
                value={actualResult}
                onChange={(e) => setActualResult(e.target.value)}
                placeholder="실패 원인을 자세히 입력해주세요..."
                rows={4}
                className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
              />
            </label>
          )}

          <label className="block">
            <span className="text-body-medium font-medium text-on-surface">
              추가 노트
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="테스트 결과 관련 추가 정보..."
              rows={3}
              className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
            />
          </label>
        </div>

        {/* Environment Configuration */}
        <div className="border-t border-outline-variant pt-6">
          <h2 className="mb-4 text-title-large font-medium text-on-surface">
            테스트 환경
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-body-medium font-medium text-on-surface">
                브라우저
              </span>
              <select
                value={browser}
                // onChange={(e) => setBrowser(e.target.value)}
                // className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface"
                // onChange 부분에서 아래와 같이 타입을 명시해 주세요.
                onChange={(e) => setBrowser(e.target.value as "Chrome" | "Firefox" | "Safari" | "Edge")}
                className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface"
              >
                <option value="Chrome">Chrome</option>
                <option value="Firefox">Firefox</option>
                <option value="Safari">Safari</option>
                <option value="Edge">Edge</option>
              </select>
            </label>

            <label className="block">
              <span className="text-body-medium font-medium text-on-surface">
                운영체제
              </span>
              <select
                value={os}
                onChange={(e) => setOs(e.target.value as "Windows" | "macOS" | "Ubuntu" | "iOS" | "Android")}
                className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface"
              >
                <option value="Windows">Windows</option>
                <option value="macOS">macOS</option>
                <option value="Ubuntu">Ubuntu</option>
                <option value="iOS">iOS</option>
                <option value="Android">Android</option>
              </select>
            </label>

            <label className="block">
              <span className="text-body-medium font-medium text-on-surface">
                디바이스
              </span>
              <select
                value={device}
                onChange={(e) => setDevice(e.target.value as "Desktop" | "Mobile" | "Tablet")}
                className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface"
              >
                <option value="Desktop">Desktop</option>
                <option value="Mobile">Mobile</option>
                <option value="Tablet">Tablet</option>
              </select>
            </label>

            <label className="block">
              <span className="text-body-medium font-medium text-on-surface">
                해상도
              </span>
              <input
                type="text"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="1920x1080"
                className="mt-1 w-full rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
              />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-outline-variant flex gap-3 pt-6">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-body-medium font-medium text-white hover:bg-primary-700 transition-colors"
          >
            <Save size={18} />
            저장
          </button>
          <button
            onClick={() => navigate('/test-runs')}
            className="flex-1 rounded-md border border-outline-variant bg-surface-default px-4 py-2 text-body-medium font-medium text-on-surface hover:bg-surface-container transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}
