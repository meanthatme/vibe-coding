import { ReactNode, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface DropdownProps {
  trigger: ReactNode
  items: { label: string; icon?: ReactNode; onClick: () => void; danger?: boolean }[]
  align?: 'left' | 'right'
}

export default function Dropdown({ trigger, items, align = 'right' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-surface-container"
      >
        {trigger}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-1 min-w-48 rounded-lg border border-outline-variant bg-surface-default shadow-elevation-3 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick()
                setIsOpen(false)
              }}
              className={`flex w-full items-center gap-2 px-4 py-2 text-body-medium transition-colors ${
                item.danger
                  ? 'text-status-failed hover:bg-status-failed-bg'
                  : 'text-on-surface hover:bg-surface-container'
              } ${index === 0 ? 'rounded-t-lg' : ''} ${
                index === items.length - 1 ? 'rounded-b-lg' : ''
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
