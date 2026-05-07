import { useEffect } from 'react'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'
import { useAppStore } from '../store'

export default function Notification() {
  const notification = useAppStore((state) => state.notification)
  const setNotification = useAppStore((state) => state.setNotification)

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [notification, setNotification])

  if (!notification) return null

  const icons = {
    success: <CheckCircle size={20} className="text-status-passed" />,
    error: <AlertCircle size={20} className="text-status-failed" />,
    info: <Info size={20} className="text-status-in-progress" />,
  }

  const bgColors = {
    success: 'bg-status-passed-bg border-status-passed',
    error: 'bg-status-failed-bg border-status-failed',
    info: 'bg-status-in-progress-bg border-status-in-progress',
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-elevation-3 ${bgColors[notification.type]}`}
      >
        {icons[notification.type]}
        <p className="text-body-medium text-on-surface">{notification.message}</p>
        <button onClick={() => setNotification(null)} className="ml-2">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
