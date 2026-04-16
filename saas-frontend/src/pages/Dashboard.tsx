// src/pages/Dashboard.tsx
import { useDashboard } from '../hooks/useDashboard'
import { formatCurrency, getRenewalLabel, getRenewalColor, formatDate } from '../utils/helpers'
import { TrendingUp, CreditCard, AlertTriangle, Calendar, Star } from 'lucide-react'
import type { Currency } from '../types'

export default function Dashboard() {
    const { stats, loading } = useDashboard()

    if (loading) return <LoadingDashboard />
    if (!stats)  return <div>Failed to load</div>

    return (
        <div className="dashboard-page">
            <h1 className="page-title">Dashboard</h1>

            {/* Bento Grid */}
            <div className="bento-grid">

                {/* Total Monthly Spend — Large card */}
                <div className="bento-card bento-large bg-gradient-purple">
                    <div className="bento-icon"><TrendingUp size={24} /></div>
                    <p className="bento-label">Monthly Spend</p>
                    <h2 className="bento-value">
                        {formatCurrency(stats.monthly_total, 'INR' as Currency)}
                    </h2>
                    <p className="bento-sub">
                        {formatCurrency(stats.yearly_total, 'INR' as Currency)} / year
                    </p>
                </div>

                {/* Active Subscriptions */}
                <div className="bento-card bg-gradient-blue">
                    <div className="bento-icon"><CreditCard size={20} /></div>
                    <p className="bento-label">Active</p>
                    <h2 className="bento-value">{stats.active_count}</h2>
                    <p className="bento-sub">subscriptions</p>
                </div>

                {/* Overdue */}
                <div className={`bento-card ${stats.overdue.length > 0 ? 'bg-gradient-red' : 'bg-gradient-green'}`}>
                    <div className="bento-icon"><AlertTriangle size={20} /></div>
                    <p className="bento-label">Overdue</p>
                    <h2 className="bento-value">{stats.overdue.length}</h2>
                    <p className="bento-sub">need attention</p>
                </div>

                {/* Most Expensive */}
                {stats.most_expensive && (
                    <div className="bento-card bg-gradient-orange">
                        <div className="bento-icon"><Star size={20} /></div>
                        <p className="bento-label">Most Expensive</p>
                        <h2 className="bento-value-sm">{stats.most_expensive.name}</h2>
                        <p className="bento-sub">
                            {formatCurrency(stats.most_expensive.monthly_equivalent, 'INR' as Currency)}/mo
                        </p>
                    </div>
                )}

                {/* Upcoming Renewals */}
                <div className="bento-card bento-wide">
                    <div className="bento-header">
                        <Calendar size={18} />
                        <p className="bento-label">Upcoming Renewals</p>
                    </div>
                    {stats.upcoming.length === 0 ? (
                        <p className="empty-text">No renewals in next 7 days ✅</p>
                    ) : (
                        <div className="renewal-list">
                            {stats.upcoming.map(sub => (
                                <div key={sub.id} className="renewal-item">
                                    <div className="renewal-left">
                                        <div
                                            className="renewal-dot"
                                            style={{ background: sub.color || '#6366f1' }}
                                        />
                                        <span className="renewal-name">{sub.name}</span>
                                    </div>
                                    <div className="renewal-right">
                                        <span
                                            className="renewal-days"
                                            style={{ color: getRenewalColor(sub.days_until_renewal) }}
                                        >
                                            {getRenewalLabel(sub.days_until_renewal)}
                                        </span>
                                        <span className="renewal-amount">
                                            {formatCurrency(sub.price, sub.currency as Currency)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Spend by Category */}
                <div className="bento-card bento-wide">
                    <p className="bento-label">Spend by Category</p>
                    <div className="category-list">
                        {stats.by_category.map((cat, i) => {
                            const maxTotal = Math.max(...stats.by_category.map(c => c.total))
                            const percent  = (cat.total / maxTotal) * 100
                            return (
                                <div key={i} className="category-row">
                                    <div className="category-info">
                                        <div
                                            className="category-dot"
                                            style={{ background: cat.color }}
                                        />
                                        <span>{cat.category}</span>
                                        <span className="category-count">({cat.count})</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width:      `${percent}%`,
                                                background: cat.color
                                            }}
                                        />
                                    </div>
                                    <span className="category-amount">
                                        {formatCurrency(cat.total, 'INR' as Currency)}/mo
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}

function LoadingDashboard() {
    return (
        <div className="dashboard-page">
            <h1 className="page-title">Dashboard</h1>
            <div className="bento-grid">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="bento-card loading-shimmer" />
                ))}
            </div>
        </div>
    )
}