// src/pages/Subscriptions.tsx
import { useState } from 'react'
import { useSubscriptions } from '../hooks/useSubscriptions'
import SubscriptionCard from '../components/SubscriptionCard'
import AddSubscriptionModal from '../components/AddSubscriptionModal'
import { Plus, Search, Filter } from 'lucide-react'
import type { SubStatus } from '../types'

export default function Subscriptions() {
    const { subscriptions, loading, create, update, remove } = useSubscriptions()
    const [showModal,  setShowModal]  = useState(false)
    const [search,     setSearch]     = useState('')
    const [filter,     setFilter]     = useState<SubStatus | 'all'>('all')
    const [editItem,   setEditItem]   = useState<number | null>(null)

    // Filter and search
    const filtered = subscriptions.filter(sub => {
        const matchSearch = sub.name.toLowerCase().includes(search.toLowerCase())
        const matchFilter = filter === 'all' || sub.status === filter
        return matchSearch && matchFilter
    })

    return (
        <div className="subs-page">
            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">Subscriptions</h1>
                <button
                    className="btn-primary"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={16} /> Add New
                </button>
            </div>

            {/* Search + Filter */}
            <div className="toolbar">
                <div className="search-box">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search subscriptions..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filter-tabs">
                    {(['all', 'active', 'paused', 'cancelled'] as const).map(f => (
                        <button
                            key={f}
                            className={`filter-tab ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="cards-grid">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="sub-card loading-shimmer" />
                    ))}
                </div>
            )}

            {/* Subscription Cards */}
            {!loading && (
                <div className="cards-grid">
                    {filtered.map(sub => (
                        <SubscriptionCard
                            key={sub.id}
                            subscription={sub}
                            onEdit={() => setEditItem(sub.id)}
                            onDelete={() => remove(sub.id, sub.name)}
                            onStatusChange={(status) => update(sub.id, { status })}
                        />
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
                <div className="empty-state">
                    <p>No subscriptions found.</p>
                    <button
                        className="btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        Add your first subscription
                    </button>
                </div>
            )}

            {/* Add Modal */}
            {showModal && (
                <AddSubscriptionModal
                    onClose={() => setShowModal(false)}
                    onSave={async (data) => {
                        await create(data)
                        setShowModal(false)
                    }}
                />
            )}
        </div>
    )
}