import { MoreVertical, Trash2, Edit, Copy } from 'lucide-react'
import { useState } from 'react'

interface DataTableProps<T> {
  columns: {
    key: keyof T
    label: string
    render?: (value: any, row: T) => React.ReactNode
    width?: string
  }[]
  data: T[]
  keyExtractor: (item: T) => string
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onDuplicate?: (item: T) => void
  isLoading?: boolean
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onEdit,
  onDelete,
  onDuplicate,
  isLoading = false,
}: DataTableProps<T>) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-outline-variant border-t-primary-500" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-body-medium text-on-surface-variant">
          데이터가 없습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-outline-variant shadow-elevation-1">
      <table className="w-full">
        <thead className="bg-surface-container">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{ width: col.width }}
                className="px-4 py-3 text-left text-label-large font-medium text-on-surface"
              >
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-center text-label-large font-medium text-on-surface">
              작업
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const id = keyExtractor(item)
            return (
              <tr
                key={id}
                className={`border-t border-outline-variant hover:bg-surface-container transition-colors ${
                  index % 2 === 1 ? 'bg-surface-default' : 'bg-white'
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-4 py-3 text-body-medium text-on-surface"
                  >
                    {col.render
                      ? col.render((item as any)[col.key], item)
                      : (item as any)[col.key]}
                  </td>
                ))}
                <td className="relative px-4 py-3 text-center">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === id ? null : id)
                    }
                    className="rounded-full p-1 hover:bg-surface-container"
                  >
                    <MoreVertical size={18} className="text-on-surface-variant" />
                  </button>

                  {openMenuId === id && (
                    <div className="absolute right-0 top-full z-10 mt-1 min-w-40 rounded-lg border border-outline-variant bg-surface-default shadow-elevation-3">
                      {onEdit && (
                        <button
                          onClick={() => {
                            onEdit(item)
                            setOpenMenuId(null)
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-body-medium text-on-surface hover:bg-surface-container rounded-t-lg transition-colors"
                        >
                          <Edit size={16} />
                          편집
                        </button>
                      )}
                      {onDuplicate && (
                        <button
                          onClick={() => {
                            onDuplicate(item)
                            setOpenMenuId(null)
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-body-medium text-on-surface hover:bg-surface-container transition-colors"
                        >
                          <Copy size={16} />
                          복제
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => {
                            onDelete(item)
                            setOpenMenuId(null)
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-body-medium text-status-failed hover:bg-status-failed-bg rounded-b-lg transition-colors"
                        >
                          <Trash2 size={16} />
                          삭제
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
