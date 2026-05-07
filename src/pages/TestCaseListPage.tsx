import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Filter } from 'lucide-react'
import { useAppStore } from '../store'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import TestCaseDetailSidebar from '../components/TestCaseDetailSidebar'
import TestCaseEditModal from '../components/TestCaseEditModal'
import SuiteSidebar from '../components/SuiteSidebar'
import { TestCase } from '../types'

export default function TestCaseListPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterPriority, setFilterPriority] = useState<string | null>(null)
  const [selectedSuiteId, setSelectedSuiteId] = useState<string | null>(null)
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const { testCases, testSuites, addTestCase, updateTestCase, deleteTestCase, getTestCaseById, setNotification } =
    useAppStore()

  // Get all descendant suite IDs
  const getDescendantSuiteIds = (suiteId: string): string[] => {
    const children = testSuites.filter((s) => s.parentId === suiteId)
    let ids = [suiteId]
    children.forEach((child) => {
      ids = [...ids, ...getDescendantSuiteIds(child.id)]
    })
    return ids
  }

  // Filter test cases
  const filteredCases = testCases.filter((tc) => {
    const matchesSearch =
      tc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tc.suite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tc.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    const matchesStatus = !filterStatus || tc.status === filterStatus
    const matchesPriority = !filterPriority || tc.priority === filterPriority
    
    // Filter by suite
    let matchesSuite = true
    if (selectedSuiteId) {
      const suiteIds = getDescendantSuiteIds(selectedSuiteId)
      matchesSuite = suiteIds.includes(tc.suiteId)
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesSuite
  })

  const columns = [
    {
      key: 'title' as const,
      label: '제목',
      render: (value: string, row: any) => (
        <button
          onClick={() => {
            setSelectedTestCaseId(row.id)
            setIsSidebarOpen(true)
          }}
          className="text-primary-500 hover:underline font-medium"
        >
          {value}
        </button>
      ),
    },
    {
      key: 'suite' as const,
      label: '테스트 스위트',
    },
    {
      key: 'priority' as const,
      label: '우선순위',
      render: (value: string) => <StatusBadge status={value} type="priority" />,
    },
    {
      key: 'type' as const,
      label: '타입',
    },
    {
      key: 'status' as const,
      label: '상태',
      render: (value: string) => <StatusBadge status={value} type="status" />,
    },
    {
      key: 'assignee' as const,
      label: '담당자',
    },
  ]

  return (
    <div className="flex h-[calc(100vh-112px)] -m-6 overflow-hidden bg-surface-default">
      {/* Suite Sidebar */}
      <SuiteSidebar 
        selectedSuiteId={selectedSuiteId} 
        onSelectSuite={setSelectedSuiteId} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Fixed at top of main content */}
        <div className="p-6 border-b border-outline-variant bg-surface-default">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-headline-large font-bold text-on-surface">
                테스트 케이스
              </h1>
              <p className="mt-1 text-body-medium text-on-surface-variant">
                총 {filteredCases.length}개의 테스트 케이스
              </p>
            </div>
            <button
              onClick={() => navigate('/test-cases/new')}
              className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-700 transition-colors shadow-elevation-1"
            >
              <Plus size={20} />
              새 테스트 케이스
            </button>
          </div>

          {/* Search & Filter - Inlined in header */}
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-2.5 text-on-surface-variant"
                />
                <input
                  type="text"
                  placeholder="제목, 스위트, 태그로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border border-outline-variant bg-surface-default py-2 pl-10 pr-4 text-body-medium text-on-surface placeholder-on-surface-variant focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <select
                value={filterStatus || ''}
                onChange={(e) => setFilterStatus(e.target.value || null)}
                className="rounded-md border border-outline-variant bg-surface-default px-3 py-2 text-body-medium text-on-surface focus:border-primary-500 focus:outline-none"
              >
                <option value="">모든 상태</option>
                <option value="Active">활성</option>
                <option value="Draft">초안</option>
                <option value="Deprecated">폐기됨</option>
              </select>

              <select
                value={filterPriority || ''}
                onChange={(e) => setFilterPriority(e.target.value || null)}
                className="rounded-md border border-outline-variant bg-surface-default px-3 py-2 text-body-medium text-on-surface focus:border-primary-500 focus:outline-none"
              >
                <option value="">모든 우선순위</option>
                <option value="Critical">긴급</option>
                <option value="High">높음</option>
                <option value="Medium">중간</option>
                <option value="Low">낮음</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table - Scrollable area */}
        <div className="flex-1 overflow-auto p-6 bg-surface-container-low">
          <DataTable
            columns={columns}
            data={filteredCases}
            keyExtractor={(item) => item.id}
            onEdit={(item) => {
              setSelectedTestCaseId(item.id)
              setIsSidebarOpen(true)
            }}
            onDelete={(item) => {
              deleteTestCase(item.id)
              setNotification({
                type: 'success',
                message: '테스트 케이스가 삭제되었습니다.',
              })
            }}
            onDuplicate={(item) => {
              const newCase = {
                ...item,
                id: `tc-${Date.now()}`,
                title: `${item.title} (복제)`,
                createdAt: new Date().toISOString().split('T')[0],
                updatedAt: new Date().toISOString().split('T')[0],
              }
              addTestCase(newCase)
              setNotification({
                type: 'success',
                message: '테스트 케이스가 복제되었습니다.',
              })
            }}
          />
        </div>
      </div>

      {/* Sidebar */}
      <TestCaseDetailSidebar
        testCase={selectedTestCaseId ? getTestCaseById(selectedTestCaseId) : undefined}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onEdit={() => setIsEditModalOpen(true)}
      />

      {/* Edit Modal */}
      <TestCaseEditModal
        testCase={selectedTestCaseId ? getTestCaseById(selectedTestCaseId) : undefined}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(updatedCase) => {
          updateTestCase(updatedCase.id, updatedCase)
          setNotification({
            type: 'success',
            message: '테스트 케이스가 저장되었습니다.',
          })
          setIsEditModalOpen(false)
        }}
      />
    </div>
  )
}
