// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '../services/api'
import type { User } from '../types'

interface AuthContextType {
    user:     User | null
    token:    string | null
    loading:  boolean
    login:    (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout:   () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user,    setUser]    = useState<User | null>(null)
    const [token,   setToken]   = useState<string | null>(
        localStorage.getItem('token')
    )
    const [loading, setLoading] = useState(true)

    // Check token on mount
    useEffect(() => {
        if (token) {
            authApi.me()
                .then(setUser)
                .catch(() => {
                    setToken(null)
                    localStorage.removeItem('token')
                })
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    const login = async (email: string, password: string) => {
        const data = await authApi.login({ email, password })
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('token', data.token)
    }

    const register = async (name: string, email: string, password: string) => {
        const data = await authApi.register({
            name, email,
            password,
            password_confirmation: password
        })
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('token', data.token)
    }

    const logout = async () => {
        await authApi.logout()
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be inside AuthProvider')
    return ctx
}