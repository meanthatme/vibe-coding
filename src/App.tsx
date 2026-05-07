import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import TestCaseListPage from './pages/TestCaseListPage'
import TestCaseDetailPage from './pages/TestCaseDetailPage'
import TestPlanListPage from './pages/TestPlanListPage'
import TestPlanDetailPage from './pages/TestPlanDetailPage'
import TestRunListPage from './pages/TestRunListPage'
import TestRunDetailPage from './pages/TestRunDetailPage'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="test-cases" element={<TestCaseListPage />} />
          <Route path="test-cases/new" element={<TestCaseDetailPage />} />
          <Route path="test-cases/:id" element={<TestCaseDetailPage />} />
          <Route path="test-plans" element={<TestPlanListPage />} />
          <Route path="test-plans/new" element={<TestPlanDetailPage />} />
          <Route path="test-plans/:id" element={<TestPlanDetailPage />} />
          <Route path="test-runs" element={<TestRunListPage />} />
          <Route path="test-runs/new" element={<TestRunDetailPage />} />
          <Route path="test-runs/:id" element={<TestRunDetailPage />} />
        </Route>
      </Routes>
    </Router>
  )
}
