// src/services/api.ts
import axios, { AxiosError } from 'axios'
import type {
    AuthResponse, Subscription, SubscriptionFormData,
    Category, DashboardStats, User
} from '../types'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: { 'Content-Type': 'application/json' },
})

// Add token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// Handle 401 globally
api.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// ─── Auth ────────────────────────────────────────────────
export const authApi = {
    register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
        api.post<AuthResponse>('/register', data).then(r => r.data),

    login: (data: { email: string; password: string }) =>
        api.post<AuthResponse>('/login', data).then(r => r.data),

    logout: () =>
        api.post('/logout').then(r => r.data),

    me: () =>
        api.get<User>('/me').then(r => r.data),
}

// ─── Dashboard ───────────────────────────────────────────
export const dashboardApi = {
    getStats: () =>
        api.get<DashboardStats>('/dashboard').then(r => r.data),
}

// ─── Subscriptions ───────────────────────────────────────
export const subscriptionApi = {
    getAll: (params?: { status?: string; category_id?: number }) =>
        api.get<Subscription[]>('/subscriptions', { params }).then(r => r.data),

    getOne: (id: number) =>
        api.get<Subscription>(`/subscriptions/${id}`).then(r => r.data),

    create: (data: SubscriptionFormData) =>
        api.post<Subscription>('/subscriptions', data).then(r => r.data),

    update: (id: number, data: Partial<SubscriptionFormData>) =>
        api.put<Subscription>(`/subscriptions/${id}`, data).then(r => r.data),

    delete: (id: number) =>
        api.delete(`/subscriptions/${id}`).then(r => r.data),
}

// ─── Categories ──────────────────────────────────────────
export const categoryApi = {
    getAll: () =>
        api.get<Category[]>('/categories').then(r => r.data),

    create: (data: { name: string; color: string; icon?: string }) =>
        api.post<Category>('/categories', data).then(r => r.data),

    update: (id: number, data: Partial<{ name: string; color: string; icon: string }>) =>
        api.put<Category>(`/categories/${id}`, data).then(r => r.data),

    delete: (id: number) =>
        api.delete(`/categories/${id}`).then(r => r.data),
}

export default api