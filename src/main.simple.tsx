import React from 'react'
import ReactDOM from 'react-dom/client'

const App = () => {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Qrit - 테스트 관리 도구</h1>
      <p>✅ 프론트엔드가 정상 실행 중입니다!</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
