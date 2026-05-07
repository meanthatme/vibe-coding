import { Bell, Settings, LogOut } from 'lucide-react'
import { useAppStore } from '../store'
import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const currentUser = useAppStore((state) => state.currentUser)
  const location = useLocation()

  const navItems = [
    { label: '워크스페이스', href: '#' },
    { label: '프로젝트', href: '#' },
    { label: '대시보드', href: '/dashboard' },
  ]

  return (
    <header className="w-full bg-primary-700 shadow-elevation-2">
      {/* Top Bar */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-primary-600">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
            <span className="text-lg font-bold text-primary-700">Q</span>
          </div>
          <h1 className="text-xl font-bold text-white">Qrit</h1>
        </div>

        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative rounded-full p-2 hover:bg-primary-600 transition-colors">
            <Bell size={20} className="text-white" />
            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-status-failed" />
          </button>

          {/* Settings */}
          <button className="rounded-full p-2 hover:bg-primary-600 transition-colors">
            <Settings size={20} className="text-white" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-6 border-l border-primary-600">
            <div className="flex flex-col items-end gap-1">
              <p className="text-body-medium font-medium text-white">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-label-small text-primary-200">
                {currentUser?.role === 'qa' && 'QA 엔지니어'}
                {currentUser?.role === 'lead' && '팀 리드'}
                {currentUser?.role === 'developer' && '개발자'}
                {currentUser?.role === 'admin' && '관리자'}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-body-medium font-bold text-primary-700">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
          </div>

          {/* Logout */}
          <button className="rounded-full p-2 hover:bg-primary-600 transition-colors">
            <LogOut size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="px-6 py-2 flex items-center gap-8">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-body-medium text-primary-100 hover:text-white transition-colors pb-2 border-b-2 border-transparent hover:border-white"
          >
            {item.label}
          </a>
        ))}
      </div>
    </header>
  )
}
