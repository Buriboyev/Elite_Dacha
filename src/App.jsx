import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme.jsx'
import { getAppBasePath } from './lib/runtimeBase.js'
import HomePage from './pages/HomePage.jsx'
import ReservationPage from './pages/ReservationPage.jsx'

const AdminPage = lazy(() => import('./pages/AdminPage.jsx'))

function RequireAdminAuth({ children }) {
  const isAuthorized = sessionStorage.getItem('adminAuth') === 'granted'
  return isAuthorized ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={getAppBasePath()}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route
              path="/admin"
              element={
                <RequireAdminAuth>
                  <AdminPage />
                </RequireAdminAuth>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  )
}
