import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  GraduationCap,
  ClipboardCheck,
  BarChart3,
  Menu,
  X,
  Play,
} from 'lucide-react'

const menuItems = [
  { icon: BarChart3, label: '대시보드', href: '/dashboard' },
  { icon: ClipboardCheck, label: '테스트 케이스', href: '/test-cases' },
  { icon: GraduationCap, label: '테스트 플랜', href: '/test-plans' },
  { icon: Play, label: '테스트 실행', href: '/test-runs' },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()

  const isActive = (href: string) => location.pathname.startsWith(href)

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 top-4 z-50 rounded-md bg-primary-500 p-2 text-white md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } relative flex-shrink-0 w-64 h-full bg-surface-default shadow-elevation-1 transform transition-transform duration-300 md:relative md:translate-x-0 overflow-y-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          {/* <div className="flex items-center gap-3 border-b border-outline-variant px-6 py-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500">
              <span className="text-xl font-bold text-white">Q</span>
            </div>
            <h1 className="text-xl font-bold text-on-surface">Qrit</h1>
          </div> */}

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-md px-4 py-3 text-body-medium transition-colors ${
                    active
                      ? 'bg-primary-500 text-white'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-outline-variant px-4 py-4">
            <p className="text-label-medium text-on-surface-variant">
              v1.0.0
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
