// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Subscriptions from './pages/Subscriptions'
import Login from './pages/Login'
import Register from './pages/Register'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    if (loading) return <div className="loading-screen">Loading...</div>
    if (!user)   return <Navigate to="/login" replace />
    return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    if (loading) return <div className="loading-screen">Loading...</div>
    if (user)    return <Navigate to="/" replace />
    return <>{children}</>
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/" element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            }>
                <Route index          element={<Dashboard />} />
                <Route path="subs"    element={<Subscriptions />} />
            </Route>
        </Routes>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#1e293b',
                            color: '#e2e8f0',
                            border: '1px solid #334155',
                        }
                    }}
                />
            </BrowserRouter>
        </AuthProvider>
    )
}