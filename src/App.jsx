import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Login from './components/Auth/Login'
import BoardView from './components/BoardView'
import NodeFormModal from './components/Modals/NodeFormModal'
import UploadModal from './components/Modals/UploadModal'
import { useAuthStore } from './stores/authStore'

function ProtectedRoute({ children }) {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/board/:boardId"
          element={
            <ProtectedRoute>
              <Layout>
                <BoardView />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/board/demo" replace />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Global Modals */}
      <NodeFormModal />
      <UploadModal />
    </Router>
  )
}

export default App
