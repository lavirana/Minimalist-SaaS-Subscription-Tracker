// src/components/AddSubscriptionModal.tsx
import { useState } from 'react'
import type { SubscriptionFormData, BillingCycle, Currency, SubStatus } from '../types'
import { POPULAR_SERVICES } from '../utils/helpers'
import { X } from 'lucide-react'

interface Props {
    onClose: () => void
    onSave:  (data: SubscriptionFormData) => Promise<void>
    initial?: Partial<SubscriptionFormData>
}

const DEFAULT_FORM: SubscriptionFormData = {
    name:          '',
    description:   '',
    price:         0,
    currency:      'INR',
    billing_cycle: 'monthly',
    renewal_date:  new Date().toISOString().split('T')[0],
    start_date:    new Date().toISOString().split('T')[0],
    status:        'active',
    category_id:   null,
    website:       '',
    color:         '#6366f1',
    notes:         '',
    reminder:      true,
    reminder_days: 3,
}

export default function AddSubscriptionModal({ onClose, onSave, initial }: Props) {
    const [form,   setForm]   = useState<SubscriptionFormData>({ ...DEFAULT_FORM, ...initial })
    const [saving, setSaving] = useState(false)

    const set = (key: keyof SubscriptionFormData, value: unknown) =>
        setForm(prev => ({ ...prev, [key]: value }))

    const handleQuickSelect = (name: string) => {
        const service = POPULAR_SERVICES[name]
        if (service) {
            setForm(prev => ({ ...prev, name, color: service.color, logo: service.logo }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            await onSave(form)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="modal-header">
                    <h2>Add Subscription</h2>
                    <button className="btn-icon" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Quick Select Popular Services */}
                <div className="quick-services">
                    <p className="quick-label">Quick add:</p>
                    <div className="quick-buttons">
                        {Object.entries(POPULAR_SERVICES).slice(0, 6).map(([name, s]) => (
                            <button
                                key={name}
                                className="quick-btn"
                                style={{ borderColor: s.color }}
                                onClick={() => handleQuickSelect(name)}
                                type="button"
                            >
                                {s.logo} {name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="modal-form">
                    {/* Name */}
                    <div className="form-group">
                        <label>Service Name *</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => set('name', e.target.value)}
                            placeholder="Netflix, Spotify..."
                            required
                        />
                    </div>

                    {/* Price + Currency */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Price *</label>
                            <input
                                type="number"
                                value={form.price}
                                onChange={e => set('price', parseFloat(e.target.value))}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Currency</label>
                            <select
                                value={form.currency}
                                onChange={e => set('currency', e.target.value as Currency)}
                            >
                                <option value="INR">₹ INR</option>
                                <option value="USD">$ USD</option>
                                <option value="EUR">€ EUR</option>
                                <option value="GBP">£ GBP</option>
                            </select>
                        </div>
                    </div>

                    {/* Billing Cycle */}
                    <div className="form-group">
                        <label>Billing Cycle</label>
                        <div className="cycle-buttons">
                            {(['weekly', 'monthly', 'yearly'] as BillingCycle[]).map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`cycle-btn ${form.billing_cycle === c ? 'active' : ''}`}
                                    onClick={() => set('billing_cycle', c)}
                                >
                                    {c.charAt(0).toUpperCase() + c.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Renewal Date *</label>
                            <input
                                type="date"
                                value={form.renewal_date}
                                onChange={e => set('renewal_date', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Start Date *</label>
                            <input
                                type="date"
                                value={form.start_date}
                                onChange={e => set('start_date', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Color */}
                    <div className="form-group">
                        <label>Brand Color</label>
                        <div className="color-row">
                            <input
                                type="color"
                                value={form.color}
                                onChange={e => set('color', e.target.value)}
                                className="color-picker"
                            />
                            <span>{form.color}</span>
                        </div>
                    </div>

                    {/* Website */}
                    <div className="form-group">
                        <label>Website</label>
                        <input
                            type="url"
                            value={form.website}
                            onChange={e => set('website', e.target.value)}
                            placeholder="https://netflix.com"
                        />
                    </div>

                    {/* Notes */}
                    <div className="form-group">
                        <label>Notes</label>
                        <textarea
                            value={form.notes}
                            onChange={e => set('notes', e.target.value)}
                            placeholder="Plan details, account info..."
                            rows={2}
                        />
                    </div>

                    {/* Reminder */}
                    <div className="form-group form-inline">
                        <label>
                            <input
                                type="checkbox"
                                checked={form.reminder}
                                onChange={e => set('reminder', e.target.checked)}
                            />
                            Remind me
                        </label>
                        {form.reminder && (
                            <div className="reminder-days">
                                <input
                                    type="number"
                                    value={form.reminder_days}
                                    onChange={e => set('reminder_days', parseInt(e.target.value))}
                                    min={1}
                                    max={30}
                                    className="small-input"
                                />
                                <span>days before</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : 'Add Subscription'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}