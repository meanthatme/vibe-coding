import React, { useState } from 'react'
import { Folder, FolderPlus, MoreVertical, Edit2, Trash2, ChevronRight, ChevronDown, Plus } from 'lucide-react'
import { useAppStore } from '../store'
import { TestSuite } from '../types'
import Dropdown from './Dropdown'

interface SuiteSidebarProps {
  selectedSuiteId: string | null
  onSelectSuite: (id: string | null) => void
}

const SuiteItem: React.FC<{
  suite: TestSuite
  level: number
  selectedSuiteId: string | null
  onSelectSuite: (id: string | null) => void
  onAddSubSuite: (parentId: string) => void
  onEditSuite: (suite: TestSuite) => void
  onDeleteSuite: (id: string) => void
}> = ({ suite, level, selectedSuiteId, onSelectSuite, onAddSubSuite, onEditSuite, onDeleteSuite }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const { testSuites } = useAppStore()
  
  const children = testSuites.filter(s => s.parentId === suite.id)
  const hasChildren = children.length > 0
  const isSelected = selectedSuiteId === suite.id

  return (
    <div className="select-none">
      <div 
        className={`group flex items-center gap-1 py-1.5 px-2 rounded-md cursor-pointer transition-colors ${
          isSelected ? 'bg-primary-100 text-primary-700' : 'hover:bg-surface-variant text-on-surface'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => onSelectSuite(suite.id)}
      >
        <div 
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
          className="p-0.5 hover:bg-black/5 rounded"
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          ) : (
            <div className="w-4" />
          )}
        </div>
        
        <Folder size={18} className={isSelected ? 'text-primary-500' : 'text-on-surface-variant'} />
        
        <span className="flex-1 truncate text-body-medium font-medium">
          {suite.name}
        </span>
        
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5">
          <button 
            onClick={(e) => {
              e.stopPropagation()
              onAddSubSuite(suite.id)
            }}
            className="p-1 hover:bg-black/5 rounded text-on-surface-variant hover:text-primary-500"
            title="하위 스위트 추가"
          >
            <Plus size={14} />
          </button>
          
          <Dropdown
            trigger={
              <button className="p-1 hover:bg-black/5 rounded text-on-surface-variant">
                <MoreVertical size={14} />
              </button>
            }
            items={[
              {
                label: '편집',
                icon: <Edit2 size={14} />,
                onClick: () => onEditSuite(suite),
              },
              {
                label: '삭제',
                icon: <Trash2 size={14} />,
                className: 'text-error-500',
                onClick: () => onDeleteSuite(suite.id),
              },
            ]}
          />
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="mt-0.5">
          {children.sort((a, b) => a.order - b.order).map(child => (
            <SuiteItem 
              key={child.id}
              suite={child}
              level={level + 1}
              selectedSuiteId={selectedSuiteId}
              onSelectSuite={onSelectSuite}
              onAddSubSuite={onAddSubSuite}
              onEditSuite={onEditSuite}
              onDeleteSuite={onDeleteSuite}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function SuiteSidebar({ selectedSuiteId, onSelectSuite }: SuiteSidebarProps) {
  const { testSuites, addTestSuite, updateTestSuite, deleteTestSuite, setNotification } = useAppStore()
  
  const rootSuites = testSuites.filter(s => !s.parentId).sort((a, b) => a.order - b.order)
  
  const handleAddSuite = (parentId?: string) => {
    const name = prompt('새 테스트 스위트 이름을 입력하세요:')
    if (name) {
      const newSuite: TestSuite = {
        id: `suite-${Date.now()}`,
        name,
        parentId,
        order: testSuites.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      addTestSuite(newSuite)
      setNotification({
        type: 'success',
        message: '테스트 스위트가 생성되었습니다.',
      })
    }
  }
  
  const handleEditSuite = (suite: TestSuite) => {
    const name = prompt('테스트 스위트 이름을 수정하세요:', suite.name)
    if (name && name !== suite.name) {
      updateTestSuite(suite.id, { 
        name, 
        updatedAt: new Date().toISOString() 
      })
      setNotification({
        type: 'success',
        message: '테스트 스위트가 수정되었습니다.',
      })
    }
  }
  
  const handleDeleteSuite = (id: string) => {
    if (confirm('이 테스트 스위트를 삭제하시겠습니까? 하위 스위트도 모두 영향을 받을 수 있습니다.')) {
      deleteTestSuite(id)
      if (selectedSuiteId === id) {
        onSelectSuite(null)
      }
      setNotification({
        type: 'success',
        message: '테스트 스위트가 삭제되었습니다.',
      })
    }
  }

  return (
    <div className="w-64 flex flex-col h-full bg-surface-default border-r border-outline-variant">
      <div className="p-4 flex items-center justify-between border-b border-outline-variant">
        <h2 className="text-title-medium font-bold text-on-surface">Suites</h2>
        <button 
          onClick={() => handleAddSuite()}
          className="p-1.5 hover:bg-surface-variant rounded-md text-primary-500 transition-colors"
          title="최상위 스위트 추가"
        >
          <FolderPlus size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div 
          className={`flex items-center gap-2 py-2 px-3 rounded-md cursor-pointer transition-colors ${
            selectedSuiteId === null ? 'bg-primary-100 text-primary-700' : 'hover:bg-surface-variant text-on-surface'
          }`}
          onClick={() => onSelectSuite(null)}
        >
          <span className="text-body-medium font-medium">전체 테스트 케이스</span>
        </div>
        
        <div className="pt-2">
          {rootSuites.map(suite => (
            <SuiteItem 
              key={suite.id}
              suite={suite}
              level={0}
              selectedSuiteId={selectedSuiteId}
              onSelectSuite={onSelectSuite}
              onAddSubSuite={handleAddSuite}
              onEditSuite={handleEditSuite}
              onDeleteSuite={handleDeleteSuite}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
