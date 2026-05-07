interface StatusBadgeProps {
  status: string
  type?: 'status' | 'priority'
}

const statusConfig: Record<string, { bg: string; text: string; icon: string }> = {
  // Status
  'Active': { bg: 'bg-green-100', text: 'text-green-700', icon: '✓' },
  'Draft': { bg: 'bg-gray-100', text: 'text-gray-700', icon: '○' },
  'Deprecated': { bg: 'bg-red-100', text: 'text-red-700', icon: '✕' },

  // Test Results
  'Passed': { bg: 'bg-status-passed-bg', text: 'text-status-passed', icon: '✓' },
  'Failed': { bg: 'bg-status-failed-bg', text: 'text-status-failed', icon: '✕' },
  'Blocked': { bg: 'bg-status-blocked-bg', text: 'text-status-blocked', icon: '⊗' },
  'Skipped': { bg: 'bg-status-skipped-bg', text: 'text-status-skipped', icon: '⊖' },
  'InProgress': {
    bg: 'bg-status-in-progress-bg',
    text: 'text-status-in-progress',
    icon: '⟳',
  },

  // Priority
  'Critical': { bg: 'bg-red-100', text: 'text-priority-critical', icon: '!' },
  'High': { bg: 'bg-orange-100', text: 'text-priority-high', icon: '↑' },
  'Medium': { bg: 'bg-yellow-100', text: 'text-priority-medium', icon: '→' },
  'Low': { bg: 'bg-green-100', text: 'text-priority-low', icon: '↓' },
}

export default function StatusBadge({ status, type = 'status' }: StatusBadgeProps) {
  const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: '•' }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm px-2 py-1 text-label-medium font-medium ${config.bg} ${config.text}`}
    >
      <span>{config.icon}</span>
      {status}
    </span>
  )
}
