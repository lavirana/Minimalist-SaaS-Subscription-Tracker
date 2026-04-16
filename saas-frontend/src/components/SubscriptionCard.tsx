import {
    formatCurrency,
    getRenewalLabel,
    getRenewalColor,
    getCycleLabel
} from '../utils/helpers'
import { Pencil, Trash2, Globe, MoreVertical } from 'lucide-react'
import type { Subscription, Currency, SubStatus } from '../types'
import { useState } from 'react'

interface Props {
    subscription:   Subscription
    onEdit:         () => void
    onDelete:       () => void
    onStatusChange: (status: SubStatus) => void
}

export default function SubscriptionCard({
    subscription: sub,
    onEdit,
    onDelete,
    onStatusChange,
}: Props) {
    const [showMenu, setShowMenu] = useState(false)
    const daysColor = getRenewalColor(sub.days_until_renewal)

    return (
        <div
            className={`sub-card ${sub.status !== 'active' ? 'sub-card-inactive' : ''}`}
            style={{ borderTopColor: sub.color ?? '#6366f1' }}
        >
            {/* Card Header */}
            <div className="card-header">
                <div className="service-info">
                    <div
                        className="service-logo"
                        style={{ background: sub.color ?? '#6366f1' }}
                    >
                        {sub.logo ?? sub.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="service-name">{sub.name}</h3>
                        {sub.category != null && (
                            <span
                                className="category-badge"
                                style={{
                                    background: sub.category.color + '20',
                                    color:      sub.category.color,
                                }}
                            >
                                {sub.category.icon ?? ''} {sub.category.name}
                            </span>
                        )}
                    </div>
                </div>

                {/* Menu */}
                <div className="card-menu">
                    <button
                        className="btn-icon"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <MoreVertical size={16} />
                    </button>

                    {showMenu && (
                        <div className="dropdown">
                            <button
                                onClick={() => {
                                    onEdit()
                                    setShowMenu(false)
                                }}
                            >
                                <Pencil size={14} /> Edit
                            </button>

                            <button
                                onClick={() => {
                                    onStatusChange(
                                        sub.status === 'active' ? 'paused' : 'active'
                                    )
                                    setShowMenu(false)
                                }}
                            >
                                {sub.status === 'active' ? '⏸ Pause' : '▶️ Activate'}
                            </button>

                            <button
                                className="danger"
                                onClick={() => {
                                    onDelete()
                                    setShowMenu(false)
                                }}
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Price */}
            <div className="price-section">
                <span className="price">
                    {formatCurrency(sub.price, sub.currency as Currency)}
                </span>
                <span className="cycle">
                    / {getCycleLabel(sub.billing_cycle)}
                </span>
            </div>

            {/* Monthly equivalent */}
            {sub.billing_cycle !== 'monthly' && (
                <p className="monthly-equiv">
                    ≈ {formatCurrency(
                        sub.monthly_equivalent,
                        sub.currency as Currency
                    )}/month
                </p>
            )}

            {/* Renewal */}
            <div className="renewal-section" style={{ color: daysColor }}>
                <span>🔄</span>
                <span>{getRenewalLabel(sub.days_until_renewal)}</span>
            </div>

            {/* Status */}
            <div className={`status-badge status-${sub.status}`}>
                {sub.status}
            </div>

            {/* Website link — only show if website is not null */}
            {sub.website != null && sub.website.length > 0 && (
                
                  <a href={sub.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="website-link"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Globe size={12} /> Visit
                </a>
            )}
        </div>
    )
}