// src/utils/helpers.ts
import { format, differenceInDays, isPast, addMonths, addYears, addWeeks } from 'date-fns'
import type { BillingCycle, Currency } from '../types'

// Format currency
export function formatCurrency(amount: number, currency: Currency = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
        style:    'currency',
        currency: currency,
        maximumFractionDigits: 0,
    }).format(amount)
}

// Days until renewal
export function getDaysUntilRenewal(renewalDate: string): number {
    return differenceInDays(new Date(renewalDate), new Date())
}

// Renewal status label
export function getRenewalLabel(days: number): string {
    if (days < 0)  return 'Overdue!'
    if (days === 0) return 'Due Today!'
    if (days === 1) return 'Due Tomorrow!'
    if (days <= 7)  return `${days} days left`
    if (days <= 30) return `${days} days left`
    return format(new Date(Date.now() + days * 86400000), 'MMM dd, yyyy')
}

// Renewal status color
export function getRenewalColor(days: number): string {
    if (days < 0)  return '#ef4444'  // red — overdue
    if (days <= 3)  return '#f97316'  // orange — urgent
    if (days <= 7)  return '#eab308'  // yellow — soon
    return '#22c55e'                  // green — fine
}

// Format date
export function formatDate(date: string): string {
    return format(new Date(date), 'MMM dd, yyyy')
}

// Calculate next renewal date
export function getNextRenewalDate(
    currentDate: string,
    cycle: BillingCycle
): Date {
    const date = new Date(currentDate)
    switch (cycle) {
        case 'weekly':  return addWeeks(date, 1)
        case 'monthly': return addMonths(date, 1)
        case 'yearly':  return addYears(date, 1)
    }
}

// Billing cycle label
export function getCycleLabel(cycle: BillingCycle): string {
    const labels = { weekly: 'week', monthly: 'month', yearly: 'year' }
    return labels[cycle]
}

// Popular services logos/colors
export const POPULAR_SERVICES: Record<string, { color: string; logo: string }> = {
    'Netflix':       { color: '#E50914', logo: '🎬' },
    'Spotify':       { color: '#1DB954', logo: '🎵' },
    'Amazon Prime':  { color: '#00A8E1', logo: '📦' },
    'YouTube':       { color: '#FF0000', logo: '▶️'  },
    'Disney+':       { color: '#113CCF', logo: '🏰' },
    'Apple Music':   { color: '#FA243C', logo: '🍎' },
    'GitHub':        { color: '#24292e', logo: '🐙' },
    'Figma':         { color: '#F24E1E', logo: '🎨' },
    'Notion':        { color: '#000000', logo: '📝' },
    'Slack':         { color: '#4A154B', logo: '💬' },
    'ChatGPT':       { color: '#74AA9C', logo: '🤖' },
    'Adobe':         { color: '#FF0000', logo: '🅰️' },
    'Zoom':          { color: '#2D8CFF', logo: '📹' },
    'Dropbox':       { color: '#0061FF', logo: '📁' },
    'Microsoft 365': { color: '#D83B01', logo: '💼' },
}