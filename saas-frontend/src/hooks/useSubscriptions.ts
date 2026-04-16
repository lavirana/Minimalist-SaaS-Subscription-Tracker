// src/hooks/useSubscriptions.ts
import { useState, useEffect, useCallback } from 'react'
import { subscriptionApi } from '../services/api'
import type { Subscription, SubscriptionFormData } from '../types'
import toast from 'react-hot-toast'

export function useSubscriptions() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState<string | null>(null)

    const fetchAll = useCallback(async () => {
        try {
            setLoading(true)
            const data = await subscriptionApi.getAll()
            setSubscriptions(data)
        } catch (err) {
            setError('Failed to load subscriptions')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchAll() }, [fetchAll])

    const create = async (data: SubscriptionFormData) => {
        const newSub = await subscriptionApi.create(data)
        setSubscriptions(prev => [...prev, newSub])
        toast.success(`${newSub.name} added!`)
        return newSub
    }

    const update = async (id: number, data: Partial<SubscriptionFormData>) => {
        const updated = await subscriptionApi.update(id, data)
        setSubscriptions(prev => prev.map(s => s.id === id ? updated : s))
        toast.success('Updated successfully!')
        return updated
    }

    const remove = async (id: number, name: string) => {
        await subscriptionApi.delete(id)
        setSubscriptions(prev => prev.filter(s => s.id !== id))
        toast.success(`${name} removed!`)
    }

    return { subscriptions, loading, error, refetch: fetchAll, create, update, remove }
}