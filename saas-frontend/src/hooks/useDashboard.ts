// src/hooks/useDashboard.ts
import { useState, useEffect } from 'react'
import { dashboardApi } from '../services/api'
import type { DashboardStats } from '../types'

export function useDashboard() {
    const [stats,   setStats]   = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        dashboardApi.getStats()
            .then(setStats)
            .finally(() => setLoading(false))
    }, [])

    return { stats, loading }
}